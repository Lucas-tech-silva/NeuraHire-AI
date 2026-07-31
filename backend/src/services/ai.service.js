import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
import { buildPrompt } from "../utils/promptBuilder.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateAIResponse(toolId, userInput, aiSettings) {
  if (!userInput || !userInput.trim()) {
    return JSON.stringify({
      summary: "Entrada vazia",
      strengths: "Preencha os campos corretamente",
      weaknesses: "Nenhum dado fornecido",
      gaps: "Adicione mais contexto",
    });
  }

  const finalPrompt = `
  Responda OBRIGATORIAMENTE seguindo exatamente esta estrutura JSON:

    {
      "resposta": "Sua resposta textual completa aqui"
    }

    A chave "resposta" deve sempre ser uma string.
    Nunca transforme "resposta" em objeto, array ou outro formato.

    ${buildPrompt(toolId, userInput, aiSettings)} 
  `;

  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`Tentativa ${attempt}`);
    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: finalPrompt }],
        response_format: { type: "json_object" },
      });

      const text = response.choices[0].message.content;
      return text;
    } catch (error) {
      if (error.status === 503 && attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        throw error;
      }
    }
  }
}
