/* Progressive enhancement only: the page is complete without this file.
   Theme toggle · copy email · the dog in the footer · sticky nav. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");   // tells style.css that this file is running (used by the footer dog)
  var mm = function (q) { return window.matchMedia ? window.matchMedia(q) : { matches: false }; };
  var darkMQ = mm("(prefers-color-scheme: dark)");
  var motionMQ = mm("(prefers-reduced-motion: reduce)");
  var reduced = function () { return !!motionMQ.matches; };

  function theme() {
    var t = root.getAttribute("data-theme");
    if (t === "light" || t === "dark") return t;
    return darkMQ.matches ? "dark" : "light";
  }

  /* ----- Smooth in-page scrolling, switched on once the page has settled ----- */
  // A #link opened cold must jump instantly: a smooth scroll is aimed before the
  // web fonts swap in and would leave the heading under the sticky bar.
  window.addEventListener("load", function () {
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(function () { root.classList.add("smooth-scroll"); });
  });

  /* ----- Theme toggle ----- */
  var toggle = document.querySelector(".theme-toggle");
  var themeMetas = document.querySelectorAll('meta[name="theme-color"]');
  var dogBtn = document.querySelector(".dog");   // the footer dog: awake by day, asleep after dark

  function sync() {
    var dark = theme() === "dark";
    // Keep the browser UI tint in step with a manual choice, not just the OS.
    for (var i = 0; i < themeMetas.length; i++) {
      themeMetas[i].setAttribute("content", dark ? "#111726" : "#FAF7F1");
    }
    if (toggle) {
      toggle.setAttribute("aria-pressed", dark ? "true" : "false");
      toggle.title = dark ? "Lights on" : "Lights off";
    }
    // its title is the dog button's name (and tooltip)
    if (dogBtn) dogBtn.title = dark ? "Pet the sleeping dog" : "Pet the dog";
  }

  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener("click", function () {
      var next = theme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
      sync();
    });
  }
  if (darkMQ.addEventListener) darkMQ.addEventListener("change", sync);
  else if (darkMQ.addListener) darkMQ.addListener(sync);
  sync();

  /* ----- Short messages for screen readers (copy email, pet the dog) ----- */
  var status = document.getElementById("live-status");
  function announce(msg) {
    if (!status) return;
    // Clear first, then set on the next tick so a repeat is announced again.
    status.textContent = "";
    setTimeout(function () { status.textContent = msg; }, 60);
  }

  /* ----- The Bernese lying on the footer line ----- */
  // While the footer is on screen it takes a slow breath or two (awake it
  // blinks; asleep its z's drift), lies still for a few seconds, and again:
  // a few rounds each time you reach the footer, then it just lies there. Pointing at it or reaching it
  // with Tab brings a couple more breaths. Petting it shows a heart and thumps
  // its tail, and it stops the rounds for the rest of the visit.
  // style.css draws all of this, including how long a breath takes; here we
  // only add and remove its classes.
  var dog = document.querySelector(".dog");
  var chest = dog && dog.querySelector(".s-breathe");   // the part that breathes
  if (chest) {
    var ROUNDS = 6;     // rounds of breathing each time you reach the footer
    var seen = false, petted = false, rounds = 0;
    var breaths = 0, taken = 0, nextTimer = 0, petTimer = 0, saidAt = 0;
    var now = function () { return Date.now() / 1000; };

    var stopBreathing = function () {
      clearTimeout(nextTimer);
      dog.classList.remove("is-stirring");
      breaths = 0;
    };
    // n breaths from now (a breath already under way counts as one)
    var breathe = function (n) {
      if (!seen || reduced() || document.hidden) return;
      clearTimeout(nextTimer);
      if (!breaths) {
        taken = 0;
        void dog.offsetWidth;   // so the first breath starts from the beginning
        dog.classList.add("is-stirring");
      }
      breaths = Math.max(breaths, taken + n);
      dog.style.setProperty("--breaths", String(breaths));   // style.css plays this many
    };
    // Count the breaths as they finish. After the last one: rest a few
    // seconds, then the next round (one breath or two).
    chest.addEventListener("animationiteration", function (e) {
      if (e.target === chest) taken++;   // (not the tail's thump, which sits inside it)
    });
    chest.addEventListener("animationend", function (e) {
      if (e.target !== chest) return;
      stopBreathing();
      if (!petted && ++rounds < ROUNDS) {
        nextTimer = setTimeout(function () { breathe(rounds % 2 ? 1 : 2); }, 6000 + 4000 * Math.random());
      }
    });

    // The footer comes into view (or goes away again).
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var e = entries[entries.length - 1];
        var inView = e.isIntersecting && e.intersectionRatio >= 0.55;
        if (inView === seen) return;
        seen = inView;
        stopBreathing();
        rounds = 0;
        if (seen && !petted) breathe(2);
      }, { threshold: 0.55 }).observe(dog.parentNode);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopBreathing();
      else if (!petted && rounds < ROUNDS) breathe(1);
    });

    dog.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") breathe(2); });
    dog.addEventListener("focus", function () {
      var kb = true;
      try { kb = dog.matches(":focus-visible"); } catch (err) { /* older browser: treat as keyboard */ }
      if (kb) breathe(2);
    });

    // Holding Enter down repeats the key; one press is one pet.
    dog.addEventListener("keydown", function (e) {
      if (e.repeat && (e.key === "Enter" || e.key === " ")) e.preventDefault();
    });
    dog.addEventListener("click", function () {
      petted = true;
      clearTimeout(nextTimer);
      dog.classList.remove("is-petted");
      void dog.offsetWidth;   // restart the heart if it is still floating
      dog.classList.add("is-petted");
      clearTimeout(petTimer);
      petTimer = setTimeout(function () { dog.classList.remove("is-petted"); }, 1700);
      // pet it again and again and a screen reader hears it at most every 2 seconds
      if (now() - saidAt > 2) { saidAt = now(); announce(theme() === "dark" ? "The sleeping dog wags its tail." : "The dog wags its tail."); }
    });
  }

  /* ----- Copy an email address (one Copy button per address) ----- */
  // Each button copies the address it is described by (aria-describedby).
  if (navigator.clipboard && window.isSecureContext) {
    Array.prototype.forEach.call(document.querySelectorAll(".copy-btn"), function (btn) {
      var text = document.getElementById(btn.getAttribute("aria-describedby"));
      if (!text) return;
      btn.hidden = false;
      var timer = 0;
      btn.addEventListener("click", function () {
        var done = function (ok) {
          btn.textContent = ok ? "Copied!" : "Select & copy";
          btn.classList.toggle("is-done", ok);
          if (!ok) {
            var range = document.createRange();
            range.selectNodeContents(text);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
          announce(ok ? "Email address copied."
                      : "Couldn't copy automatically. The address is selected; press Ctrl+C or ⌘C.");
          clearTimeout(timer);
          timer = setTimeout(function () {
            btn.textContent = "Copy";
            btn.classList.remove("is-done");
          }, 1800);
        };
        navigator.clipboard.writeText(text.textContent.trim()).then(
          function () { done(true); },
          function () { done(false); }
        );
      });
    });
  }


  /* ----- Sticky header hairline + current section in the nav ----- */
  var header = document.querySelector(".site-header");
  var nav = document.querySelector(".site-nav");
  var links = [].slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });

  // On phones the nav is a scrolling row with faded edges: bring a link (the
  // current one, or one reached with Tab) fully clear of the fades.
  function reveal(a, smooth) {
    if (!nav || nav.scrollWidth <= nav.clientWidth + 1) return;
    var nr = nav.getBoundingClientRect(), ar = a.getBoundingClientRect();
    var dl = ar.left - (nr.left + 28);   // left fade is 22px, focus ring 5px
    var dr = ar.right - (nr.right - 36); // right fade is 28px
    var by = dl < 0 ? dl : (dr > 0 ? dr : 0);
    if (by) nav.scrollBy({ left: by, behavior: smooth && !reduced() ? "smooth" : "auto" });
  }
  // Keyboard focus only: moving the row under a finger or mouse would lose the tap.
  if (nav) nav.addEventListener("focusin", function (e) {
    var kb = false;
    try { kb = e.target.matches(":focus-visible"); } catch (err) { /* no :focus-visible: leave it */ }
    if (kb) reveal(e.target, false);
  });

  // A 1px marker at the very top: once it scrolls away, the bar gets its hairline.
  if (header && "IntersectionObserver" in window) {
    var marker = document.createElement("div");
    marker.setAttribute("aria-hidden", "true");
    marker.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none";
    document.body.insertBefore(marker, document.body.firstChild);
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-stuck", !entries[0].isIntersecting);
    }).observe(marker);
  }

  if (links.length) {
    var current = -1;
    // After a jump (nav click, in-page link, #link in the URL) the section you
    // chose stays marked, even if it is too short to reach the reading line,
    // until you move the page yourself. A key or wheel that doesn't move it
    // (Tab to the next link, a wheel at the very bottom) keeps the mark.
    var pinned = -1;
    var gestureY = null; // where the page was when you first wheeled/touched/pressed a key after the jump
    function setCurrent(index) {
      if (index === current) return;
      current = index;
      links.forEach(function (a, i) {
        if (i === index) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
      if (index >= 0) reveal(links[index], true);
    }
    function pick() {
      if (pinned >= 0 && gestureY !== null && Math.abs(window.pageYOffset - gestureY) > 4) {
        pinned = -1; // you have scrolled since the jump: follow the page again
        gestureY = null;
      }
      if (pinned >= 0) { setCurrent(pinned); return; }
      // Truly at the bottom: the last (short) section can never reach the line.
      var se = document.scrollingElement || root;
      if (window.pageYOffset > 0 && window.pageYOffset + window.innerHeight >= se.scrollHeight - 2) {
        setCurrent(sections.length - 1);
        return;
      }
      // Otherwise: the last section whose top has passed 40% down the window.
      var line = window.innerHeight * 0.4;
      var index = -1;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i] && sections[i].getBoundingClientRect().top <= line) index = i;
      }
      setCurrent(index);
    }
    var ticking = 0;
    function schedule() {
      if (!ticking) ticking = requestAnimationFrame(function () { ticking = 0; pick(); });
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Which nav section holds the element with this id (-1 for #top, #main, …)?
    function sectionFor(id) {
      try { id = decodeURIComponent(id); } catch (e) { /* keep as is */ }
      var el = id ? document.getElementById(id) : null;
      for (var j = 0; el && j < sections.length; j++) {
        if (sections[j] && sections[j].contains(el)) return j;
      }
      return -1;
    }
    function pinTo(id) { pinned = sectionFor(id); gestureY = null; pick(); }
    function gesture(e) {
      if (e && nav && e.target && nav.contains(e.target) && e.type !== "keydown") return; // swiping the nav row itself
      if (pinned >= 0 && gestureY === null) gestureY = window.pageYOffset;
    }

    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (a) pinTo(a.getAttribute("href").slice(1));
    });
    window.addEventListener("hashchange", function () { pinTo(location.hash.slice(1)); });
    // Moving the page by hand releases the pin (the jump's own smooth scroll does not):
    // a gesture notes where the page was, and pick() lets go once it has really moved.
    window.addEventListener("wheel", gesture, { passive: true });
    window.addEventListener("touchmove", gesture, { passive: true });
    window.addEventListener("keydown", gesture);
    window.addEventListener("pointerdown", function (e) { if (e.target === root) gesture(); }); // scrollbar drag

    if (location.hash) pinTo(location.hash.slice(1));
    else pick();
  }

  // Mobile nav row: fade whichever edge has more links hidden behind it.
  if (nav) {
    var fade = function () {
      var max = nav.scrollWidth - nav.clientWidth;
      nav.classList.toggle("is-scrolled-x", nav.scrollLeft > 2 && nav.scrollLeft < max - 2);
      nav.classList.toggle("is-at-end", max > 2 && nav.scrollLeft >= max - 2);
    };
    nav.addEventListener("scroll", fade, { passive: true });
    window.addEventListener("resize", fade);
    fade();
  }
})();
