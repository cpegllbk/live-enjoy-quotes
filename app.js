/* Live & Enjoy: page behaviour. Logic lives in rotation.js, quotes in quotes.js. */
(function () {
  "use strict";

  var R = window.LiveEnjoyRotation;
  var QUOTES = window.LIVE_ENJOY_QUOTES || [];
  var $ = function (id) { return document.getElementById(id); };

  // ---- Clock (supports ?now=YYYY-MM-DDTHH:MM to fake the time for testing/screenshots) ----
  var params = new URLSearchParams(window.location.search);
  var fakeStart = R.parseNowParam(params.get("now"));
  var offsetMs = fakeStart ? fakeStart.getTime() - Date.now() : 0;
  function now() { return new Date(Date.now() + offsetMs); }

  if (fakeStart) {
    var note = $("fake-note");
    note.hidden = false;
    var shown = fakeStart.getFullYear() + "-" + ("0" + (fakeStart.getMonth() + 1)).slice(-2) + "-" + ("0" + fakeStart.getDate()).slice(-2) +
      " " + ("0" + fakeStart.getHours()).slice(-2) + ":" + ("0" + fakeStart.getMinutes()).slice(-2);
    note.textContent = "Preview clock from the ?now= link: " + shown + " · 預覽時間（由 ?now= 設定）：" + shown;
  }

  var current = { slotIndex: null, quote: null };

  function dateLabel(d) {
    var en, zh;
    try {
      en = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
      zh = d.toLocaleDateString("zh-HK", { month: "long", day: "numeric", weekday: "short" });
    } catch (e) {
      en = d.toDateString();
      zh = "";
    }
    return en + (zh ? " · " + zh : "");
  }

  function showQuote(d) {
    var slot = R.SLOTS[R.slotOfDay(d)];
    var quote = QUOTES[R.quoteIndexFor(d, QUOTES.length)];
    current.quote = quote;

    document.body.className = "slot-" + slot.key;
    $("when").textContent = slot.en + " · " + slot.zh + " · " + dateLabel(d);

    var card = $("card");
    card.classList.toggle("is-long", quote.en.length > 150 || quote.zh.length > 70);
    $("quote-en").textContent = quote.en;
    $("quote-zh").textContent = quote.zh;
    $("author").textContent = quote.author + (quote.authorZh && quote.authorZh !== quote.author ? " · " + quote.authorZh : "");
    $("source").textContent = quote.source === "Original" ? "Original line for this app · 本 app 原創" : quote.source;

    // restart the fade-in animation
    card.classList.remove("fade-in");
    void card.offsetWidth;
    card.classList.add("fade-in");
  }

  function tick() {
    var d = now();
    var idx = R.slotIndex(d);
    if (idx !== current.slotIndex) {
      current.slotIndex = idx;
      showQuote(d);
    }
    var cd = R.formatCountdown(R.nextSlotStart(d).getTime() - d.getTime());
    $("cd-en").textContent = "Next quote in " + cd.en;
    $("cd-zh").textContent = "下一句：" + cd.zh + "後";
  }

  // ---- Copy & share ----
  function quoteText(q) {
    return q.en + "\n" + q.zh + "\n— " + q.author +
      (q.authorZh && q.authorZh !== q.author ? " · " + q.authorZh : "") +
      (q.source && q.source !== "Original" ? ", " + q.source : "");
  }

  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.textContent = ""; }, 2500);
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  $("copy-btn").addEventListener("click", function () {
    if (!current.quote) return;
    var text = quoteText(current.quote);
    var done = function () { toast("Copied! 已複製"); };
    var fail = function () { toast(fallbackCopy(text) ? "Copied! 已複製" : "Couldn't copy. 未能複製"); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fail);
    } else {
      fail();
    }
  });

  if (typeof navigator.share === "function") {
    var shareBtn = $("share-btn");
    shareBtn.hidden = false;
    shareBtn.addEventListener("click", function () {
      if (!current.quote) return;
      var data = { title: "Live & Enjoy · 活在當下", text: quoteText(current.quote) };
      if (/^https?:/.test(window.location.protocol)) data.url = window.location.origin + window.location.pathname;
      navigator.share(data).catch(function (err) {
        if (err && err.name !== "AbortError") toast("Couldn't share. 未能分享");
      });
    });
  }

  // ---- Start ----
  tick();
  setInterval(tick, 1000);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) tick(); });
})();
