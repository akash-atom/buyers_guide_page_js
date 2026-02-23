document.addEventListener("DOMContentLoaded", () => {
  const tooltipStyle = document.createElement("style");
  tooltipStyle.textContent = `
    .toc-link.locked_state {
      cursor: not-allowed !important;
    }
    #toc-tooltip {
      position: fixed;
      padding: 6px 12px;
      background: #1a1a1a;
      color: #fff;
      font-size: 12px;
      line-height: 1.4;
      border-radius: 4px;
      white-space: nowrap;
      z-index: 10000;
      pointer-events: none;
      display: none;
    }
  `;
  document.head.appendChild(tooltipStyle);

  const tooltip = document.createElement("div");
  tooltip.id = "toc-tooltip";
  tooltip.textContent = "Complete the quiz to read the report";
  document.body.appendChild(tooltip);

  document.querySelectorAll(".toc-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      link.setAttribute("data-href", href);
      link.removeAttribute("href");
      link.style.cursor = "pointer";
    }

    link.addEventListener("mouseenter", () => {
      if (!link.classList.contains("locked_state")) return;
      const rect = link.getBoundingClientRect();
      tooltip.style.top = `${rect.bottom + 6}px`;
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.transform = "translateX(-50%)";
      tooltip.style.display = "block";
    });

    link.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
  });

  window.addEventListener("unlockTOC", () => {
    console.log("[buyers_guide_page_js] unlockTOC: removing locked_state and showing report_wrapper");
    document.querySelectorAll(".toc-link").forEach((link) => {
      link.classList.remove("locked_state");
    });

    const reportWrapper = document.querySelector(".report_wrapper");
    if (reportWrapper) {
      reportWrapper.style.display = "flex";
    }
  });

  window.addEventListener("showReport", () => {
    console.log("[buyers_guide_page_js] showReport: scrolling to report_wrapper");
    const reportWrapper = document.querySelector(".report_wrapper");
    if (reportWrapper) {
      const top =
        reportWrapper.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top, behavior: "smooth" });
      setTimeout(updateActiveTOC, 1000);
    }
  });

  let ticking = false;
  function updateActiveTOC() {
    const vh = window.innerHeight;
    const entryThreshold = vh * 0.9;
    const exitThreshold = vh * 0.05;
    const tocLinks = document.querySelectorAll(".toc-link");
    let activeHref = null;

    tocLinks.forEach((link) => {
      const href = link.getAttribute("data-href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top;
        if (top <= entryThreshold && top >= exitThreshold) {
          activeHref = href;
        }
      }
    });

    tocLinks.forEach((link) => {
      if (link.getAttribute("data-href") === activeHref) {
        link.classList.add("w--current");
      } else {
        link.classList.remove("w--current");
      }
    });
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveTOC();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  document.querySelectorAll(".toc-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.classList.contains("locked_state")) return;
      const targetId = link.getAttribute("data-href");
      if (!targetId || !targetId.startsWith("#")) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        e.stopPropagation();
        history.pushState(null, "", targetId);
        setTimeout(() => {
          const top =
            targetEl.getBoundingClientRect().top + window.scrollY - 84;
          window.scrollTo({ top, behavior: "smooth" });
          console.log(`[buyers_guide_page_js] TOC click: scrolling to ${targetId}`);
        }, 10);
      }
    });
  });
});
