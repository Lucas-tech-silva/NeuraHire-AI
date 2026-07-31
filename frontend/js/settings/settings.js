/* =========================================================
   DOM ELEMENTS
========================================================= */

const detailSelect = document.querySelector("#detailLevel");
const toneSelect = document.querySelector("#tone");

/* =========================================================
   AI SETTINGS
========================================================= */

let aiSettings = {
  detailLevel: "Detalhado",
  tone: "Construtivo e Encorajador",
};

export const getAISettings = () => {
  return aiSettings;
};

export const initSettings = () => {
  if (!detailSelect || !toneSelect) return;

  loadSettings();

  handleDetailLevel();
  handleTone();
};

const loadSettings = () => {
  const dados = localStorage.getItem("aiSettings");

  if (!dados) return;

  const savedSettings = JSON.parse(dados);

  aiSettings.detailLevel = savedSettings.detailLevel;
  aiSettings.tone = savedSettings.tone;

  detailSelect.value = aiSettings.detailLevel;
  toneSelect.value = aiSettings.tone;
};

const saveSettings = () => {
  localStorage.setItem("aiSettings", JSON.stringify(aiSettings));
};

const handleDetailLevel = () => {
  detailSelect.addEventListener("change", () => {
    aiSettings.detailLevel = detailSelect.value;

    saveSettings();
  });
};

const handleTone = () => {
  toneSelect.addEventListener("change", () => {
    aiSettings.tone = toneSelect.value;

    saveSettings();
  });
};
