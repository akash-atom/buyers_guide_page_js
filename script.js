document.addEventListener("DOMContentLoaded", () => {
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
    }
  });

  document.querySelectorAll(".toc-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
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
