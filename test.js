// Run with: node test.js   (optionally: TZ=America/New_York node test.js)
"use strict";
const assert = require("assert");
const R = require("./rotation.js");
const QUOTES = require("./quotes.js");
const N = QUOTES.length;

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log("  ok  " + name);
  } catch (err) {
    console.error("  FAIL " + name + "\n       " + err.message);
    process.exitCode = 1;
  }
}
const at = (y, mo, d, h = 0, mi = 0, s = 0) => new Date(y, mo - 1, d, h, mi, s);
const q = (date) => R.quoteIndexFor(date, N);

console.log("Live & Enjoy tests (TZ=" + (process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone) + ", " + N + " quotes)");

test("quote data is complete and has no duplicates", () => {
  assert.ok(N >= 60, "need at least 60 quotes, have " + N);
  const seen = new Set();
  QUOTES.forEach((x, i) => {
    for (const f of ["en", "zh", "author", "authorZh", "source", "kind"]) {
      assert.ok(typeof x[f] === "string" && x[f].trim(), "quote " + i + " missing " + f);
    }
    assert.ok(x.kind === "real" || x.kind === "original", "quote " + i + " bad kind");
    if (x.kind === "original") assert.strictEqual(x.author, "Live & Enjoy", "original quote " + i + " must be credited to Live & Enjoy");
    assert.ok(!seen.has(x.en), "duplicate quote: " + x.en);
    seen.add(x.en);
  });
});

test("slot of day is the local hour (0..23)", () => {
  for (let h = 0; h < 24; h++) {
    assert.strictEqual(R.slotOfDay(at(2026, 10, 8, h, 0, 0)), h);
    assert.strictEqual(R.slotOfDay(at(2026, 10, 8, h, 59, 59)), h);
  }
  assert.strictEqual(R.SLOT_HOURS, 1);
});

test("same hour gives the same quote (19:00:00 to 19:59:59)", () => {
  const a = q(at(2026, 10, 8, 19, 0, 0));
  for (let s = 0; s < 3600; s += 37) assert.strictEqual(q(new Date(at(2026, 10, 8, 19).getTime() + s * 1000)), a);
  assert.strictEqual(q(at(2026, 10, 8, 19, 59, 59)), a);
});

test("quote changes exactly at the top of the hour (:59:59 -> :00:00)", () => {
  for (let h = 0; h < 24; h++) {
    const before = at(2026, 10, 8, h, 59, 59);
    const after = at(2026, 10, 8, h + 1, 0, 0); // h + 1 = 24 rolls over to Oct 9 00:00
    assert.notStrictEqual(q(before), q(after), "no change at " + after);
    assert.strictEqual(R.slotIndex(after), R.slotIndex(before) + 1);
    assert.strictEqual(R.nextSlotStart(before).getTime(), after.getTime());
    assert.strictEqual(R.slotStart(after).getTime(), after.getTime());
  }
});

test("consecutive hours differ (every hour for 2 years)", () => {
  let d = at(2026, 1, 1, 0);
  for (let i = 0; i < 24 * 730; i++) {
    const next = R.nextSlotStart(d);
    assert.notStrictEqual(q(d), q(next), "same quote at " + d + " and " + next);
    assert.ok(next > d, "next hour must be later than " + d);
    const step = R.slotIndex(next) - R.slotIndex(d);
    // +1 normally; +2 only across a skipped spring-forward hour in DST time zones.
    assert.ok(step === 1 || (step === 2 && next.getTime() - d.getTime() <= 3600000), "slot index step " + step + " at " + next);
    d = next;
  }
});

test("no repeats within one full cycle of N hours (several starting points)", () => {
  for (const start of [at(2026, 10, 8, 19), at(2024, 1, 1, 0), at(2027, 12, 31, 23), at(2023, 6, 15, 7)]) {
    const seen = new Set();
    let d = start;
    for (let i = 0; i < N; i++) {
      const idx = R.quoteIndexFor(new Date(R.slotStart(d).getTime()), N);
      assert.ok(!seen.has(idx), "repeat of quote " + idx + " within cycle starting " + start);
      seen.add(idx);
      d = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours() + i + 1);
    }
    assert.strictEqual(seen.size, N, "cycle should cover every quote");
    assert.strictEqual(R.slotIndex(d) - R.slotIndex(start), N, "cycle is N hours long");
    assert.strictEqual(q(d), q(start), "cycle should repeat after exactly N hours");
  }
});

test("shuffled order is a fixed permutation", () => {
  const o = R.shuffledOrder(N);
  assert.deepStrictEqual([...o].sort((a, b) => a - b), [...Array(N).keys()]);
  assert.deepStrictEqual(R.shuffledOrder(N), o);
  assert.notDeepStrictEqual(o, [...Array(N).keys()], "order should actually be shuffled");
});

function boundary(name, before, after) {
  test(name, () => {
    assert.strictEqual(R.slotIndex(after), R.slotIndex(before) + 1);
    assert.notStrictEqual(q(before), q(after));
    assert.strictEqual(R.nextSlotStart(before).getTime(), after.getTime());
    assert.strictEqual(R.slotOfDay(after), 0);
  });
}
boundary("midnight boundary (Oct 8 23:59:59 -> Oct 9 00:00)", at(2026, 10, 8, 23, 59, 59), at(2026, 10, 9, 0, 0, 0));
boundary("month boundary (Oct 31 23:30 -> Nov 1 00:00)", at(2026, 10, 31, 23, 30), at(2026, 11, 1, 0));
boundary("year boundary (Dec 31 2026 23:59 -> Jan 1 2027)", at(2026, 12, 31, 23, 59), at(2027, 1, 1, 0, 0));
boundary("leap day (Feb 29 2028 23:05 -> Mar 1 2028)", at(2028, 2, 29, 23, 5), at(2028, 3, 1, 0, 0));
boundary("non-leap February (Feb 28 2027 23:00 -> Mar 1 2027)", at(2027, 2, 28, 23), at(2027, 3, 1, 0));

test("countdown runs to the next top of the hour", () => {
  const cd = (d) => R.nextSlotStart(d).getTime() - d.getTime();
  assert.strictEqual(cd(at(2026, 10, 8, 19, 0, 0)), 3600000);
  assert.strictEqual(cd(at(2026, 10, 8, 19, 17, 55)), (42 * 60 + 5) * 1000);
  assert.strictEqual(cd(at(2026, 10, 8, 19, 59, 59)), 1000);
  assert.strictEqual(cd(at(2026, 10, 8, 23, 45)), 15 * 60000);
  assert.strictEqual(R.nextSlotStart(at(2026, 10, 8, 9, 30)).getHours(), 10);
  assert.strictEqual(R.slotStart(at(2026, 10, 8, 9, 30)).getHours(), 9);
  assert.deepStrictEqual(R.formatCountdown(cd(at(2026, 10, 8, 19, 17, 55))), { en: "42m 05s", zh: "42 分 05 秒" });
  assert.deepStrictEqual(R.formatCountdown(cd(at(2026, 10, 8, 19, 0, 0))), { en: "1h 00m", zh: "1 小時 00 分鐘" });
});

test("countdown formatting", () => {
  assert.deepStrictEqual(R.formatCountdown((3 * 60 + 12) * 60000), { en: "3h 12m", zh: "3 小時 12 分鐘" });
  assert.deepStrictEqual(R.formatCountdown(59 * 60000 + 59000), { en: "59m 59s", zh: "59 分 59 秒" });
  assert.deepStrictEqual(R.formatCountdown(9 * 60000 + 5000), { en: "9m 05s", zh: "9 分 05 秒" });
  assert.deepStrictEqual(R.formatCountdown(-10), { en: "0m 00s", zh: "0 分 00 秒" });
});

test("time-of-day themes cover every hour", () => {
  const keys = [];
  for (let h = 0; h < 24; h++) keys.push(R.periodOf(at(2026, 10, 8, h, 30)).key);
  assert.deepStrictEqual(keys, [
    "night", "night", "night", "night", "night",
    "dawn", "dawn", "dawn",
    "morning", "morning", "morning", "morning",
    "afternoon", "afternoon", "afternoon", "afternoon",
    "sunset", "sunset", "sunset",
    "evening", "evening", "evening",
    "night", "night"
  ]);
  for (const p of R.PERIODS) assert.ok(p.en && p.zh, "period " + p.key + " needs labels");
});

test("?now= parsing (local time, rejects bad input)", () => {
  assert.strictEqual(R.parseNowParam("2026-10-08T19:00").getTime(), at(2026, 10, 8, 19).getTime());
  assert.strictEqual(R.parseNowParam("2026-10-08 07:30:15").getTime(), at(2026, 10, 8, 7, 30, 15).getTime());
  assert.strictEqual(R.parseNowParam("2026-10-08").getTime(), at(2026, 10, 8).getTime());
  for (const bad of [null, "", "tomorrow", "2026-02-30T10:00", "2026-13-01", "2026-10-08T24:00", "2026-10-08T19:00Z"]) {
    assert.strictEqual(R.parseNowParam(bad), null, "should reject " + bad);
  }
});

test("DST transition days: quote still changes on the hour, never goes backwards", () => {
  // Meaningful under TZ=America/New_York or Europe/London (see the next test); harmless in Asia/Taipei.
  for (const day of [at(2026, 3, 8), at(2026, 11, 1), at(2026, 3, 29), at(2026, 10, 25)]) {
    let d = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1, 12);
    for (let i = 0; i < 36; i++) {
      const next = R.nextSlotStart(d);
      const gap = next.getTime() - d.getTime();
      assert.ok(gap > 0 && gap <= 2 * 3600000, "next change " + gap / 60000 + " min after " + d);
      assert.strictEqual(next.getMinutes(), 0, "changes on the hour");
      assert.ok(R.slotIndex(next) > R.slotIndex(d), "slot index increases around " + day.toDateString());
      assert.notStrictEqual(q(next), q(d), "quote changes at " + next);
      d = next;
    }
    // Walking minute by minute in real time, the index never decreases.
    let prev = -Infinity;
    const t0 = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0).getTime();
    for (let t = t0; t < t0 + 6 * 3600000; t += 60000) {
      const idx = R.slotIndex(new Date(t));
      assert.ok(idx >= prev, "slot index went backwards at " + new Date(t));
      prev = idx;
    }
  }
});

if (!process.env.LE_CHILD) {
  test("hourly logic also passes in DST time zones (New York, London, Sydney)", () => {
    const { execFileSync } = require("child_process");
    for (const tz of ["America/New_York", "Europe/London", "Australia/Sydney"]) {
      try {
        execFileSync(process.execPath, [__filename], { env: Object.assign({}, process.env, { TZ: tz, LE_CHILD: "1" }), stdio: "pipe" });
      } catch (err) {
        throw new Error("tests failed under TZ=" + tz + ":\n" + String(err.stdout) + String(err.stderr));
      }
    }
  });
}

console.log((process.exitCode ? "FAILED" : "All " + passed + " tests passed") + ".");
