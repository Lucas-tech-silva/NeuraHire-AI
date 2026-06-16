import { closeSidebar } from "../ui/ui.js";

const pages = document.querySelectorAll(".page");
const sideBarLinks = document.querySelectorAll(".sidebar-link");

const getSidebarButton = (page) =>
  document.querySelector(`.sidebar-link[data-page="${page}"]`);

export const initRouter = () => {
  const page = window.location.hash.slice(1) || "home";
  renderPage(page);

  document.addEventListener("click", (event) => {
    const targetLink = event.target.closest(".nav-link");

    if (!targetLink) return;

    navigateTo(targetLink.dataset.page);
  });

  window.addEventListener("hashchange", () => {
    const page = window.location.hash.slice(1) || "home";
    renderPage(page);
  });
};

const renderPage = (page) => {
  updatePages(page);
  updateSidebar(page);
  updateFooter(page);
  updateHeader(page);

  closeSidebar();
};

const navigateTo = (page) => {
  window.location.hash = page;
};

const updatePages = (page) => {
  pages.forEach((pageEl) => {
    pageEl.classList.remove("active");
  });

  const pageElement = document.querySelector(`#${page}`);

  if (!pageElement) return;

  pageElement.classList.add("active");
};

const updateSidebar = (page) => {
  sideBarLinks.forEach((link) => {
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

  if (!sidebarButton) return;

  headerTitle.textContent = sidebarButton.dataset.title;
  headerDesc.textContent = sidebarButton.dataset.description;
};