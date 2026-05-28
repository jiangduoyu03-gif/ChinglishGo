import { GoogleGenAI } from "@google/genai";
async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response: any = await ai.models.list();
  
  if (response.pageInternal) {
      for (const model of response.pageInternal) {
           console.log(model?.name);
      }
  } else {
     console.log(Object.keys(response));
  }
}
main().catch(console.error);
