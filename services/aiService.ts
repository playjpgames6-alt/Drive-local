import { GoogleGenAI, Type } from "@google/genai";

// Ensure the API_KEY is available in the environment.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

interface StudyResource {
  title: string;
  url: string;
  type: 'ARTICLE' | 'TUTORIAL' | 'VIDEO';
}

const generateStudyContent = async (topic: string): Promise<StudyResource[]> => {
  const model = 'gemini-2.5-flash';
  
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'A concise, descriptive title for the resource.',
        },
        url: {
          type: Type.STRING,
          description: 'The full URL of the resource. Must be a valid URL.',
        },
        type: {
          type: Type.STRING,
          enum: ['ARTICLE', 'TUTORIAL', 'VIDEO'],
          description: 'The type of the resource.',
        },
      },
      required: ['title', 'url', 'type'],
    },
  };

  const prompt = `You are an expert curator of educational content. For the topic "${topic}", please generate a list of 7 diverse and high-quality study resources. Include a mix of articles, tutorials, and YouTube videos. For each resource, provide a concise title, the full URL, and its type.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    // Basic validation
    if (!Array.isArray(result)) {
      throw new Error("AI response is not in the expected array format.");
    }

    return result as StudyResource[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch study materials from the AI.");
  }
};

export const aiService = {
  generateStudyContent,
};