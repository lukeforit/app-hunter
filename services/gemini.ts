
import { GoogleGenAI, Type } from "@google/genai";
import { AIJobExtraction, WorkMode } from "../types";

export const parseJobDescription = async (text: string): Promise<AIJobExtraction> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Parse the following job posting or text and extract the company name, role, location, and work mode. If you can find a URL in the text, extract it as the link.
    
    Job Text:
    ${text}`,
    config: {
      systemInstruction: "You are a professional recruiting assistant. Extract structured data from messy job posting text. If values are missing, provide best guesses or leave as empty strings. For workMode, choose only from: 'On-site', 'Remote', or 'Hybrid'.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING, description: "Name of the company hiring" },
          role: { type: Type.STRING, description: "The job title or role name" },
          location: { type: Type.STRING, description: "Physical location (City, State, or Country)" },
          workMode: { 
            type: Type.STRING, 
            description: "On-site, Remote, or Hybrid",
            enum: ['On-site', 'Remote', 'Hybrid']
          },
          link: { type: Type.STRING, description: "URL to the job posting" }
        },
        required: ["companyName", "role", "location", "workMode"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data as AIJobExtraction;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Failed to extract job data automatically.");
  }
};
