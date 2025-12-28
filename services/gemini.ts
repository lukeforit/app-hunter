
import { GoogleGenAI, Type } from "@google/genai";
import { AIJobExtraction } from "../types";

export async function extractJobFromText(text: string): Promise<AIJobExtraction> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract job details from this text or URL. Return JSON.
    
    Source Content:
    ${text}`,
    config: {
      systemInstruction: `You are a high-precision recruitment data extractor. 
      Analyze the input and map it to: companyName, role, location, workMode (On-site, Remote, Hybrid), and link. 
      Defaults: workMode = 'On-site'.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          role: { type: Type.STRING },
          location: { type: Type.STRING },
          workMode: { 
            type: Type.STRING, 
            enum: ['On-site', 'Remote', 'Hybrid']
          },
          link: { type: Type.STRING }
        },
        required: ["companyName", "role", "location", "workMode"]
      }
    }
  });

  return JSON.parse(response.text) as AIJobExtraction;
}
