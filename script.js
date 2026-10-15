/* Progressive enhancement only: the page is complete without this file.
   Theme toggle · copy email · sticky nav · the footer paws and the Bernese
   who sits at the end of them (pet it: a heart and a happy tail). */
(function () {
  "use strict";

  var root = document.documentElement;
  var mm = function (q) { return window.matchMedia ? window.matchMedia(q) : { matches: false }; };
  var darkMQ = mm("(prefers-color-scheme: dark)");
  var motionMQ = mm("(prefers-reduced-motion: reduce)");
  var reduced = function () { return !!motionMQ.matches; };
  var onChange = function (mq, fn) {
    if (mq.addEventListener) mq.addEventListener("change", fn);
    else if (mq.addListener) mq.addListener(fn);
  };

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
  var dog = document.querySelector(".dog");
  var themeMetas = document.querySelectorAll('meta[name="theme-color"]');

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
    // The title is the dog button's accessible name (and its tooltip).
    if (dog) dog.title = dark ? "Pet the sleeping dog" : "Pet the dog";
  }

  // Set further down: lets the footer dog stir if it is on screen when the theme changes.
  var stirIfSeen = function () {};

  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener("click", function () {
      var next = theme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
      sync();
      stirIfSeen();
    });
  }
  onChange(darkMQ, function () { sync(); stirIfSeen(); });
  sync();

  /* ----- Short messages for screen readers (copy email, pet the dog) ----- */
  var status = document.getElementById("live-status");
  function announce(msg) {
    if (!status) return;
    // Clear first, then set on the next tick so a repeat is announced again.
    status.textContent = "";
    setTimeout(function () { status.textContent = msg; }, 60);
  }

  /* ----- The Bernese in the footer: pet, blink, look ----- */
  // A single friendly wag (light theme only); the footer paws call it once they have walked in.
  var sayHello = function () {};

  if (dog) {
    var head = dog.querySelector(".dog-head");
    var petTimer = 0;

    dog.addEventListener("click", function () {
      dog.classList.remove("is-petted", "is-hello");
      void dog.getBoundingClientRect(); // restart the animations
      dog.classList.add("is-petted");   // heart + faster tail wag (see style.css)
      clearTimeout(petTimer);
      petTimer = setTimeout(function () { dog.classList.remove("is-petted"); }, 1600);
      announce(theme() === "dark" ? "The sleeping dog wags its tail." : "The dog wags its tail.");
    });

    sayHello = function () {
      if (reduced() || theme() === "dark" || dog.classList.contains("is-petted")) return;
      dog.classList.add("is-hello");
      setTimeout(function () { dog.classList.remove("is-hello"); }, 1100);
    };

    // A few seconds of idle life each time the dog comes into view (or the
    // theme changes while it is in view): by day it blinks twice, by night it
    // breathes and its z's drift (.is-stirring in style.css). Then it rests,
    // so nothing moves by itself for more than five seconds.
    var stirTimers = [];
    var later = function (fn, ms) { stirTimers.push(setTimeout(fn, ms)); };
    function blink(ms) {
      dog.classList.add("is-blinking");
      later(function () { dog.classList.remove("is-blinking"); }, ms);
    }
    function rest() {
      stirTimers.forEach(clearTimeout);
      stirTimers = [];
      dog.classList.remove("is-stirring", "is-blinking");
    }
    function stir() {
      rest();
      if (reduced() || document.hidden) return;
      if (theme() === "dark") {
        void dog.getBoundingClientRect(); // restart the animations
        dog.classList.add("is-stirring");
        later(function () { dog.classList.remove("is-stirring"); }, 4700);
      } else {
        later(function () { blink(130); }, 1700 + Math.random() * 500);
        later(function () {
          blink(130);
          later(function () { blink(110); }, 300);
        }, 3600 + Math.random() * 500);
      }
    }
    if ("IntersectionObserver" in window) {
      var dogSeen = false;
      new IntersectionObserver(function (entries) {
        var seen = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.59; // mostly on screen
        if (seen && !dogSeen) stir();
        else if (!seen) rest();
        dogSeen = seen;
      }, { threshold: 0.6 }).observe(dog);
      stirIfSeen = function () { if (dogSeen) stir(); else rest(); };
    }

    // On desktops with a mouse: the head tilts a little toward the cursor.
    var fine = mm("(hover: hover) and (pointer: fine)");
    var mx = 0, frame = 0;
    function look() {
      frame = 0;
      var r = dog.getBoundingClientRect();
      var dx = mx - (r.left + r.width / 2);
      var deg = Math.max(-6, Math.min(6, dx / 90));
      head.style.setProperty("--look", deg.toFixed(2) + "deg");
    }
    function onMove(e) {
      mx = e.clientX;
      if (!frame) frame = requestAnimationFrame(look);
    }
    function setupLook() {
      window.removeEventListener("pointermove", onMove);
      if (head && fine.matches && !reduced()) {
        window.addEventListener("pointermove", onMove, { passive: true });
      } else if (head) {
        head.style.removeProperty("--look");
      }
    }
    setupLook();
    onChange(fine, setupLook);
    onChange(motionMQ, setupLook);
  }

  /* ----- Copy the email address ----- */
  var copyBtn = document.querySelector(".copy-btn");
  var emailText = document.getElementById("email-text");
  if (copyBtn && emailText && navigator.clipboard && window.isSecureContext) {
    copyBtn.hidden = false;
    var copyTimer = 0;
    copyBtn.addEventListener("click", function () {
      var done = function (ok) {
        copyBtn.textContent = ok ? "Copied!" : "Select & copy";
        copyBtn.classList.toggle("is-done", ok);
        if (!ok) {
          var range = document.createRange();
          range.selectNodeContents(emailText);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        announce(ok ? "Email address copied."
                    : "Couldn't copy automatically. The address is selected; press Ctrl+C or ⌘C.");
        clearTimeout(copyTimer);
        copyTimer = setTimeout(function () {
          copyBtn.textContent = "Copy";
          copyBtn.classList.remove("is-done");
        }, 1800);
      };
      navigator.clipboard.writeText(emailText.textContent.trim()).then(
        function () { done(true); },
        function () { done(false); }
      );
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

  /* ----- Footer: the three paws step in toward the dog, then it wags hello ----- */
  var trail = document.querySelector(".paw-trail");
  if (trail && "IntersectionObserver" in window && !reduced()) {
    trail.classList.add("is-waiting");
    var pawIO = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      pawIO.disconnect();
      trail.classList.add("is-walking");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { trail.classList.remove("is-waiting"); });
      });
      setTimeout(sayHello, 1150); // just after the last paw lands
    }, { threshold: 1 });
    pawIO.observe(trail);
  }
})();
