
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";

interface PathSelectorProps {
  onPathSelected: (path: 1 | 2) => void;
}

const PathSelector: React.FC<PathSelectorProps> = ({ onPathSelected }) => {
  const [currentInput, setCurrentInput] = useState("");
  const [showError, setShowError] = useState(false);
  const [promptComplete, setPromptComplete] = useState(false);

  const promptText = `> choose your path:

[1] guided protocol
    a structured diagnostic of your digital psyche

[2] open sequence  
    no map. no right answers. just a conversation.

> `;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!promptComplete) return;
      
      if (e.key === "1") {
        setCurrentInput("1");
        setTimeout(() => onPathSelected(1), 500);
      } else if (e.key === "2") {
        setCurrentInput("2");
        setTimeout(() => onPathSelected(2), 500);
      } else if (e.key.length === 1) {
        // Any other single character input
        setCurrentInput(e.key);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
          setCurrentInput("");
        }, 1500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onPathSelected, promptComplete]);

  return (
    <div className="min-h-screen bg-black text-terminal-light p-8 font-mono">
      <div className="max-w-2xl mx-auto">
        {/* Terminal header */}
        <div className="flex items-center mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        
        {/* Terminal content */}
        <div className="space-y-2">
          <AnimatedText
            text={promptText}
            speed={30}
            className="text-terminal-light whitespace-pre-line text-left"
            onComplete={() => setPromptComplete(true)}
          />
          
          {promptComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center"
            >
              <span className="text-terminal-light">{currentInput}</span>
              <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-pulse"></span>
            </motion.div>
          )}
          
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 mt-4"
            >
              <AnimatedText
                text="invalid input. choose [1] or [2]"
                speed={20}
                className="text-red-400"
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathSelector;
