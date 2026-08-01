import { closeSidebar } from "../ui/ui.js";
import { showView, applyToolFilter } from "./tools.js";

/* =========================================================
   DOM ELEMENTS
========================================================= */

const pages = document.querySelectorAll(".page");
const sidebarLinks = document.querySelectorAll(".sidebar-link");

/* =========================================================
   HELPERS
========================================================= */

const getSidebarButton = (page) =>
  document.querySelector(`.sidebar-link[data-page="${page}"]`);

/* =========================================================
   ROUTER 
========================================================= */

export const initRouter = () => {
  const page = window.location.hash.slice(1) || "home";

  renderPage(page);

  document.addEventListener("click", (event) => {
    const targetLink = event.target.closest(".nav-link");

    if (!targetLink) return;

    navigateTo(targetLink.dataset.page, targetLink.dataset.filter);
  });

  window.addEventListener("hashchange", () => {
    const page = window.location.hash.slice(1) || "home";

    renderPage(page);
  });
};

const renderPage = (page, filter) => {
  document.body.classList.toggle("workspace-active", page === "workspace");

  window.scrollTo(0, 0);

  updatePages(page);
  updateSidebar(page);
  updateFooter(page);
  updateHeader(page);

  closeSidebar();

  showView("cards");

  if (filter) {
    applyToolFilter(filter);
  }
};

const navigateTo = (page, filter) => {
  window.location.hash = page;
  renderPage(page, filter);
};

/* =========================================================
   UI STATE
========================================================= */

const updatePages = (page) => {
  pages.forEach((pageEl) => {
    pageEl.classList.remove("active");
  });

  const pageElement = document.querySelector(`#${page}`);

  if (!pageElement) return;

  pageElement.classList.add("active");
};

const updateSidebar = (page) => {
  sidebarLinks.forEach((link) => {
    link.classList.remove("active");
  });

  const activeLink = getSidebarButton(page);

  if (!activeLink) return;

  activeLink.classList.add("active");
};

const updateFooter = (page) => {
  const footer = document.querySelector("footer");

  if (!footer) return;

  page === "home"
    ? footer.classList.remove("u-hidden")
    : footer.classList.add("u-hidden");
};

const updateHeader = (page) => {
  const headerTitle = document.querySelector("#header-title");
  const headerDesc = document.querySelector("#header-description");

  const sidebarButton = getSidebarButton(page);

  if (!headerTitle || !headerDesc || !sidebarButton) return;

  headerTitle.textContent = sidebarButton.dataset.title;
  headerDesc.textContent = sidebarButton.dataset.description;
};
