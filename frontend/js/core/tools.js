import { generateAIResponse } from "../api/api.js";
import { showToast } from "../ui/ui.js";
import { getAISettings } from "../settings/settings.js";

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

let selectedToolId;

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

  const toolId = card.dataset.toolId;

  return { title, description, toolId };
};

const resetToolInputs = () => {
  const titleInput = document.querySelector("#title");
  const descriptionInput = document.querySelector("#description");

  if (!titleInput || !descriptionInput) return;

  titleInput.value = "";
  descriptionInput.value = "";
};

/* =========================================================
   INPUT VALIDATION
========================================================= */

const validateToolInput = (title, desc) => {
  const cleanTitle = title.trim();
  const cleanDesc = desc.trim();

  if (!cleanTitle || !cleanDesc) {
    return "Preencha todas as informações antes de continuar.";
  }

  if (cleanTitle.length < 5) {
    return "Título muito curto (mínimo 5 caracteres).";
  }

  if (cleanDesc.length < 100) {
    return "Descrição muito curta (mínimo 100 caracteres).";
  }

  const repeatedChars = /(.)\1{9,}/;

  if (repeatedChars.test(cleanTitle)) {
    return "O título parece conter caracteres repetidos.";
  }

  if (repeatedChars.test(cleanDesc)) {
    return "A descrição parece conter caracteres repetidos.";
  }

  return null;
};

/* =========================================================
   FILTER AND SEARCH
========================================================= */

export const initFilterTools = () => {
  if (!searchInput || !toolCards.length || !filterButtons.length) return;

  filterBySearch();
  filterByCategory();
  filterCards();
};

const filterCards = () => {
  const query = searchInput.value.toLowerCase();
  const activeBtn = document.querySelector(".tools-btn.active");
  const activeCategory = activeBtn.textContent.toLowerCase();
  const toolsFoundCount = document.querySelector(".tools-found-count");
  const toolsTotalCount = document.querySelector(".tools-total-count");

  if (!activeBtn || !toolsFoundCount || !toolsTotalCount) return;

  toolCards.forEach((card) => {
    const { title, description } = getCardInfo(card);

    const cardRole = card
      .querySelector(".tools-grid__role")
      .textContent.toLowerCase();

    const matchesSearch =
      title.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query);
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

  toolsFoundCount.textContent = `${count} ferramentas encontradas`;

  toolsTotalCount.textContent = `${toolCards.length}`;
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

export const applyToolFilter = (filter) => {
  const buttons = [...filterButtons];

  const targetButton = buttons.find(
    (btn) => btn.textContent.trim().toLowerCase() === filter,
  );

  if (targetButton) {
    targetButton.click();
  }
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
      resetToolInputs();

      const { title, description, toolId } = getCardInfo(card);

      selectedToolId = toolId;

      document.querySelector("#toolTitle").textContent = title;
      document.querySelector("#toolDescription").textContent = description;

      showView("input");
    });
  });
};

const handleRunTool = () => {
  runToolBtn.addEventListener("click", async () => {
    const title = document.querySelector("#title").value;
    const desc = document.querySelector("#description").value;

    const validationError = validateToolInput(title, desc);

    if (validationError) {
      showToast(validationError, "error");
      showView("input");
      return;
    }

    try {
      showView("loading");

      const currentSettings = getAISettings();

      const data = await generateAIResponse(
        title,
        desc,
        selectedToolId,
        currentSettings,
      );

      const container = document.querySelector("#card-result");
      const format = (value) => {
        if (Array.isArray(value)) return value.join("<br>");
        return String(value).replace(/\n/g, "<br>");
      };

      container.innerHTML = `
    <div class="flex flex-col gap-4">

      <!-- RESUMO -->
      <div class="p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition">
        <div class="flex items-center gap-2 text-zinc-300 font-semibold mb-2">
          <i data-lucide="file-text" class="w-4 h-4 text-zinc-400"></i>
          <span>Resumo</span>
        </div>
        <p class="text-sm text-zinc-300 leading-relaxed">${format(data.summary)}</p>
      </div>

      <!-- PONTOS FORTES -->
      <div class="p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-green-600/40 transition">
        <div class="flex items-center gap-2 text-green-400 font-semibold mb-2">
          <i data-lucide="trending-up" class="w-4 h-4"></i>
          <span>Pontos Fortes</span>
        </div>
        <p class="text-sm text-zinc-300 leading-relaxed">${format(data.strengths)}</p>
      </div>

      <!-- PONTOS DE ATENÇÃO -->
      <div class="p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-600/40 transition">
        <div class="flex items-center gap-2 text-red-400 font-semibold mb-2">
          <i data-lucide="alert-triangle" class="w-4 h-4"></i>
          <span>Pontos de Atenção</span>
        </div>
        <p class="text-sm text-zinc-300 leading-relaxed">${format(data.attention_points)}</p>
      </div>

      <!-- OPORTUNIDADES -->
      <div class="p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-yellow-600/40 transition">
        <div class="flex items-center gap-2 text-yellow-400 font-semibold mb-2">
          <i data-lucide="lightbulb" class="w-4 h-4"></i>
          <span>Oportunidades</span>
        </div>
        <p class="text-sm text-zinc-300 leading-relaxed">${format(data.opportunities)}</p>
      </div>

    </div>
  `;

      lucide.createIcons();

      showView("result");
    } catch (error) {
      console.error(error);
      showToast("Não foi possível processar sua solicitação.", "error");
      setTimeout(() => {
        showView("input");
      }, 5000);
    }
  });
};

const handleBackButtons = () => {
  backToCards.addEventListener("click", () => {
    showView("cards");
  });

  backToInput.addEventListener("click", () => {
    showView("input");
  });
};
