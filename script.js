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
});
