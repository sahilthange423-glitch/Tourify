import { GoogleGenAI } from "@google/genai";

// Safe access to environment variable for browser environments (Netlify)
const getApiKey = (): string | undefined => {
  try {
    // Check if process is defined (Node.js or polyfilled by bundler)
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore reference errors if process is not defined
  }
  return undefined;
};

const apiKey = getApiKey();
// Initialize client only if key is available to prevent immediate crashes
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateItinerary = async (destinationName: string, days: number): Promise<string> => {
  if (!ai) return "AI features are unavailable. Please check your API_KEY configuration.";
  
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
  if (!ai) return "AI features are unavailable. Please check your API_KEY configuration.";

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