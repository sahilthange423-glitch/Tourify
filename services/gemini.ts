import { GoogleGenAI } from "@google/genai";

// Initialize AI client using process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateItinerary = async (destinationName: string, days: number): Promise<string> => {
  if (!process.env.API_KEY) return "AI features are unavailable (Missing API Key).";
  
  try {
    const prompt = `Create a detailed day-by-day travel itinerary for a ${days}-day trip to ${destinationName}. 
    Focus on popular attractions, hidden gems, and local food experiences. 
    Format the response with clear headings for 'Day 1', 'Day 2', etc. Use Markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "No itinerary could be generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't generate an itinerary at this moment. Please try again later.";
  }
};

export const askTravelAssistant = async (query: string, context?: string): Promise<string> => {
  if (!process.env.API_KEY) return "AI features are unavailable (Missing API Key).";

  try {
    const prompt = `You are an expert travel guide. 
    Context: ${context || 'General travel advice'}.
    User Question: ${query}.
    Provide a helpful, concise, and inspiring answer.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The travel assistant is temporarily offline.";
  }
};