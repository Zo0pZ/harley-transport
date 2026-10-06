/* Harley Transport — site interactions
   Progressive enhancement: every feature here degrades gracefully if JS fails to load,
   because the underlying markup (links, forms, <details>-style content) still works. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Sticky header shrink ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var groups = {};
      revealEls.forEach(function (el) {
        var group = el.closest("[data-reveal-group]");
        if (group) {
          var key = group;
          groups[key] = groups[key] || 0;
          el.style.setProperty("--i", groups[key]++);
        }
      });
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count-to]");
  if (counters.length && "IntersectionObserver" in window) {
    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      var decimals = (el.getAttribute("data-count-to").split(".")[1] || "").length;
      var suffix = el.getAttribute("data-count-suffix") || "";
      if (reduceMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }
      var duration = 1400;
      var start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var countIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { countIo.observe(el); });
  }

  /* ---------- Hero video play/pause toggle ---------- */
  var videoToggle = document.querySelector("[data-video-toggle]");
  var heroVideo = document.querySelector("[data-hero-video]");
  if (videoToggle && heroVideo) {
    if (reduceMotion) { heroVideo.pause(); videoToggle.textContent = "Play footage"; }
    videoToggle.addEventListener("click", function () {
      if (heroVideo.paused) {
        heroVideo.play();
        videoToggle.innerHTML = videoToggle.getAttribute("data-pause-label");
      } else {
        heroVideo.pause();
        videoToggle.innerHTML = videoToggle.getAttribute("data-play-label");
      }
    });
  }

  /* ---------- Testimonial carousel ---------- */
  var track = document.querySelector("[data-testimonials]");
  if (track) {
    var slides = track.querySelectorAll(".testimonial-slide");
    var dotsWrap = track.parentElement.querySelector(".testimonial-dots");
    var current = 0;
    var timer;

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
        if (i === 0) dot.classList.add("is-active");
        dot.addEventListener("click", function () { goTo(i); });
        dotsWrap.appendChild(dot);
      });
    }

    function goTo(index) {
      slides[current].classList.remove("is-active");
      if (dotsWrap) dotsWrap.children[current].classList.remove("is-active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      if (dotsWrap) dotsWrap.children[current].classList.add("is-active");
    }

    function restartTimer() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { goTo(current + 1); }, 6000);
    }
    restartTimer();
    track.addEventListener("mouseenter", function () { clearInterval(timer); });
    track.addEventListener("mouseleave", restartTimer);
  }

  /* ---------- Parallax depth on fleet/hero imagery ---------- */
  var parallaxEls = document.querySelectorAll("[data-parallax] img");
  if (parallaxEls.length && !reduceMotion) {
    var parallaxTicking = false;
    var updateParallax = function () {
      parallaxEls.forEach(function (img) {
        var frame = img.closest("[data-parallax]");
        var rect = frame.getBoundingClientRect();
        var viewH = window.innerHeight || document.documentElement.clientHeight;
        if (rect.bottom < 0 || rect.top > viewH) return;
        var progress = (rect.top - viewH) / (rect.height + viewH);
        var shift = progress * 60;
        img.style.transform = "scale(1.18) translateY(" + shift.toFixed(2) + "px)";
      });
      parallaxTicking = false;
    };
    window.addEventListener("scroll", function () {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  /* ---------- Fleet gallery filter ---------- */
  var fleetFilters = document.querySelector("[data-fleet-filters]");
  if (fleetFilters) {
    var fleetCards = document.querySelectorAll("[data-fleet-category]");
    fleetFilters.querySelectorAll("[data-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        fleetFilters.querySelectorAll("[data-filter]").forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        var filter = btn.getAttribute("data-filter");
        fleetCards.forEach(function (card) {
          var matches = filter === "all" || card.getAttribute("data-fleet-category") === filter;
          card.classList.toggle("is-hidden", !matches);
        });
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.setAttribute("aria-expanded", "false");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach(function (open) {
        if (open !== item) {
          open.classList.remove("is-open");
          open.querySelector(".faq-a").style.maxHeight = null;
          open.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("is-open", !isOpen);
      q.setAttribute("aria-expanded", (!isOpen).toString());
      a.style.maxHeight = !isOpen ? a.scrollHeight + "px" : null;
    });
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.classList.toggle("is-visible", window.scrollY > 600);
    }, { passive: true });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Cookie consent banner ---------- */
  var cookieBanner = document.querySelector("[data-cookie-banner]");
  if (cookieBanner) {
    var CONSENT_KEY = "ht_cookie_consent";
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        setTimeout(function () { cookieBanner.classList.add("is-visible"); }, 600);
      }
    } catch (e) { /* storage unavailable, skip banner */ }

    cookieBanner.querySelectorAll("[data-cookie-choice]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try { localStorage.setItem(CONSENT_KEY, btn.getAttribute("data-cookie-choice")); } catch (e) {}
        cookieBanner.classList.remove("is-visible");
      });
    });
  }

  /* ---------- Social share buttons ---------- */
  document.querySelectorAll("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var network = btn.getAttribute("data-share");
      var url = encodeURIComponent(window.location.href);
      var title = encodeURIComponent(document.title);
      var shareUrls = {
        facebook: "https://www.facebook.com/sharer/sharer.php?u=" + url,
        x: "https://twitter.com/intent/tweet?url=" + url + "&text=" + title,
        linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=" + url,
        whatsapp: "https://wa.me/?text=" + title + "%20" + url,
        email: "mailto:?subject=" + title + "&body=" + url
      };
      if (network === "native" && navigator.share) {
        e.preventDefault();
        navigator.share({ title: document.title, url: window.location.href }).catch(function () {});
        return;
      }
      if (network === "copy") {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href).then(function () {
          var original = btn.getAttribute("aria-label");
          btn.setAttribute("aria-label", "Link copied!");
          btn.classList.add("copied");
          setTimeout(function () {
            btn.setAttribute("aria-label", original);
            btn.classList.remove("copied");
          }, 2000);
        });
        return;
      }
      if (shareUrls[network]) {
        e.preventDefault();
        window.open(shareUrls[network], "_blank", "noopener,noreferrer,width=600,height=500");
      }
    });
  });

  /* ---------- Multi-step quote form ---------- */
  var quoteForm = document.querySelector("[data-quote-form]");
  if (quoteForm) {
    var steps = quoteForm.querySelectorAll(".quote-step");
    var bars = quoteForm.querySelectorAll(".quote-progress .bar");
    var stepIndex = 0;

    /* Conditional logic: Step 2 shows different fields depending on the
       service picked in Step 1 (fleet hire needs hire dates, not a load). */
    var serviceSelect = quoteForm.querySelector("#q-service");
    var loadGroup = quoteForm.querySelector("[data-field-group='load']");
    var hireGroup = quoteForm.querySelector("[data-field-group='hire']");
    if (serviceSelect && loadGroup && hireGroup) {
      var syncServiceFields = function () {
        var isHire = serviceSelect.value === "Vehicle / Fleet Hire";
        loadGroup.hidden = isHire;
        hireGroup.hidden = !isHire;
        loadGroup.querySelectorAll("[data-required-for='load']").forEach(function (f) {
          f.required = !isHire;
        });
        hireGroup.querySelectorAll("[data-required-for='hire']").forEach(function (f) {
          f.required = isHire;
        });
      };
      serviceSelect.addEventListener("change", syncServiceFields);
      syncServiceFields();
    }

    function renderStep() {
      steps.forEach(function (step, i) { step.classList.toggle("is-active", i === stepIndex); });
      bars.forEach(function (bar, i) {
        bar.classList.toggle("is-active", i === stepIndex);
        bar.classList.toggle("is-done", i < stepIndex);
      });
      var liveStep = quoteForm.querySelector(".quote-step.is-active");
      if (liveStep) {
        var heading = liveStep.querySelector("h2, h3");
        if (heading) heading.setAttribute("tabindex", "-1");
      }
    }

    quoteForm.querySelectorAll("[data-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var currentStep = steps[stepIndex];
        var required = currentStep.querySelectorAll("[required]");
        var valid = true;
        required.forEach(function (field) {
          if (!field.checkValidity()) { field.reportValidity(); valid = false; }
        });
        if (!valid) return;
        if (stepIndex < steps.length - 1) { stepIndex++; renderStep(); }
      });
    });
    quoteForm.querySelectorAll("[data-prev]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (stepIndex > 0) { stepIndex--; renderStep(); }
      });
    });
    renderStep();

    quoteForm.addEventListener("submit", function (e) {
      if (quoteForm.hasAttribute("data-demo-only")) {
        e.preventDefault();
        quoteForm.style.display = "none";
        var successEl = document.querySelector("[data-form-success]");
        if (successEl) successEl.classList.add("is-active");
      }
    });
  }

  /* ---------- Generic demo-form success (contact / careers) ---------- */
  document.querySelectorAll("form[data-demo-only]:not([data-quote-form])").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.style.display = "none";
      var successEl = form.parentElement.querySelector("[data-form-success]");
      if (successEl) successEl.classList.add("is-active");
    });
  });

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
