import { getAISettings } from "../settings/settings.js";
import { generateAIResponse } from "../api/api.js";

/* =========================================================
   DOM ELEMENTS
========================================================= */

const chatMessages = document.querySelector("#chatMessages");
const aiLoading = document.querySelector("#aiLoading");

const chatInput = document.querySelector("#chatInput");
const sendBtn = document.querySelector("#sendBtn");
const quickActions = document.querySelectorAll(".quick-action");

/* =========================================================
   CHAT - NeuraHire AI 
========================================================= */

export const initChat = () => {
  if (!chatInput || !sendBtn || !chatMessages || !aiLoading) return;

  handleKeyboard();
  handleSendMessage();
  handleQuickActions();
  handleInputChange();
};

const clearAndFocusInput = () => {
  chatInput.value = "";

  chatInput.focus();
};

const processAIResponse = (data) => {
  const rawResponse =
    data.resposta || "Não foi possível processar a resposta da IA.";

  return rawResponse.replaceAll("**", "").replaceAll("\n", "<br>");
};

const sendMessage = async () => {
  try {
    const chatValue = chatInput.value.trim();

    if (!chatValue) return;

    sendBtn.disabled = true;
    chatInput.disabled = true;

    clearAndFocusInput();

    renderMessage(chatValue, "usuario");

    aiLoading.classList.remove("hidden");
    aiLoading.classList.add("flex");

    chatMessages.scrollTop = chatMessages.scrollHeight;

    const configAI = getAISettings();

    const data = await generateAIResponse(chatValue, "", null, configAI);

    const formattedMessage = processAIResponse(data);

    aiLoading.classList.add("hidden");
    aiLoading.classList.remove("flex");

    renderMessage(formattedMessage, "ia");
  } catch (error) {
    console.error("Erro capturado no fluxo do chat:", error);

    aiLoading.classList.remove("flex");
    aiLoading.classList.add("hidden");
    renderMessage(
      "⚠️ Desculpe, ocorreu um erro ao processar no servidor. Tente novamente em instantes.",
      "ia",
    );
  } finally {
    sendBtn.disabled = false;
    chatInput.disabled = false;

    chatInput.focus();
  }
};

const renderMessage = (text, sender) => {
  const alignment = sender === "usuario" ? "justify-end" : "justify-start";

  const bubbleStyle =
    sender === "usuario"
      ? "rounded-tr-md border border-(--border-cta) bg-(--bg-primary)"
      : "rounded-tl-md border border-(--border-soft) bg-(--bg-card)";

  const textColor =
    sender === "usuario" ? "text-(--text-primary)" : "text-(--text-secondary)";

  const isLongText = sender === "usuario" && text.length > 250;

  const shortText = isLongText ? text.slice(0, 250) + "..." : text;
  const longText = text;

  const templateHTML = `
      <div class="flex gap-4 ${alignment} w-full">
        <div class="max-w-[85%] sm:max-w-[70%] rounded-3xl ${bubbleStyle} px-4 sm:px-5 py-3 relative">

          <div class="message-content transition-all duration-300">
            <p class="message-text text-xs sm:text-sm leading-relaxed ${textColor}">
              ${shortText}
            </p>
          </div>

          ${
            isLongText
              ? `
              <button class="message-toggle mt-2 inline-flex items-center gap-1.5 rounded-full border border-(--border-default) bg-(--bg-secondary) px-3 py-1.5 text-xs font-medium text-(--text-secondary) transition-all duration-200 hover:border-(--border-hover-strong) hover:bg-(--bg-primary) hover:text-(--text-primary) cursor-pointer">
                <span class="message-toggle-text">Ver mais</span>
                <i data-lucide="chevron-down" class="message-chevron h-3.5 w-3.5 transition-transform duration-300"></i>
              </button>
              `
              : ""
          }

        </div>
      </div>
    `;

  aiLoading.insertAdjacentHTML("beforebegin", templateHTML);
  const currentMessage = aiLoading.previousElementSibling;

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (isLongText) {
    const textParagraph = currentMessage.querySelector(".message-text");
    const toggleBtn = currentMessage.querySelector(".message-toggle");
    const btnText = currentMessage.querySelector(".message-toggle-text");

    if (toggleBtn && textParagraph) {
      toggleBtn.addEventListener("click", () => {
        const isCollapsed = btnText.textContent === "Ver mais";

        const liveIcon = toggleBtn.querySelector("svg");

        if (isCollapsed) {
          textParagraph.innerHTML = longText;
          btnText.textContent = "Ver menos";
          if (liveIcon) liveIcon.style.transform = "rotate(180deg)";
        } else {
          textParagraph.innerHTML = shortText;
          btnText.textContent = "Ver mais";
          if (liveIcon) liveIcon.style.transform = "rotate(0deg)";
        }
      });
    }
  }
};

const handleKeyboard = () => {
  chatInput.addEventListener("keydown", (event) => {
    const eventSend = event.key === "Enter";

    if (eventSend && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }

    if (eventSend && event.shiftKey) {
      return;
    }
  });
};

const handleSendMessage = () => {
  sendBtn.addEventListener("click", () => {
    sendMessage();
  });
};

const updateQuickActionsState = () => {
  const hasText = chatInput.value.trim().length > 0;

  quickActions.forEach((quickAction) => {
    quickAction.classList.toggle("cursor-not-allowed", hasText);
    quickAction.classList.toggle("cursor-pointer", !hasText);
    quickAction.classList.toggle("opacity-50", hasText);
    quickAction.classList.toggle("pointer-events-none", hasText);
  });
};

const handleInputChange = () => {
  chatInput.addEventListener("input", () => {
    updateQuickActionsState();
  });
};

const handleQuickActions = () => {
  if (!quickActions.length) return;

  quickActions.forEach((quickAction) => {
    quickAction.addEventListener("click", () => {
      if (chatInput.value.trim()) {
        return;
      }

      chatInput.value = quickAction.dataset.message;

      updateQuickActionsState();

      chatInput.focus();
    });
  });
};
