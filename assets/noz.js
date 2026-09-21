/* ============================================================
   NOZ — Shared interactions
   Reveal-on-scroll · carousels · accordions · count-up ·
   email capture. Vanilla JS, no dependencies.
   Idempotent: safe to load more than once. Re-inits on
   Shopify theme-editor section load.
   ============================================================ */
(function () {
  "use strict";
  if (window.NOZ && window.NOZ.__ready) {
    // Already installed — just re-scan (e.g. a new section was pasted in).
    if (window.NOZ.init) window.NOZ.init();
    return;
  }

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Reveal on scroll ---------- */
  var revealObserver = null;
  function initReveal(root) {
    var els = (root || document).querySelectorAll(".noz-reveal:not([data-observed])");
    if (!els.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-in");
        el.setAttribute("data-observed", "");
      });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              revealObserver.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
    }
    els.forEach(function (el) {
      el.setAttribute("data-observed", "");
      revealObserver.observe(el);
    });
  }

  /* ---------- Count-up numbers ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var decimals = (el.getAttribute("data-decimals") || "0") | 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    if (reduceMotion) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }
    var start = null,
      dur = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var countObserver = null;
  function initCounts(root) {
    var els = (root || document).querySelectorAll("[data-count]:not([data-counted])");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.setAttribute("data-counted", "");
        animateCount(el);
      });
      return;
    }
    if (!countObserver) {
      countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              animateCount(e.target);
              countObserver.unobserve(e.target);
            }
          });
        },
        { threshold: 0.5 }
      );
    }
    els.forEach(function (el) {
      el.setAttribute("data-counted", "");
      countObserver.observe(el);
    });
  }

  /* ---------- Carousels (how-it-works / who-is-it-for on mobile) ---------- */
  function initCarousels(root) {
    var carousels = (root || document).querySelectorAll("[data-noz-carousel]:not([data-carousel-ready])");
    carousels.forEach(function (car) {
      car.setAttribute("data-carousel-ready", "");
      var track = car.querySelector("[data-carousel-track]");
      var dotsWrap = car.querySelector("[data-carousel-dots]");
      var prev = car.querySelector("[data-carousel-prev]");
      var next = car.querySelector("[data-carousel-next]");
      if (!track) return;
      var slides = Array.prototype.slice.call(track.children);

      function currentIndex() {
        var mid = track.scrollLeft + track.clientWidth / 2;
        var best = 0,
          bestDist = Infinity;
        slides.forEach(function (s, i) {
          var c = s.offsetLeft + s.clientWidth / 2;
          var d = Math.abs(c - mid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        return best;
      }
      function go(i) {
        var t = slides[Math.max(0, Math.min(slides.length - 1, i))];
        if (t) track.scrollTo({ left: t.offsetLeft, behavior: "smooth" });
      }
      // Dots
      if (dotsWrap) {
        dotsWrap.innerHTML = "";
        slides.forEach(function (_, i) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "noz-dot";
          b.setAttribute("aria-label", "Ir a la tarjeta " + (i + 1));
          b.addEventListener("click", function () {
            go(i);
          });
          dotsWrap.appendChild(b);
        });
      }
      function sync() {
        var idx = currentIndex();
        if (dotsWrap) {
          Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
            d.classList.toggle("is-active", i === idx);
          });
        }
      }
      var raf;
      track.addEventListener("scroll", function () {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(sync);
      });
      if (prev) prev.addEventListener("click", function () { go(currentIndex() - 1); });
      if (next) next.addEventListener("click", function () { go(currentIndex() + 1); });
      sync();
    });
  }

  /* ---------- Accordion (FAQ) ---------- */
  function initAccordions(root) {
    var items = (root || document).querySelectorAll("[data-noz-accordion]:not([data-acc-ready])");
    items.forEach(function (acc) {
      acc.setAttribute("data-acc-ready", "");
      var btn = acc.querySelector("[data-acc-trigger]");
      var panel = acc.querySelector("[data-acc-panel]");
      if (!btn || !panel) return;
      btn.addEventListener("click", function () {
        var open = acc.classList.contains("is-open");
        // Close siblings within the same list for a clean single-open feel
        var group = acc.closest("[data-noz-accordion-group]");
        if (group && !open) {
          group.querySelectorAll("[data-noz-accordion].is-open").forEach(function (other) {
            if (other !== acc) {
              other.classList.remove("is-open");
              var b = other.querySelector("[data-acc-trigger]");
              var p = other.querySelector("[data-acc-panel]");
              if (b) b.setAttribute("aria-expanded", "false");
              if (p) p.style.maxHeight = null;
            }
          });
        }
        acc.classList.toggle("is-open", !open);
        btn.setAttribute("aria-expanded", String(!open));
        panel.style.maxHeight = open ? null : panel.scrollHeight + "px";
      });
    });
  }

  /* ---------- Email capture (front-end validation + UX) ---------- */
  function initForms(root) {
    var forms = (root || document).querySelectorAll("[data-noz-form]:not([data-form-ready])");
    forms.forEach(function (form) {
      form.setAttribute("data-form-ready", "");
      var input = form.querySelector('input[type="email"]');
      var msg = form.querySelector("[data-form-msg]");
      form.addEventListener("submit", function (e) {
        // If pointed at a real endpoint (Shopify customer form / Klaviyo), let it submit.
        var isNative = form.getAttribute("data-native") === "true";
        var valid = input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        if (!valid) {
          e.preventDefault();
          if (msg) {
            msg.textContent = "Introduce un correo válido.";
            msg.className = "noz-form-msg is-error";
          }
          if (input) input.focus();
          return;
        }
        if (!isNative) {
          e.preventDefault();
          if (msg) {
            msg.textContent = "¡Listo! Estás en la lista de lanzamiento.";
            msg.className = "noz-form-msg is-ok";
          }
          form.classList.add("is-done");
          input.value = "";
        }
      });
    });
  }

  /* ---------- Subtle pointer parallax ---------- */
  function initParallax(root) {
    if (reduceMotion) return;
    var scopes = (root || document).querySelectorAll("[data-noz-parallax-scope]:not([data-parallax-ready])");
    scopes.forEach(function (scope) {
      scope.setAttribute("data-parallax-ready", "");
      var layers = scope.querySelectorAll("[data-noz-parallax]");
      if (!layers.length) return;
      scope.addEventListener("pointermove", function (e) {
        var r = scope.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach(function (l) {
          var depth = parseFloat(l.getAttribute("data-noz-parallax")) || 10;
          l.style.transform = "translate3d(" + x * depth + "px," + y * depth + "px,0)";
        });
      });
      scope.addEventListener("pointerleave", function () {
        layers.forEach(function (l) { l.style.transform = ""; });
      });
    });
  }

  function init(root) {
    initReveal(root);
    initCounts(root);
    initCarousels(root);
    initAccordions(root);
    initForms(root);
    initParallax(root);
  }

  window.NOZ = { init: init, __ready: true };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { init(); });
  } else {
    init();
  }

  // Shopify theme editor lifecycle
  document.addEventListener("shopify:section:load", function (e) { init(e.target); });
  document.addEventListener("shopify:section:select", function (e) { init(e.target); });
})();
