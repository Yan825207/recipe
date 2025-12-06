import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Recipe } from "../types";

// Helper to get the API key dynamically
// Priority: LocalStorage (User entered) -> Environment Variable (Build time)
const getApiKey = (): string => {
  const localKey = localStorage.getItem('gemini_api_key');
  if (localKey) return localKey;
  
  // Safe access to process.env for Vite replacement
  try {
    return process.env.API_KEY || '';
  } catch {
    return '';
  }
};

// Helper to clean JSON string (remove Markdown code blocks if present)
const cleanJsonString = (str: string): string => {
  if (!str) return '{}';
  let cleaned = str.trim();
  // Remove markdown code blocks ```json ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/, '').replace(/```$/, '');
  }
  return cleaned.trim();
};

// Schema for Recipe structure
const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "菜品名称" },
          description: { type: Type.STRING, description: "简短的菜品介绍，包含口味特点" },
          cookingTime: { type: Type.STRING, description: "烹饪时间，例如'20分钟'" },
          difficulty: { type: Type.STRING, enum: ['简单', '中等', '困难'] },
          calories: { type: Type.NUMBER, description: "卡路里数值" },
          ingredients: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "所需食材列表"
          },
          steps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "详细的烹饪步骤"
          },
          city: { type: Type.STRING, description: "关联的城市或地区" }
        },
        required: ['name', 'description', 'cookingTime', 'difficulty', 'ingredients', 'steps']
      }
    }
  }
};

const generateImageUrl = (recipeName: string) => {
  const prompt = `professional food photography of ${encodeURIComponent(recipeName)}, delicious chinese dish, 8k resolution, cinematic lighting, appetizing, closeup, restaurant quality`;
  return `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
};

export const generateRecipesFromIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("No API Key provided");
    throw new Error("请先设置 API Key");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `我有这些食材: ${ingredients.join(', ')}。
  请推荐3道我可以做的家常菜。请发挥创意，但也保持实用性。请用中文回答。`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        systemInstruction: "你是一位精通中华料理和世界美食的专业大厨。请根据用户提供的食材生成详细的中文菜谱。步骤要清晰，用量要准确。"
      }
    });

    const cleanJson = cleanJsonString(response.text || '{}');
    const data = JSON.parse(cleanJson);
    
    return data.recipes.map((r: any, index: number) => ({
      ...r,
      id: `gen-${Date.now()}-${index}`,
      imageUrl: generateImageUrl(r.name)
    }));
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("生成菜谱失败，请检查网络或 API Key。");
  }
};

export const getCitySpecialties = async (city: string): Promise<Recipe[]> => {
  const apiKey = getApiKey();
  if (!apiKey) {
      throw new Error("请先设置 API Key");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `请列出 4 道来自 ${city} 的著名地道特色菜。并附上详细的制作教程。请用中文回答。`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        systemInstruction: "你是一位专注于地方特色美食的美食家。请推荐最地道、最具代表性的城市美食。"
      }
    });

    const cleanJson = cleanJsonString(response.text || '{}');
    const data = JSON.parse(cleanJson);
    
    return data.recipes.map((r: any, index: number) => ({
      ...r,
      id: `city-${city}-${index}`,
      city: city,
      imageUrl: generateImageUrl(r.name)
    }));
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("获取地方美食失败。");
  }
};