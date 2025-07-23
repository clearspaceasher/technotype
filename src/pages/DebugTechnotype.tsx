import React, { useState } from "react";
import { generateTechnotypeFromConversation } from "@/lib/openai";
import { Button } from "@/components/ui/button";

const mockConversation = [
  { role: "user", content: "I use my phone a lot for work and social media." },
  { role: "assistant", content: "How do you feel when you are away from your devices?" },
  { role: "user", content: "A bit anxious, but sometimes relieved." },
  { role: "assistant", content: "Do you prefer digital or analog tools for organizing your life?" },
  { role: "user", content: "Mostly digital, but I like notebooks too." },
  { role: "assistant", content: "How do you unwind after a long day?" },
  { role: "user", content: "Usually with YouTube or a podcast." },
  { role: "assistant", content: "Do you set boundaries for screentime?" },
  { role: "user", content: "I try, but it's hard to stick to them." },
  { role: "assistant", content: "What would you like to change about your tech habits?" },
  { role: "user", content: "I'd like to be more intentional and less reactive." }
];

const DebugTechnotype: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await generateTechnotypeFromConversation(mockConversation);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-terminal-light p-8 font-mono flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8 text-terminal-accent">Debug: Generate Technotype</h1>
        <Button
          className="mb-6 bg-terminal-accent text-black hover:bg-terminal-accent/80 font-mono text-lg px-6 py-3 rounded-lg"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate with Mock Conversation"}
        </Button>
        {error && (
          <div className="text-red-400 mt-4">Error: {error}</div>
        )}
        {result && (
          <pre className="bg-terminal-accent/10 text-terminal-light text-left p-4 rounded-lg mt-6 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default DebugTechnotype; 