/* =========================================================
   API AI 
========================================================= */

export const generateAIResponse = async (
  title,
  desc,
  selectedToolId,
  aiSettings,
) => {
  const response = await fetch("http://127.0.0.1:4000/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: `${title} ${desc}`,
      toolId: selectedToolId,
      aiSettings,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao processar a solicitação");
  }

  const data = await response.json();

  return data;
};

/* =========================================================
   FORM SUBMIT
========================================================= */

export const sendContactForm = async (formData) => {
  const response = await fetch(
    "https://formsubmit.co/lucassilva1710@yahoo.com",
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    },
  );

  return response;
};
