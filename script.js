document.addEventListener("DOMContentLoaded", () => {
  const tooltipStyle = document.createElement("style");
  tooltipStyle.textContent = `
    .toc-link.locked_state {
      cursor: not-allowed !important;
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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

    if (window.innerWidth <= 991) {
      const tocLinksBlock = document.querySelector(".toc_links_block");
      if (tocLinksBlock) {
        tocLinksBlock.style.display = "block";
        tocLinksBlock.style.animation = "fadeInUp 0.5s ease-out forwards";
      }
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

  const aiSummary = document.querySelector("#ai_summary");
  if (aiSummary) {
    const originalText = aiSummary.textContent;
    aiSummary.textContent = "";
    let hasAnimated = false;

    const summaryObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          hasAnimated = true;
          summaryObserver.disconnect();
          const words = originalText.split(/\s+/);
          let i = 0;
          function streamWord() {
            if (i < words.length) {
              aiSummary.textContent += (i === 0 ? "" : " ") + words[i];
              i++;
              setTimeout(streamWord, 30 + Math.random() * 40);
            }
          }
          streamWord();
        }
      },
      { threshold: 0.2 }
    );
    summaryObserver.observe(aiSummary);
  }

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

  const emailShare = document.querySelector(".email_share");
  if (emailShare) {
    emailShare.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `mailto:?body=${encodeURIComponent(window.location.href)}`;
    });
  }

  const linkedinShare = document.querySelector(".linkedin_share");
  if (linkedinShare) {
    linkedinShare.addEventListener("click", (e) => {
      e.preventDefault();
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "width=600,height=600");
    });
  }

  const copyUrl = document.querySelector(".copy_url");
  if (copyUrl) {
    const copiedPopup = document.createElement("div");
    copiedPopup.textContent = "Link copied";
    Object.assign(copiedPopup.style, {
      position: "absolute",
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginTop: "6px",
      padding: "6px 12px",
      background: "#1a1a1a",
      color: "#fff",
      fontSize: "12px",
      borderRadius: "4px",
      whiteSpace: "nowrap",
      zIndex: "10000",
      display: "none",
    });
    copyUrl.style.position = "relative";
    copyUrl.appendChild(copiedPopup);

    copyUrl.addEventListener("click", (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href).then(() => {
        copiedPopup.style.display = "block";
        setTimeout(() => {
          copiedPopup.style.display = "none";
        }, 2000);
      });
    });
  }
});
