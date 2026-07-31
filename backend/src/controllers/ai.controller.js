import { generateAIResponse } from "../services/ai.service.js";

export const handleGenerateText = async (req, res) => {
  const { prompt, toolId, aiSettings } = req.body;

  try {
    const result = await generateAIResponse(toolId, prompt, aiSettings);

    const start = result.indexOf("{");
    const end = result.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("Resposta inválida da IA");
    const parsed = JSON.parse(result.slice(start, end + 1));

    res.json(parsed);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Ops! Algo deu errado ao processar sua solicitação. Tente novamente em instantes.",
    });
  }
};
