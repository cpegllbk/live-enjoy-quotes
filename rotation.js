/*
 * Live & Enjoy rotation logic (no DOM). Works in the browser (window.LiveEnjoyRotation)
 * and in Node (require("./rotation.js")).
 *
 * Each local-time hour is one slot: the quote changes at the top of every hour (xx:00)
 * in the viewer's local time.
 * slotIndex = (days since 2024-01-01, local calendar) * 24 + local hour of day.
 * The quote is order[slotIndex mod N], where order is a fixed, seeded shuffle of 0..N-1.
 * So every N consecutive hours show N different quotes (67 quotes = a 67-hour cycle),
 * then the cycle repeats.
 *
 * DST: the index uses the local calendar date and local hour, not elapsed milliseconds.
 * When clocks spring forward, the skipped hour simply never shows (the index jumps by 2,
 * still a different quote). When clocks fall back, the repeated hour keeps the same quote
 * for both passes, and the countdown runs to the next real change.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.LiveEnjoyRotation = api;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SLOT_HOURS = 1;
  var SLOTS_PER_DAY = 24 / SLOT_HOURS; // 24
  var EPOCH_UTC = Date.UTC(2024, 0, 1); // calendar epoch, used only for day counting
  var DAY_MS = 86400000;
  var DEFAULT_SEED = 20261008;

  /*
   * Time-of-day themes (label + background gradient). The quote changes every hour;
   * the theme follows the local hour so the background drifts through the day.
   * `from` is the first local hour of each period, in order.
   */
  var PERIODS = [
    { key: "night", en: "Night", zh: "夜深", from: 0 },
    { key: "dawn", en: "Dawn", zh: "清晨", from: 5 },
    { key: "morning", en: "Morning", zh: "早晨", from: 8 },
    { key: "afternoon", en: "Afternoon", zh: "午後", from: 12 },
    { key: "sunset", en: "Sunset", zh: "日落", from: 16 },
    { key: "evening", en: "Evening", zh: "晚上", from: 19 },
    { key: "night", en: "Night", zh: "夜深", from: 22 }
  ];

  /** Slot of the day (0..23) = the local hour. */
  function slotOfDay(date) {
    return Math.floor(date.getHours() / SLOT_HOURS);
  }

  /** Time-of-day theme for the date's local hour. */
  function periodOf(date) {
    var h = date.getHours();
    var p = PERIODS[0];
    for (var i = 0; i < PERIODS.length; i++) {
      if (h >= PERIODS[i].from) p = PERIODS[i];
    }
    return p;
  }

  /** Whole local calendar days since 2024-01-01 (DST-safe: uses the calendar date, not elapsed ms). */
  function dayNumber(date) {
    var utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    return Math.round((utcMidnight - EPOCH_UTC) / DAY_MS);
  }

  /** Global slot counter: increases by 1 at the top of every local hour (DST-safe, see header). */
  function slotIndex(date) {
    return dayNumber(date) * SLOTS_PER_DAY + slotOfDay(date);
  }

  /** Small deterministic PRNG (mulberry32). */
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var orderCache = {};

  /** Fixed shuffled order of 0..n-1 (Fisher-Yates with a seeded PRNG). */
  function shuffledOrder(n, seed) {
    seed = seed === undefined ? DEFAULT_SEED : seed;
    var key = n + ":" + seed;
    if (orderCache[key]) return orderCache[key];
    var order = [];
    for (var i = 0; i < n; i++) order.push(i);
    var rand = mulberry32(seed);
    for (var j = n - 1; j > 0; j--) {
      var k = Math.floor(rand() * (j + 1));
      var tmp = order[j];
      order[j] = order[k];
      order[k] = tmp;
    }
    orderCache[key] = order;
    return order;
  }

  /** Index into the quote list for a given moment. */
  function quoteIndexFor(date, n, seed) {
    if (!n || n < 1) throw new Error("Quote list is empty");
    var order = shuffledOrder(n, seed);
    var pos = ((slotIndex(date) % n) + n) % n;
    return order[pos];
  }

  /** Local start of the slot containing `date`. */
  function slotStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), slotOfDay(date) * SLOT_HOURS, 0, 0, 0);
  }

  /**
   * Local start of the next slot, i.e. the next top of the hour. Hour 24 rolls over to the
   * next day, month and year. A skipped DST hour resolves to the first real hour after it.
   */
  function nextSlotStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), (slotOfDay(date) + 1) * SLOT_HOURS, 0, 0, 0);
  }

  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  }

  /** Countdown labels, e.g. { en: "42m 05s", zh: "42 分 05 秒" }. An hour or more (DST fall-back) shows hours and minutes. */
  function formatCountdown(ms) {
    var total = Math.max(0, Math.ceil(ms / 1000));
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var s = total % 60;
    if (h > 0) {
      return { en: h + "h " + pad2(m) + "m", zh: h + " 小時 " + pad2(m) + " 分鐘" };
    }
    return { en: m + "m " + pad2(s) + "s", zh: m + " 分 " + pad2(s) + " 秒" };
  }

  /**
   * Parse a ?now= value like "2026-10-08T19:00", "2026-10-08 19:00:30" or "2026-10-08".
   * Always interpreted as LOCAL time. Returns a Date or null if invalid.
   */
  function parseNowParam(value) {
    if (!value) return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(String(value).trim());
    if (!m) return null;
    var y = +m[1], mo = +m[2] - 1, d = +m[3];
    var hh = m[4] ? +m[4] : 0, mi = m[5] ? +m[5] : 0, ss = m[6] ? +m[6] : 0;
    if (mo < 0 || mo > 11 || d < 1 || d > 31 || hh > 23 || mi > 59 || ss > 59) return null;
    var date = new Date(y, mo, d, hh, mi, ss, 0);
    if (date.getMonth() !== mo || date.getDate() !== d) return null; // e.g. 2026-02-30
    return date;
  }

  return {
    SLOT_HOURS: SLOT_HOURS,
    PERIODS: PERIODS,
    DEFAULT_SEED: DEFAULT_SEED,
    slotOfDay: slotOfDay,
    periodOf: periodOf,
    dayNumber: dayNumber,
    slotIndex: slotIndex,
    shuffledOrder: shuffledOrder,
    quoteIndexFor: quoteIndexFor,
    slotStart: slotStart,
    nextSlotStart: nextSlotStart,
    formatCountdown: formatCountdown,
    parseNowParam: parseNowParam
  };
});
