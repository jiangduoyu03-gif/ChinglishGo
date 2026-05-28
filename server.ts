import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from "openai";

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    aiClient = new GoogleGenAI({ 
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
  }
  return aiClient;
}

let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!openaiClient) {
    const key = process.env.OPENROUTER_API_KEY;
    openaiClient = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: key || "missing_key", // Prevent OpenRouter SDK from crashing if key is missing during init
      defaultHeaders: {
        "HTTP-Referer": "https://ai.studio/build",
        "X-Title": "Pattern Drill App",
      }
    });
  }
  return openaiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  app.post("/api/polish", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const response = await getOpenAI().chat.completions.create({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: "You are an expert bilingual English coach specializing in Corporate (Work) and Colloquial (Casual) American English. Transform the input into two highly natural, idiomatic oral expressions." },
          { role: "user", content: `Analyze the following user input: "${text}". Transform it into two highly natural, idiomatic oral expressions: one for professional/workplace environments, and one for casual/chitchat environments.\n\nPlease strictly return a JSON object with this shape:\n{ "original_input": "...", "work": { "sentence": "...", "key_pattern": "...", "explanation": "..." }, "casual": { "sentence": "...", "key_pattern": "...", "explanation": "..." } }` }
        ],
        response_format: { type: "json_object" }
      });

      const data = JSON.parse(response.choices[0].message.content || '{}');
      res.json(data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/feedback", async (req, res) => {
    try {
      const { spokenText, targetSentence, targetPattern } = req.body;
      
      const response = await getOpenAI().chat.completions.create({
        model: "google/gemini-2.5-pro",
        messages: [{
           role: "user", content: `Evaluate the user's spoken sentence against the target sentence and pattern.
        User spoken: "${spokenText}"
        Target sentence: "${targetSentence}"
        Target pattern: "${targetPattern}"
        Provide a very short, encouraging 1-sentence feedback in Chinese. If it's perfect or close, say "语义完美契合！" or similar. If it misses the target pattern, suggest using it. Max 20 words.
        
        Return JSON format ONLY: { "feedback": "Your feedback" }`
        }],
        response_format: { type: "json_object" }
      });

      const data = JSON.parse(response.choices[0].message.content || '{}');
      res.json(data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/drill-chat", async (req, res) => {
    try {
      const { history, targetPattern, chinglish, targetSentence } = req.body;
      
      const systemInstruction = `
# Role
你是一位极为亲切、像朋友一样的英语外教。我们将进行一次文字打字聊天的练习。你的目标是教我使用一个新的地道英语句式。

# Absolute Rules (State Tracking & Progression)
- **Persistent State**: 你的内核需要时刻记录用户的掌握度（Mastery state，不用显示出来，只在你的逻辑中）。
- **Barrier to Entry**: **绝对不允许**轻易进入下一个情景练习，**除非**用户在回答中正确且自然地使用了"目标句型: ${targetPattern}"。
- 如果用户没有使用目标句型，哪怕句意对了，你也要像朋友一样温和地提醒他们："That makes sense, but try using our new pattern!" 或者 "Good, but how do we say it with the pattern we just learned?" 并让他们重新回答相同的情景。
- 只有成功运用了目标句型，你才能说："Perfect! You nailed it." 然后再推进到下一个新的小情景。

# Execution Constraints
- 这是文字聊天，你的回复必须极度简短、自然、口语化。**绝对不要**出现复杂的格式、长篇大论、列表清单（bullet points）。
- 每次只说1-3句简短的话。
- 每次发言的最后通常抛出一个短问题来引导用户。

# Execution Process
1. 一开始，像好久不见的朋友一样打招呼，然后用一句话点出之前的 Chinglish 并介绍我们要练的新句型。
2. 抛出一个极其简单的日常小情境，问用户遇到这种情况怎么用新句型回答。
3. 接下来的对话完全根据用户的回应进行。记住，**必须卡住**进度，直到用户真的说出包含新句型的话，才能给通过并换下一个情境。

当前学习目标：
Chinglish: "${chinglish}"
地道表达: "${targetSentence}"
目标句型: "${targetPattern}"
`;

      const formattedHistory: any[] = req.body.history.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.text
      }));
      
      const newMsg = req.body.message || "开始吧";

      const messages = [
        { role: "system", content: systemInstruction },
        ...formattedHistory,
        { role: "user", content: newMsg }
      ];

      const response = await getOpenAI().chat.completions.create({
         model: "google/gemini-2.5-pro",
         messages: messages
      });

      res.json({ text: response.choices[0].message.content });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/drill-generate", async (req, res) => {
    try {
      const { pattern, sentence, level } = req.body;
      
      let promptConfig = "";
      if (level === 1) {
         promptConfig = `Level 1: Substitution Drill. Generate a short English scenario where the user needs to substitute a phrase with the pattern "${pattern}". Return ONLY the English prompt. Example: "Express that you can't understand the new policy using '${pattern}'."`;
      } else if (level === 2) {
         promptConfig = `Level 2: Reverse Translation Drill. Generate a short Chinese sentence that naturally translates to using the pattern "${pattern}". Return ONLY the Chinese sentence.`;
      } else if (level === 3) {
         promptConfig = `Level 3: Free Response Drill. Ask an engaging open-ended question in English that forces the user to answer using the pattern "${pattern}". Return ONLY the English question.`;
      }

      const response = await getOpenAI().chat.completions.create({
        model: "google/gemini-2.5-pro",
        messages: [{ role: "user", content: promptConfig }],
        temperature: 0.7
      });
      res.json({ prompt: response.choices[0].message.content });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/drill-evaluate", async (req, res) => {
    try {
      const { userResponse, pattern, level, prompt } = req.body;

      const response = await getOpenAI().chat.completions.create({
        model: "google/gemini-2.5-pro",
        messages: [{
             role: "user", content: `Evaluate this user's response to the drill.
        Pattern to use: "${pattern}"
        Drill Prompt: "${prompt}"
        User Response: "${userResponse}"
        Level: ${level}
        
        Guidelines:
        - Is the user's response grammatically correct and natural?
        - Did they successfully use the exact pattern?
        
        Return JSON format ONLY: { "isCorrect": boolean, "feedback": "Short encouraging feedback explaining why it's correct or what went wrong." }`
        }],
        temperature: 0.2,
        response_format: { type: "json_object" }
      });
      const data = JSON.parse(response.choices[0].message.content || '{}');
      res.json(data);
    } catch (e: any) {
       console.error(e);
       res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/transcribe", async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      let effectiveMime = mimeType || "audio/webm";
      // Ensure the mimetype is a valid one that gemini accepts, sometimes it's audio/webm;codecs=opus and we can just pass audio/webm
      if (effectiveMime.includes(";")) {
        effectiveMime = effectiveMime.split(";")[0];
      }

      const response = await getAi().models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: audioBase64,
                  mimeType: effectiveMime,
                },
              },
              { text: "Transcribe the following audio accurately. Just output the English English transcription without any extra formatting or explanation." }
            ],
          },
        ],
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tts", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (process.env.ELEVENLABS_API_KEY) {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.5 }
          })
        });
        if (response.ok) {
           const arrayBuffer = await response.arrayBuffer();
           const buffer = Buffer.from(arrayBuffer);
           res.json({ audio: buffer.toString('base64'), mimeType: 'audio/mpeg' });
           return;
        }
      }

      const response = await getAi().models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
          },
        },
      });

      const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (inlineData?.data) {
        res.json({ audio: inlineData.data, mimeType: inlineData.mimeType });
      } else {
         res.status(500).json({ error: "Failed to generate audio" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
