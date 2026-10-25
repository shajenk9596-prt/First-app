/* ==========================================================
   SCRIPT.JS  (one file for every page)
   1. Phone menu   2. Slide-in paragraphs + highlighter sweep
   3. Flip cards   4. Road, van, and finish flag
   ========================================================== */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. PHONE MENU */
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* 2. SLIDE-IN: anything with class "reveal" appears as you scroll to it.
        Marked phrases inside it get their orange underline at the same time. */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* 3. FLIP CARDS: tap to flip, tap again to flip back */
  document.querySelectorAll(".flip").forEach(function (card) {
    var front = card.querySelector(".front");
    var back = card.querySelector(".back");
    back.setAttribute("aria-hidden", "true");
    card.addEventListener("click", function () {
      var on = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", on);
      front.setAttribute("aria-hidden", on ? "true" : "false");
      back.setAttribute("aria-hidden", on ? "false" : "true");
    });
  });

  /* 4. ROADS: move the van down the road and light up each stop it passes */
  var roads = Array.prototype.map.call(document.querySelectorAll(".road-wrap"), function (w) {
    return {
      wrap: w,
      van: w.querySelector(".van"),
      chapters: w.querySelectorAll(".chapter"),
      finish: w.querySelector(".finish")
    };
  });
  if (!roads.length) return;
  var ticking = false;

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var mark = vh * 0.55;                       /* the van sits about halfway down the screen */
    roads.forEach(function (rd) {
      var r = rd.wrap.getBoundingClientRect();
      var progress = Math.min(1, Math.max(0, (mark - r.top) / r.height));
      if (rd.van && !reduce) {
        var far = rd.finish ? rd.finish.offsetTop - rd.van.offsetHeight - 6 : r.height - rd.van.offsetHeight;
        rd.van.style.top = progress * far + "px";
      }
      if (rd.finish) { rd.finish.classList.toggle("reached", progress > 0.96); }
      rd.chapters.forEach(function (c) {
        c.classList.toggle("reached", c.getBoundingClientRect().top < mark);
      });
    });
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
