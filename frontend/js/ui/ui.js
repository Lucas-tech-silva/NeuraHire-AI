/* =========================================================
   DOM ELEMENTS
========================================================= */

const sidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.querySelector("#overlay");
const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");

const clock = document.querySelector(".clock");

const toast = document.querySelector("#toast");

/* =========================================================
   MOBILE MENU
========================================================= */

export const initMobileMenu = () => {
  if (!sidebar || !sidebarOverlay || !menuToggle || !menuClose) return;

  menuToggle.addEventListener("click", openSidebar);
  menuClose.addEventListener("click", closeSidebar);
  sidebarOverlay.addEventListener("click", closeSidebar);
};

const openSidebar = () => {
  sidebarOverlay.classList.remove("u-hidden");
  sidebar.classList.remove("-translate-x-full");
  document.body.classList.add("overflow-hidden");
};

export const closeSidebar = () => {
  sidebarOverlay.classList.add("u-hidden");
  sidebar.classList.add("-translate-x-full");
  document.body.classList.remove("overflow-hidden");
};

/* =========================================================
   LIVE CLOCK
========================================================= */

export const initClock = () => {
  if (!clock) return;

  updateTime();

  setInterval(updateTime, 1000);
};

const updateTime = () => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  clock.textContent = `${hours}:${minutes}`;
  clock.setAttribute("datetime", now.toISOString());
};

/* =========================================================
   TOAST
========================================================= */

export const showToast = (message, type) => {
  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");
  toast.classList.add(type);

  clearTimeout(toast.timer);

  toast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3800);
};
