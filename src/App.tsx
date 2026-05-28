import React, { useState, useEffect, useRef } from "react";
import {
  Briefcase,
  Coffee,
  Save,
  Mic,
  Keyboard,
  Check,
  Loader2,
  ArrowRight,
  BookMarked,
  Languages,
  Trash2,
  Search,
  RotateCcw,
  History,
  Clock,
  Volume2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { PolishResult, SavedExpression } from "./types";
import { AnimatePresence, motion } from "motion/react";

type HistoryItem = {
  id: string;
  result: PolishResult;
  created_at: string;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "polish" | "history" | "saved" | "drill"
  >("polish");

  // To allow History view to load a past item into Polish view
  const [loadedResult, setLoadedResult] = useState<PolishResult | null>(null);

  const loadToPolish = (res: PolishResult) => {
    setLoadedResult(res);
    setActiveTab("polish");
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex justify-center md:items-center py-0 md:py-8 font-sans text-black px-0 md:px-6">
      <div className="w-full md:max-w-[1400px] bg-[#EAE4DD] md:border-[4px] border-black md:shadow-[8px_8px_0px_rgba(0,0,0,1)] md:rounded-[2.5rem] p-0 md:p-6 flex flex-col md:flex-row h-[100dvh] md:h-[90vh] relative overflow-hidden gap-6">
        {/* Navigation Sidebar (Desktop) / Bottom Bar (Mobile) */}
        <div className="order-last md:order-first bg-white border-t-4 md:border-4 border-black md:rounded-[2rem] shadow-[0px_-4px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-row md:flex-col items-center justify-around md:justify-start py-2 md:py-8 z-50 w-full md:w-24 shrink-0 h-[80px] md:h-full gap-4 fixed bottom-0 left-0 md:static px-4 md:px-0">
          <div className="hidden md:flex w-12 h-12 bg-black text-[#FF90E8] rounded-2xl items-center justify-center font-black text-xl mb-4 shadow-[2px_2px_0px_rgba(255,255,255,1)] border-2 border-black rotate-[-6deg] hover:rotate-0 transition-transform">
            CG
          </div>

          <button
            onClick={() => setActiveTab("polish")}
            className={
              "w-14 md:w-14 h-14 md:h-14 flex flex-col items-center justify-center gap-1 transition-all rounded-2xl md:rounded-3xl border-[3px] border-black " +
              (activeTab === "polish"
                ? "bg-[#FFC900] shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1"
                : "bg-transparent border-transparent hover:bg-[#EAE4DD]")
            }
            title="Polish"
          >
            <Languages className="w-6 h-6 stroke-[2.5]" />
            <span className="text-[9px] font-black uppercase tracking-wider block md:hidden">
              Polish
            </span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={
              "w-14 md:w-14 h-14 md:h-14 flex flex-col items-center justify-center gap-1 transition-all rounded-2xl md:rounded-3xl border-[3px] border-black " +
              (activeTab === "history"
                ? "bg-[#FFC900] shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1"
                : "bg-transparent border-transparent hover:bg-[#EAE4DD]")
            }
            title="History"
          >
            <Clock className="w-6 h-6 stroke-[2.5]" />
            <span className="text-[9px] font-black uppercase tracking-wider block md:hidden">
              History
            </span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={
              "w-14 md:w-14 h-14 md:h-14 flex flex-col items-center justify-center gap-1 transition-all rounded-2xl md:rounded-3xl border-[3px] border-black " +
              (activeTab === "saved"
                ? "bg-[#FFC900] shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1"
                : "bg-transparent border-transparent hover:bg-[#EAE4DD]")
            }
            title="Saved"
          >
            <BookMarked className="w-6 h-6 stroke-[2.5]" />
            <span className="text-[9px] font-black uppercase tracking-wider block md:hidden">
              Saved
            </span>
          </button>

          <button
            onClick={() => setActiveTab("drill")}
            className={
              "w-14 md:w-14 h-14 md:h-14 flex flex-col items-center justify-center gap-1 transition-all rounded-2xl md:rounded-3xl border-[3px] border-black " +
              (activeTab === "drill"
                ? "bg-[#FFC900] shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1"
                : "bg-transparent border-transparent hover:bg-[#EAE4DD]")
            }
            title="Drill"
          >
            <Mic className="w-6 h-6 stroke-[2.5]" />
            <span className="text-[9px] font-black uppercase tracking-wider block md:hidden">
              Drill
            </span>
          </button>
        </div>

        {/* Right / Top Main Column */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-[#F4F4F0] md:bg-transparent pb-[80px] md:pb-0 gap-4">
          <div className="md:hidden px-6 py-4 flex items-center gap-3">
             <div className="w-8 h-8 bg-black text-[#FF90E8] rounded-lg flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_rgba(255,255,255,1)] border-2 border-black rotate-[-3deg]">
               CG
             </div>
             <h1 className="text-xl font-black uppercase tracking-tight text-black">
               ChinglishGo
             </h1>
          </div>

          {/* Desktop Header area */}
          <div className="hidden md:flex items-center justify-between z-10">
            <div className="bg-white px-6 py-3 rounded-[2rem] border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-3 ml-2">
              <span className="text-2xl font-black uppercase tracking-tight text-black leading-none">
                {activeTab === 'polish' && 'Polish Translations'}
                {activeTab === 'history' && 'History Log'}
                {activeTab === 'saved' && 'Saved Collection'}
                {activeTab === 'drill' && 'Pattern Drills'}
              </span>
            </div>
            <div className="bg-[#FF90E8] px-6 py-3 rounded-[2rem] border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-3 mr-2">
              <span className="text-lg font-black tracking-tight text-black flex items-center gap-2">
                🚀 CHINGLISH_GO
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative flex flex-col overflow-hidden bg-white md:bg-transparent md:rounded-none rounded-t-[2rem] border-t-4 md:border-t-0 border-black shadow-[0px_-4px_0px_rgba(0,0,0,1)] md:shadow-none mx-0 md:mx-2 mb-0 md:mb-2">
            <AnimatePresence mode="wait">
              {activeTab === "polish" && (
                <PolishView
                  key="polish"
                  initialResult={loadedResult}
                  onClearInitial={() => setLoadedResult(null)}
                />
              )}
              {activeTab === "history" && (
                <HistoryView key="history" onLoad={loadToPolish} />
              )}
              {activeTab === "saved" && <SavedView key="saved" />}
              {activeTab === "drill" && <DrillView key="drill" />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function pcmBase64ToWavUrl(
  base64Pcm: string,
  sampleRate: number = 24000,
): string {
  const binaryString = window.atob(base64Pcm);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = bytes.length;

  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  const writeString = (v: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      v.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  const wavBytes = new Uint8Array(wavBuffer);
  wavBytes.set(bytes, 44);

  const blob = new Blob([wavBuffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

export const playTTS = async (text: string) => {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const data = await res.json();
      let audioUrl = "";
      if (data.mimeType && data.mimeType.includes("audio/pcm")) {
        // Extract sample rate if available, default to 24000
        const match = data.mimeType.match(/rate=(\d+)/);
        const sampleRate = match ? parseInt(match[1], 10) : 24000;
        audioUrl = pcmBase64ToWavUrl(data.audio, sampleRate);
      } else {
        const mimeType = data.mimeType || "audio/wav";
        audioUrl = `data:${mimeType};base64,${data.audio}`;
      }

      const audio = new Audio(audioUrl);
      await audio.play();
    } else {
      throw new Error("API failed");
    }
  } catch (err) {
    console.error("TTS playback failed, falling back to browser TTS", err);
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  }
};

function PolishView({
  initialResult,
  onClearInitial,
}: {
  initialResult: PolishResult | null;
  onClearInitial: () => void;
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PolishResult | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialResult) {
      setResult(initialResult);
      setInput(initialResult.original_input);
      setSavedIds(new Set()); // Reset saved status when loading from history
      onClearInitial();
    }
  }, [initialResult, onClearInitial]);

  const handlePolish = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setResult(null);
    setSavedIds(new Set()); // Bug 1 fix: Reset saved items when re-polishing
    try {
      const res = await fetch("/api/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);

        // Save to History (Bug 2)
        const historyItem: HistoryItem = {
          id: crypto.randomUUID(),
          result: data,
          created_at: new Date().toISOString(),
        };
        const existingHistory = JSON.parse(
          localStorage.getItem("pattern_drill_history") || "[]",
        );
        localStorage.setItem(
          "pattern_drill_history",
          JSON.stringify([historyItem, ...existingHistory]),
        );
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (
          res.status === 429 ||
          errorData?.error?.includes("429") ||
          errorData?.error?.includes("quota")
        ) {
          alert(
            "You have exceeded your AI model quota. Please wait a minute and try again.",
          );
        } else {
          alert(
            "Failed to polish text: " + (errorData?.error || res.statusText || "Server Error"),
          );
        }
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (type: "work" | "casual", data: PolishResult) => {
    const id = crypto.randomUUID();
    const item = data[type];
    const exp: SavedExpression = {
      id,
      original_text: data.original_input,
      scene_type: type,
      english_sentence: item.sentence,
      key_pattern: item.key_pattern,
      explanation: item.explanation,
      created_at: new Date().toISOString(),
    };

    const existing = JSON.parse(
      localStorage.getItem("pattern_drill_saved") || "[]",
    );
    localStorage.setItem(
      "pattern_drill_saved",
      JSON.stringify([exp, ...existing]),
    );

    setSavedIds((prev) => new Set(prev).add(type));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 overflow-y-auto w-full p-6 space-y-6 relative"
    >
      <div className="bg-white rounded-[2rem] shadow-[4px_4px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden flex flex-col focus-within:-translate-y-1 focus-within:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type Chinese/Chinglish here..."
          className="w-full h-32 md:h-48 p-6 md:p-8 resize-none focus:outline-none text-black font-bold placeholder-gray-500 bg-[#E0F2FE] md:text-xl"
        />
        <div className="bg-white border-t-4 border-black p-4 flex justify-end">
          <button
            onClick={handlePolish}
            disabled={isLoading || !input.trim()}
            className="bg-[#2D80FF] text-white px-8 py-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] text-lg font-black uppercase hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center gap-2 transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Polish text</span>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-start">
          {/* Work Card */}
          <div className="bg-[#3CD070] text-black rounded-[1.5rem] p-6 shadow-[3px_3px_0px_rgba(0,0,0,1)] border-[3px] border-black flex flex-col gap-3 relative group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 font-black uppercase tracking-wider text-xs border-[3px] border-black bg-white px-3 py-1.5 flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-xl">
                <Briefcase className="w-4 h-4 stroke-[2.5]" /> Work
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => playTTS(result.work.sentence)}
                  className="bg-white text-black border-[3px] border-black p-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] transition-all rounded-xl flex-shrink-0"
                >
                  <Volume2 className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => handleSave("work", result)}
                  disabled={savedIds.has("work")}
                  className="bg-white border-[3px] border-black p-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 rounded-xl flex-shrink-0"
                >
                  {savedIds.has("work") ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Save className="w-5 h-5 stroke-[2.5]" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xl md:text-2xl font-black text-black leading-snug">
              {result.work.sentence}
            </p>
            <div className="mt-4 bg-[#EAE4DD] border-[3px] border-black px-4 py-3 flex flex-col items-start gap-1 rounded-xl">
              <span className="font-black uppercase tracking-wider text-[10px] text-gray-600">Pattern</span>
              <span className="font-bold text-sm bg-[#FFC900] px-1 rounded-sm">
                {result.work.key_pattern}
              </span>
            </div>
            <p className="text-black font-medium text-sm mt-1 leading-relaxed">
              {result.work.explanation}
            </p>
          </div>

          {/* Casual Card */}
          <div className="bg-[#FF90E8] text-black rounded-[1.5rem] p-6 shadow-[3px_3px_0px_rgba(0,0,0,1)] border-[3px] border-black flex flex-col gap-3 relative group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 font-black uppercase tracking-wider text-xs border-[3px] border-black bg-white px-3 py-1.5 flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-xl">
                <Coffee className="w-4 h-4 stroke-[2.5]" /> Casual
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => playTTS(result.casual.sentence)}
                  className="bg-white text-black border-[3px] border-black p-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] transition-all rounded-xl flex-shrink-0"
                >
                  <Volume2 className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => handleSave("casual", result)}
                  disabled={savedIds.has("casual")}
                  className="bg-white border-[3px] border-black p-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 rounded-xl flex-shrink-0"
                >
                  {savedIds.has("casual") ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Save className="w-5 h-5 stroke-[2.5]" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xl md:text-2xl font-black text-black leading-snug">
              {result.casual.sentence}
            </p>
            <div className="mt-4 bg-[#EAE4DD] border-[3px] border-black px-4 py-3 flex flex-col items-start gap-1 rounded-xl">
              <span className="font-black uppercase tracking-wider text-[10px] text-gray-600">Pattern</span>
              <span className="font-bold text-sm bg-[#FFC900] px-1 rounded-sm">
                {result.casual.key_pattern}
              </span>
            </div>
            <p className="text-black font-medium text-sm mt-1 leading-relaxed">
              {result.casual.explanation}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

import Markdown from "react-markdown";

type DrillProgress = {
  [patternId: string]: {
    [level: number]: { completed: boolean; attempts: number };
  };
};

function DrillView() {
  const [expressions, setExpressions] = useState<SavedExpression[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);
  const [progress, setProgress] = useState<DrillProgress>({});
  const [prompts, setPrompts] = useState<{ [key: string]: string }>({});

  const [isRecording, setIsRecording] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    text: string;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("pattern_drill_saved") || "[]",
    );
    setExpressions(saved);
    const storedProgress = JSON.parse(
      localStorage.getItem("pattern_drill_progress") || "{}",
    );
    setProgress(storedProgress);
  }, []);

  const current = expressions[currentIndex];

  const updateProgress = (
    patternId: string,
    level: number,
    isCorrect: boolean,
  ) => {
    setProgress((prev) => {
      const currentPatternProgress = prev[patternId] || {};
      const currentLevelProgress = currentPatternProgress[level] || {
        completed: false,
        attempts: 0,
      };

      const newProgress = {
        ...prev,
        [patternId]: {
          ...currentPatternProgress,
          [level]: {
            completed: currentLevelProgress.completed || isCorrect,
            attempts: currentLevelProgress.attempts + 1,
          },
        },
      };

      localStorage.setItem(
        "pattern_drill_progress",
        JSON.stringify(newProgress),
      );
      return newProgress;
    });
  };

  const loadPrompt = async (expr: SavedExpression, level: 1 | 2 | 3) => {
    const promptKey = `${expr.id}-${level}`;
    if (prompts[promptKey]) return;

    setIsGeneratingMessage(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/drill-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pattern: expr.key_pattern,
          sentence: expr.english_sentence,
          level,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPrompts((prev) => ({ ...prev, [promptKey]: data.prompt }));
      } else {
        const errData = await res.json().catch(() => ({}));
        setPrompts((prev) => ({
          ...prev,
          [promptKey]: `Error generating drill scenario: ${errData.error || res.statusText}\nPlease check API keys and try again.`,
        }));
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  useEffect(() => {
    if (current) {
      loadPrompt(current, activeLevel);
      setFeedback(null);
    }
  }, [currentIndex, activeLevel, current]);

  const startRecording = async () => {
    setFeedback(null);
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let options = { mimeType: "audio/webm;codecs=opus" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "audio/mp4" };
      }
      const mediaRecorder = MediaRecorder.isTypeSupported(options.mimeType)
        ? new MediaRecorder(stream, options)
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm;codecs=opus",
        });
        stream.getTracks().forEach((track) => track.stop());

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64data = reader.result?.toString().split(",")[1];
          if (base64data && current) {
            setIsChecking(true);
            try {
              // 1. Transcribe the audio
              const res = await fetch("/api/transcribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  audioBase64: base64data,
                  mimeType: audioBlob.type,
                }),
              });

              if (res.ok) {
                const data = await res.json();
                const text = data.text?.replace(/\n/g, " ").trim();
                const promptText =
                  prompts[`${current.id}-${activeLevel}`] || "";

                if (text) {
                  // 2. Give feedback
                  const feedbackRes = await fetch("/api/drill-evaluate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userResponse: text,
                      prompt: promptText,
                      level: activeLevel,
                      pattern: current.key_pattern,
                    }),
                  });
                  if (feedbackRes.ok) {
                    const fData = await feedbackRes.json();
                    setFeedback({
                      isCorrect: fData.isCorrect,
                      text: `You said: "${text}".\n\n${fData.feedback}`,
                    });
                    updateProgress(current.id, activeLevel, fData.isCorrect);
                  } else {
                    setFeedback({
                      isCorrect: false,
                      text: "Could not evaluate feedback.",
                    });
                  }
                } else {
                  setFeedback({
                    isCorrect: false,
                    text: "Could not transcribe any speech.",
                  });
                }
              } else {
                setFeedback({
                  isCorrect: false,
                  text: "Transcription failed.",
                });
              }
            } catch (err) {
              console.error(err);
              setFeedback({ isCorrect: false, text: "Network error." });
            } finally {
              setIsChecking(false);
            }
          }
        };
      };

      mediaRecorder.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
      setFeedback({
        isCorrect: false,
        text: "Please allow microphone access.",
      });
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.code === "Space" && !e.repeat && !isRecording && current) {
        e.preventDefault();
        startRecording();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.code === "Space" && isRecording) {
        e.preventDefault();
        stopRecording();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isRecording, current, activeLevel]);

  if (expressions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 bg-[#EAE4DD]">
        <div className="w-16 h-16 bg-[#FFC900] border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center rounded-2xl">
          <Save className="w-6 h-6 text-black stroke-[2.5]" />
        </div>
        <div>
          <h3 className="font-bold text-xl uppercase tracking-tight text-black">
            No saved expressions
          </h3>
          <p className="text-black font-medium text-sm mt-1">
            Polish some text and save them to practice here.
          </p>
        </div>
      </div>
    );
  }

  const getProgressState = (exprId: string, level: number) => {
    const p = progress[exprId]?.[level];
    if (!p) return { completed: false, attempts: 0 };
    return p;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex-1 overflow-hidden flex flex-col md:flex-row w-full gap-0 md:gap-6 p-0 md:p-6"
    >
      {/* Sidebar: List of Patterns (Web) */}
      <div className="hidden md:flex flex-col w-1/3 max-w-[320px] min-w-[240px] bg-white border-[3px] border-black rounded-[2rem] shadow-[4px_4px_0px_rgba(0,0,0,1)] shrink-0 overflow-hidden">
        <div className="p-5 border-b-[3px] border-black bg-[#E0F2FE]">
          <h2 className="font-black text-base lg:text-lg uppercase tracking-wider text-black">
            Pattern Drills
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          {expressions.map((exp, idx) => {
            const isActive = idx === currentIndex;
            const p1 = getProgressState(exp.id, 1).completed;
            const p2 = getProgressState(exp.id, 2).completed;
            const p3 = getProgressState(exp.id, 3).completed;
            const totalCompleted = [p1, p2, p3].filter(Boolean).length;

            return (
              <button
                key={exp.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setActiveLevel(1);
                }}
                className={`w-full text-left p-3 border-2 border-black rounded-xl transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] ${isActive ? "bg-[#FF90E8] translate-y-0.5 shadow-[0px_0px_0px_rgba(0,0,0,1)]" : "bg-white hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"}`}
              >
                <div className="font-bold text-black mb-1 truncate">
                  {exp.key_pattern}
                </div>
                <div className="flex gap-1">
                  <div
                    className={`h-1.5 flex-1 rounded-full border border-black ${p1 ? "bg-black" : "bg-[#EAE4DD]"}`}
                  />
                  <div
                    className={`h-1.5 flex-1 rounded-full border border-black ${p2 ? "bg-black" : "bg-[#EAE4DD]"}`}
                  />
                  <div
                    className={`h-1.5 flex-1 rounded-full border border-black ${p3 ? "bg-black" : "bg-[#EAE4DD]"}`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile selector header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b-[3px] border-black bg-white shrink-0">
        <select
          value={currentIndex}
          onChange={(e) => {
            setCurrentIndex(Number(e.target.value));
            setActiveLevel(1);
          }}
          className="bg-[#E0F2FE] border-[3px] border-black rounded-xl px-3 py-2 font-black text-sm max-w-[200px] shadow-[2px_2px_0px_rgba(0,0,0,1)] outline-none uppercase tracking-wider"
        >
          {expressions.map((exp, idx) => (
            <option key={exp.id} value={idx}>
              {exp.key_pattern}
            </option>
          ))}
        </select>
        <div className="text-xs font-black bg-[#FFC900] border-[3px] border-black px-3 py-2 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          {currentIndex + 1} / {expressions.length}
        </div>
      </div>

      {/* Main Drill Area */}
      <div className="flex-1 flex flex-col items-center justify-start w-full h-full overflow-hidden p-4 md:p-0 min-h-0">
        {current && (
          <div className="w-full h-full max-w-none bg-white border-[3px] border-black rounded-[2rem] md:rounded-[2.5rem] shadow-[4px_4px_0px_rgba(0,0,0,1)] p-6 md:p-10 flex flex-col overflow-y-auto">
            <div className="mb-6 md:mb-8 text-center md:text-left flex flex-col items-center md:items-start shrink-0">
              <div className="inline-block bg-[#FFC900] px-4 py-1.5 border-[3px] border-black rounded-lg font-black uppercase text-xs md:text-sm tracking-wider mb-4 w-fit shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                Target Pattern
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-tight w-full break-words">
                {current.key_pattern}
              </h2>
            </div>

            {/* Level Tabs */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8 shrink-0">
              {[1, 2, 3].map((lvl) => {
                const isActive = activeLevel === lvl;
                const progressState = getProgressState(current.id, lvl);
                const isComplete = progressState.completed;

                let label = "Sub";
                if (lvl === 2) label = "Translate";
                if (lvl === 3) label = "Free";

                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      setActiveLevel(lvl as 1 | 2 | 3);
                      setFeedback(null);
                    }}
                    className={`relative px-2 py-4 border-[3px] border-black rounded-xl font-black text-xs md:text-sm transition-all flex flex-col items-center justify-center gap-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] uppercase tracking-wider ${isActive ? "bg-[#3CD070] text-black shadow-[0px_0px_0px_rgba(0,0,0,1)] translate-y-1" : "bg-[#F4F4F0] text-black hover:-translate-y-1 hover:shadow-[5px_5px_0px_rgba(0,0,0,1)]"}`}
                  >
                    <span className="opacity-60 text-[9px] mb-1">Level {lvl}</span>
                    <span className="truncate">{label}</span>
                    {isComplete && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-0.5 border-2 border-black">
                        <Check className="w-2.5 h-2.5 text-black stroke-[4]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Prompt Section */}
            <div className="bg-[#EAE4DD] border-[3px] border-black rounded-[1.5rem] p-6 md:p-8 min-h-[160px] flex flex-col items-center justify-center relative mb-8 shrink-0">
              {isGeneratingMessage ? (
                <div className="flex flex-col items-center gap-3 font-black text-black">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="uppercase tracking-widest text-sm">Generating scenario...</span>
                </div>
              ) : (
                <p className="text-black font-bold text-base md:text-xl text-center leading-relaxed whitespace-pre-wrap">
                  {prompts[`${current.id}-${activeLevel}`]}
                </p>
              )}
            </div>

            {/* Record Button & Feedback */}
            <div className="flex flex-col items-center mt-auto md:mt-0 shrink-0 pb-4">
              {isChecking ? (
                <div className="flex flex-col items-center gap-3 font-black text-black mb-6">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="uppercase tracking-widest text-sm">Evaluating response...</span>
                </div>
              ) : feedback ? (
                <div
                  className={`mb-8 p-5 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] w-full font-bold text-base md:text-lg whitespace-pre-wrap ${feedback.isCorrect ? "bg-[#3CD070]" : "bg-[#FFC900]"}`}
                >
                  <span className="font-black uppercase tracking-wider flex items-center gap-2 mb-2 text-sm border-2 border-black bg-white px-3 py-1 w-fit rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    {feedback.isCorrect ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" /> Nailed it!
                      </>
                    ) : (
                      "Keep practicing!"
                    )}
                  </span>
                  {feedback.text}
                </div>
              ) : (
                <div className="mb-0 h-0" /> // removed spacing, we let flex manage it
              )}

              <div className="relative flex justify-center w-full mt-4 md:mt-0">
                <button
                  className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-[4px] border-black flex items-center justify-center transition-all duration-150 relative z-10 ${isRecording ? "bg-[#FF4911] shadow-[0px_0px_0px_rgba(0,0,0,1)] translate-y-1" : "bg-[#FFC900] shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-1"}`}
                  onPointerDown={startRecording}
                  onPointerUp={stopRecording}
                  onPointerLeave={() => {
                    if (isRecording) stopRecording();
                  }}
                >
                  {isRecording && (
                    <span className="absolute w-[160%] h-[160%] rounded-full border-[3px] border-[#FF4911] animate-ping opacity-100 pointer-events-none -z-10 bg-[#FF4911]/20"></span>
                  )}
                  <Mic
                    className={`w-10 h-10 md:w-12 md:h-12 stroke-[3] ${isRecording ? "text-white animate-pulse" : "text-black"}`}
                  />
                </button>
              </div>

              <div className="mt-8 font-black text-xs tracking-widest text-black/50 uppercase text-center bg-[#F4F4F0] px-4 py-2 rounded-xl border-2 border-black/10">
                <span className="hidden md:inline">
                  Hold{" "}
                  <kbd className="border-[2px] border-black/30 px-2 py-0.5 mx-1 rounded bg-[#EAE4DD] text-black/60 shadow-[1px_1px_0px_rgba(0,0,0,0.1)]">
                    SPACE
                  </kbd>{" "}
                  or click to record
                </span>
                <span className="md:hidden">Hold to record</span>
              </div>

              <div className="mt-4 font-black text-[10px] text-gray-400 text-center uppercase tracking-widest border-t-2 border-gray-100 pt-4 w-full">
                Attempts: {getProgressState(current.id, activeLevel).attempts}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SavedView() {
  const [expressions, setExpressions] = useState<SavedExpression[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("pattern_drill_saved") || "[]",
    );
    setExpressions(saved);
  }, []);

  const handleDelete = (id: string) => {
    const updated = expressions.filter((e) => e.id !== id);
    localStorage.setItem("pattern_drill_saved", JSON.stringify(updated));
    setExpressions(updated);
  };

  if (expressions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="w-16 h-16 bg-[#3CD070] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-2xl">
          <BookMarked className="w-6 h-6 text-black stroke-[2.5]" />
        </div>
        <div>
          <h3 className="font-bold text-xl uppercase tracking-tight text-black">
            No saved expressions
          </h3>
          <p className="text-black font-medium text-sm mt-1">
            Polish some text and save them here.
          </p>
        </div>
      </div>
    );
  }

  const filteredExpressions = expressions.filter(
    (exp) =>
      exp.original_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.english_sentence.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.key_pattern.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 overflow-y-auto w-full p-6 flex flex-col relative"
    >
      <div className="flex flex-col gap-4 mb-4 border-b-[3px] border-black pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-black uppercase tracking-wider">
            Collection
          </h2>
          <span className="bg-[#FF90E8] text-black border-[3px] border-black text-sm font-bold px-3 py-0.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full">
            {expressions.length}
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search patterns or phrases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#E0F2FE] border-[3px] border-black rounded-xl py-2 pl-9 pr-3 text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all"
          />
        </div>
      </div>
      {filteredExpressions.length === 0 ? (
        <div className="text-center py-10 flex-1">
          <p className="text-black font-bold uppercase">
            No matching expressions found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-max">
          {filteredExpressions.map((exp) => (
            <div
              key={exp.id}
              className="bg-white p-5 border-[3px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] relative flex flex-col gap-3 hover:-translate-y-1 hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] transition-all rounded-[1.5rem]"
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 border-[3px] border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full ${exp.scene_type === "work" ? "bg-[#3CD070]" : "bg-[#FF90E8]"}`}
                >
                  {exp.scene_type === "work" ? (
                    <Briefcase className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    <Coffee className="w-3 h-3 stroke-[2.5]" />
                  )}
                  {exp.scene_type}
                </span>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="bg-white hover:bg-[#FF4911] border-[3px] border-black p-1.5 opacity-0 group-hover:opacity-100 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] transition-all rounded-xl hover:text-white text-black"
                >
                  <Trash2 className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <p className="text-xs font-black text-gray-500 uppercase tracking-wide bg-[#F4F4F0] px-2 py-1 border-2 border-black inline-block self-start rounded-lg mb-1">
                {exp.original_text}
              </p>
              <p className="font-bold text-lg text-black leading-snug">
                {exp.english_sentence}
              </p>

              <div className="p-3 border-[3px] border-black flex flex-col gap-1 w-full bg-[#EAE4DD] rounded-xl mt-auto">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                  Pattern
                </span>
                <span className="font-bold bg-[#FFC900] px-1 rounded-sm w-fit">
                  {exp.key_pattern}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function HistoryView({ onLoad }: { onLoad: (result: PolishResult) => void }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("pattern_drill_history") || "[]",
    );
    setHistory(data);
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      localStorage.setItem("pattern_drill_history", "[]");
      setHistory([]);
    }
  };

  const filteredHistory = history.filter(
    (item) =>
      item.result.original_input
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.result.work.sentence
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.result.casual.sentence
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="w-16 h-16 bg-[#FFC900] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-2xl">
          <Clock className="w-6 h-6 text-black stroke-[2.5]" />
        </div>
        <div>
          <h3 className="font-bold text-xl uppercase tracking-tight text-black">
            No History Yet
          </h3>
          <p className="text-black font-medium text-sm mt-1">
            Translations you polish will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 overflow-y-auto w-full p-6 space-y-4 relative"
    >
      <div className="flex flex-col gap-4 mb-4 border-b-4 border-black pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-black uppercase tracking-wider">
            History
          </h2>
          <button
            onClick={handleClearHistory}
            className="bg-white text-black border-2 border-black text-xs font-bold px-2 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] transition-all uppercase"
          >
            Clear All
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search past polishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-black rounded-xl py-2 pl-9 pr-3 text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all"
          />
        </div>
      </div>
      {filteredHistory.length === 0 ? (
        <div className="text-center py-10 flex-1">
          <p className="text-black font-bold uppercase">
            No matching history found.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredHistory.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="bg-white p-5 border-[3px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] relative flex flex-col gap-2 hover:-translate-y-1 hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] transition-all rounded-[1.5rem] cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#2D80FF] flex items-center gap-1 group-hover:underline bg-[#E0F2FE] border-[3px] border-[#2D80FF] px-2 py-0.5 rounded-md">
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <ChevronDown className="w-3 h-3 stroke-[3]" />
                    )}
                    {isExpanded ? "collapse" : "expand details"}
                  </span>
                  <span className="text-[10px] font-black uppercase text-gray-500 border-2 border-gray-200 px-2 py-0.5 rounded-md">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p
                  className={`text-sm md:text-base font-bold text-black ${isExpanded ? "" : "line-clamp-2"}`}
                >
                  {item.result.original_input}
                </p>

                {isExpanded && (
                  <div className="mt-4 flex flex-col gap-4 border-t-[3px] border-black pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Work */}
                      <div className="bg-[#3CD070] text-black rounded-xl p-4 shadow-[2px_2px_0px_rgba(0,0,0,1)] border-[3px] border-black relative">
                        <div className="text-[10px] font-black uppercase mb-2 flex items-center gap-1 bg-white border-[3px] border-black w-fit px-2 py-0.5 rounded-md">
                          <Briefcase className="w-3 h-3" /> Work
                        </div>
                        <p className="text-sm font-bold pr-8">
                          {item.result.work.sentence}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTTS(item.result.work.sentence);
                          }}
                          className="absolute right-3 bottom-3 bg-white border-[3px] border-black p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] rounded-lg hover:bg-gray-100 transition-all"
                        >
                          <Volume2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Casual */}
                      <div className="bg-[#FF90E8] text-black rounded-xl p-4 shadow-[2px_2px_0px_rgba(0,0,0,1)] border-[3px] border-black relative">
                        <div className="text-[10px] font-black uppercase mb-2 flex items-center gap-1 bg-white border-[3px] border-black w-fit px-2 py-0.5 rounded-md">
                          <Coffee className="w-3 h-3" /> Casual
                        </div>
                        <p className="text-sm font-bold pr-8">
                          {item.result.casual.sentence}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTTS(item.result.casual.sentence);
                          }}
                          className="absolute right-3 bottom-3 bg-white border-[3px] border-black p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] rounded-lg hover:bg-gray-100 transition-all"
                        >
                          <Volume2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoad(item.result);
                      }}
                      className="w-full bg-[#EAE4DD] hover:bg-[#FFC900] text-black font-black uppercase tracking-wider text-xs py-3 rounded-xl border-[3px] border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all flex justify-center items-center gap-2"
                    >
                      <History className="w-4 h-4 stroke-[3]" /> Load into Polish
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
