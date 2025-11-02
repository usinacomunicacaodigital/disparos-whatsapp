import { GoogleGenAI, Type } from "@google/genai";
import { SmartReplyResponse, CampaignGenerationResponse } from "../types";

// Safe initialization of the Gemini AI client
let ai: GoogleGenAI | null = null;
let initError: string | null = null;

try {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
  }
  ai = new GoogleGenAI({ apiKey });
} catch (e: any) {
  initError = e.message || "An unknown error occurred during AI service initialization.";
  console.error("Failed to initialize GoogleGenAI:", initError);
}


/**
 * Generates a message suggestion based on a user prompt.
 * @param prompt The user's instruction for the message content.
 * @returns A string containing the generated message.
 */
export const generateMessage = async (prompt: string): Promise<string> => {
  if (initError || !ai) {
    console.error("Gemini service not initialized.", initError);
    throw new Error(`AI service is not available: ${initError}`);
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere uma mensagem curta e amigável para enviar no WhatsApp com base na seguinte instrução, sem nenhuma formatação especial (como markdown) ou introduções. Apenas o texto da mensagem. Instrução: "${prompt}"`,
      config: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 150,
      }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate message from AI.");
  }
};


/**
 * Generates smart reply suggestions based on the last message from a contact.
 * @param lastMessage The text of the contact's last message.
 * @returns A promise that resolves to an object with an array of suggestions.
 */
export const generateSmartReplies = async (lastMessage: string): Promise<SmartReplyResponse> => {
  if (initError || !ai) {
    console.error("Gemini service not initialized.", initError);
    throw new Error(`AI service is not available: ${initError}`);
  }

  const prompt = `Baseado na seguinte mensagem recebida de um cliente no WhatsApp, gere 3 respostas curtas, úteis e concisas (máximo 4 palavras por resposta). A mensagem do cliente é: "${lastMessage}"`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.5,
        topP: 0.95,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Lista de 3 sugestões de resposta curta.'
            }
          }
        }
      },
    });

    const jsonText = response.text.trim();
    // Gemini may wrap the JSON in ```json ... ```, so we need to clean it.
    const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
    
    // Fix: Add a try-catch block for JSON parsing to prevent crashes on malformed API responses.
    try {
      const parsed = JSON.parse(cleanJson);
      if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        return { suggestions: parsed.suggestions.slice(0, 3) };
      }
    } catch(parseError) {
      console.error("Failed to parse JSON from Gemini for smart replies:", parseError, "Raw text:", jsonText);
      return { suggestions: [] };
    }

    return { suggestions: [] };
    
  } catch (error) {
    console.error("Error calling Gemini API for smart replies:", error);
    throw new Error("Failed to generate smart replies from AI.");
  }
};

/**
 * Generates message variations for a marketing campaign.
 * @param objective The campaign's goal.
 * @param tone The desired tone of the message.
 * @param isAbTest If true, generates two variations.
 * @returns A promise resolving to an object with an array of message variations.
 */
export const generateCampaignVariations = async (
  objective: string,
  tone: string,
  isAbTest: boolean
): Promise<CampaignGenerationResponse> => {
  if (initError || !ai) {
    console.error("Gemini service not initialized.", initError);
    throw new Error(`AI service is not available: ${initError}`);
  }

  const variationCount = isAbTest ? 2 : 1;

  const prompt = `
    Crie ${variationCount} variações de uma mensagem de WhatsApp para uma campanha de marketing.
    - Objetivo da campanha: "${objective}"
    - Tom da mensagem: ${tone}
    - A mensagem DEVE incluir o placeholder "{{nome}}" para personalização do nome do cliente.
    - Cada variação deve ser curta, direta e eficaz para o WhatsApp.
    - Se estiver criando duas variações (Teste A/B), elas devem ter abordagens diferentes, mas com o mesmo objetivo. Por exemplo, uma pode usar um emoji e ser mais casual, enquanto a outra é mais direta.
    - Não inclua nenhuma introdução ou texto extra, apenas o JSON.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Identificador da variação ('A' ou 'B')" },
                  body: { type: Type.STRING, description: "O texto da mensagem da campanha." }
                },
                required: ["id", "body"]
              }
            }
          }
        }
      },
    });

    const jsonText = response.text.trim();
    const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
    
    // Fix: Add a try-catch block for JSON parsing to prevent crashes on malformed API responses.
    try {
      const parsed = JSON.parse(cleanJson);
      if (parsed.variations && Array.isArray(parsed.variations)) {
        // Ensure IDs are correct if Gemini doesn't provide them
        if (parsed.variations.length > 0 && !parsed.variations[0].id) {
          parsed.variations[0].id = 'A';
        }
        if (parsed.variations.length > 1 && !parsed.variations[1].id) {
          parsed.variations[1].id = 'B';
        }
        return { variations: parsed.variations.slice(0, variationCount) };
      }
    } catch(parseError) {
      console.error("Failed to parse JSON from Gemini for campaign variations:", parseError, "Raw text:", jsonText);
      return { variations: [] };
    }
    return { variations: [] };
    
  } catch (error) {
    console.error("Error calling Gemini API for campaign variations:", error);
    throw new Error("Failed to generate campaign variations from AI.");
  }
};