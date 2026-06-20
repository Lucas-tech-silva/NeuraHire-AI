/* =========================================================
   DOM ELEMENTS
========================================================= */

const searchInput = document.querySelector(".tools-search__input");
const toolCards = document.querySelectorAll(".tools-grid__card");
const filterButtons = document.querySelectorAll(".tools-btn");
const toolViews = document.querySelectorAll(".tools-view");

const runToolBtn = document.querySelector("#runTool");

const backToCards = document.querySelector("#backToCards");
const backToInput = document.querySelector("#backToInput");

//  MODULE STATE

let toolTimeout;

/* =========================================================
   HELPERS
========================================================= */

const getCardInfo = (card) => {
  const title = card
    .querySelector(".tools-grid__title")
    .textContent.replace(/\s+/g, " ")
    .trim();
  const description = card
    .querySelector(".tools-grid__description")
    .textContent.replace(/\s+/g, " ")
    .trim();

  return { title, description };
};

/* =========================================================
FILTER AND SEARCH
========================================================= */

export const initFilterTools = () => {
  if (!searchInput || !toolCards || !filterButtons) return;

  filterBySearch();
  filterByCategory();
  filterCards();
};

const filterCards = () => {
  const query = searchInput.value.toLowerCase();
  const activeBtn = document.querySelector(".tools-btn.active");
  const activeCategory = activeBtn.textContent.toLowerCase();
  const toolsCount = document.querySelector("#tools-count");

  toolCards.forEach((card) => {
    const { title, description } = getCardInfo(card);

    const cardRole = card
      .querySelector(".tools-grid__role")
      .textContent.toLowerCase();

    const matchesSearch = title.toLowerCase().includes(query) || description.toLowerCase().includes(query);
    const matchesCategory =
      activeCategory === "todas" || cardRole === activeCategory;

    matchesSearch && matchesCategory 
      ? card.classList.remove("u-hidden")
      : card.classList.add("u-hidden");
  });

  const visibleCards = document.querySelectorAll(
    ".tools-grid__card:not(.u-hidden)",
  );

  let count = visibleCards.length;

  toolsCount.textContent = `${count} ferramentas encontradas`;
};

const filterBySearch = () => {
  searchInput.addEventListener("input", () => {
    filterCards();
  });
};

const filterByCategory = () => {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");

      filterCards();
    });
  });
};

/* =========================================================
   TOOL FLOW (STATE MACHINE)
========================================================= */

export const initToolFlow = () => {
  if (!toolViews.length || !runToolBtn || !backToCards || !backToInput) return;

  showView("cards");
  handleCardClick();
  handleRunTool();
  handleBackButtons();
};

export const showView = (targetView) => {
  toolViews.forEach((view) => {
    view.classList.remove("active");
  });

  const viewElement = document.querySelector(`.tools-view--${targetView}`);

  if (!viewElement) return;

  viewElement.classList.add("active");
};

const handleCardClick = () => {
  toolCards.forEach((card) => {
    card.addEventListener("click", () => {
      const { title, description } = getCardInfo(card);

      document.querySelector("#toolTitle").textContent = title;
      document.querySelector("#toolDescription").textContent = description;

      showView("input");
    });
  });
};

const handleRunTool = () => {
  runToolBtn.addEventListener("click", () => {
    showView("loading");

    toolTimeout = setTimeout(() => {
      showView("result");
    }, 2000);
  });
};

export const cancelToolTimeout = () => {
  clearTimeout(toolTimeout);
  toolTimeout = null;
};

const handleBackButtons = () => {
  backToCards.addEventListener("click", () => {
    showView("cards");
  });

  backToInput.addEventListener("click", () => {
    showView("input");
  });
};
