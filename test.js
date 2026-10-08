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

test("slot of day: 00, 06, 12, 18 boundaries", () => {
  assert.deepStrictEqual([0, 5, 6, 11, 12, 17, 18, 23].map((h) => R.slotOfDay(at(2026, 10, 8, h, 30))), [0, 0, 1, 1, 2, 2, 3, 3]);
});

test("same slot gives the same quote (00:00 to 05:59:59)", () => {
  const a = q(at(2026, 10, 8, 0, 0, 0));
  for (let m = 0; m < 360; m += 7) assert.strictEqual(q(at(2026, 10, 8, 0, m)), a);
  assert.strictEqual(q(at(2026, 10, 8, 5, 59, 59)), a);
  assert.strictEqual(q(at(2026, 10, 8, 19, 0)), q(at(2026, 10, 8, 23, 59, 59)));
});

test("adjacent slots differ (every slot boundary for 2 years)", () => {
  let d = at(2026, 1, 1, 0);
  for (let i = 0; i < 4 * 730; i++) {
    const next = R.nextSlotStart(d);
    assert.notStrictEqual(q(d), q(next), "same quote at " + d + " and " + next);
    assert.strictEqual(R.slotIndex(next), R.slotIndex(d) + 1, "slot index must increase by 1 at " + next);
    d = next;
  }
});

test("no repeats within one full cycle (several starting points)", () => {
  for (const start of [at(2026, 10, 8, 19), at(2024, 1, 1, 0), at(2027, 12, 31, 18), at(2023, 6, 15, 7)]) {
    const seen = new Set();
    let d = start;
    for (let i = 0; i < N; i++) {
      const idx = q(d);
      assert.ok(!seen.has(idx), "repeat of quote " + idx + " within cycle starting " + start);
      seen.add(idx);
      d = R.nextSlotStart(d);
    }
    assert.strictEqual(seen.size, N, "cycle should cover every quote");
    assert.strictEqual(q(d), q(start), "cycle should repeat after exactly N slots");
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
    assert.strictEqual(R.nextSlotStart(before).getTime(), new Date(after.getFullYear(), after.getMonth(), after.getDate(), 0).getTime());
    assert.strictEqual(R.slotOfDay(after), 0);
  });
}
boundary("midnight boundary (Oct 8 23:59 -> Oct 9 00:00)", at(2026, 10, 8, 23, 59, 59), at(2026, 10, 9, 0, 0, 0));
boundary("month boundary (Oct 31 -> Nov 1)", at(2026, 10, 31, 22), at(2026, 11, 1, 0));
boundary("year boundary (Dec 31 2026 -> Jan 1 2027)", at(2026, 12, 31, 23, 59), at(2027, 1, 1, 0, 0));
boundary("leap day (Feb 29 2028 -> Mar 1 2028)", at(2028, 2, 29, 18, 5), at(2028, 3, 1, 0, 0));
boundary("non-leap February (Feb 28 2027 -> Mar 1 2027)", at(2027, 2, 28, 20), at(2027, 3, 1, 0));

test("next slot start for each slot", () => {
  const d = at(2026, 10, 8, 19, 0);
  assert.strictEqual(R.nextSlotStart(at(2026, 10, 8, 3)).getHours(), 6);
  assert.strictEqual(R.nextSlotStart(at(2026, 10, 8, 6)).getHours(), 12);
  assert.strictEqual(R.nextSlotStart(at(2026, 10, 8, 17, 59)).getHours(), 18);
  assert.strictEqual(R.slotStart(d).getHours(), 18);
  assert.strictEqual(R.nextSlotStart(d).getTime() - d.getTime(), 5 * 3600 * 1000);
});

test("countdown formatting", () => {
  assert.deepStrictEqual(R.formatCountdown((3 * 60 + 12) * 60000), { en: "3h 12m", zh: "3 小時 12 分鐘" });
  assert.deepStrictEqual(R.formatCountdown(5 * 3600000), { en: "5h 00m", zh: "5 小時 00 分鐘" });
  assert.deepStrictEqual(R.formatCountdown(9 * 60000 + 5000), { en: "9m 05s", zh: "9 分 05 秒" });
  assert.deepStrictEqual(R.formatCountdown(-10), { en: "0m 00s", zh: "0 分 00 秒" });
});

test("?now= parsing (local time, rejects bad input)", () => {
  assert.strictEqual(R.parseNowParam("2026-10-08T19:00").getTime(), at(2026, 10, 8, 19).getTime());
  assert.strictEqual(R.parseNowParam("2026-10-08 07:30:15").getTime(), at(2026, 10, 8, 7, 30, 15).getTime());
  assert.strictEqual(R.parseNowParam("2026-10-08").getTime(), at(2026, 10, 8).getTime());
  for (const bad of [null, "", "tomorrow", "2026-02-30T10:00", "2026-13-01", "2026-10-08T24:00", "2026-10-08T19:00Z"]) {
    assert.strictEqual(R.parseNowParam(bad), null, "should reject " + bad);
  }
});

test("DST transition days still advance one slot at a time", () => {
  // Meaningful under TZ=America/New_York or Europe/London; harmless in Asia/Hong_Kong.
  for (const day of [at(2026, 3, 8), at(2026, 11, 1), at(2026, 3, 29), at(2026, 10, 25)]) {
    let d = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1, 0);
    for (let i = 0; i < 12; i++) {
      const next = R.nextSlotStart(d);
      assert.strictEqual(R.slotIndex(next), R.slotIndex(d) + 1, "around " + day.toDateString());
      d = next;
    }
  }
});

console.log((process.exitCode ? "FAILED" : "All " + passed + " tests passed") + ".");
