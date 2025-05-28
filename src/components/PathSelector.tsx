
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";
import UserInfoForm from "./UserInfoForm";

interface UserInfo {
  name: string;
  age: string;
  gender: string;
}

interface PathSelectorProps {
  onPathSelected: (path: 1 | 2, userInfo: UserInfo) => void;
}

const PathSelector: React.FC<PathSelectorProps> = ({ onPathSelected }) => {
  const [phase, setPhase] = useState<'user-info' | 'path-selection'>('user-info');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentInput, setCurrentInput] = useState("");
  const [showError, setShowError] = useState(false);
  const [promptComplete, setPromptComplete] = useState(false);
  const [selectedPath, setSelectedPath] = useState<"1" | "2" | null>(null);
  const [isZooming, setIsZooming] = useState(false);

  const promptText = `> welcome, ${userInfo?.name || 'user'}.

> choose your path:

[1] guided protocol
    a structured diagnostic of your digital psyche

[2] open sequence  
    no map. no right answers. just a conversation.

> `;

  const handleUserInfoComplete = (info: UserInfo) => {
    setUserInfo(info);
    setPhase('path-selection');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (phase !== 'path-selection' || !promptComplete) return;
      
      if (e.key === "Enter" && selectedPath) {
        // Confirm selection with Enter and start zoom animation
        setIsZooming(true);
        setTimeout(() => {
          onPathSelected(parseInt(selectedPath) as 1 | 2, userInfo!);
        }, 1000);
      } else if (e.key === "1" || e.key === "2") {
        setSelectedPath(e.key as "1" | "2");
        setCurrentInput(e.key);
        setShowError(false);
      } else if (e.key === "Backspace") {
        setSelectedPath(null);
        setCurrentInput("");
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Any other single character input
        setCurrentInput(e.key);
        setSelectedPath(null);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
          setCurrentInput("");
        }, 1500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onPathSelected, promptComplete, selectedPath, phase, userInfo]);

  if (phase === 'user-info') {
    return <UserInfoForm onComplete={handleUserInfoComplete} />;
  }

  return (
    <motion.div 
      className="min-h-screen bg-black text-terminal-light p-8 font-mono"
      initial={{ opacity: 1, scale: 1 }}
      animate={isZooming ? { scale: 20, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ 
        duration: isZooming ? 1 : 0.5,
        ease: "easeInOut" 
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Terminal with outline */}
        <div className="border border-terminal-accent/50 rounded-lg p-6 bg-black/80">
          {/* Terminal header */}
          <div className="flex items-center mb-6 pb-4 border-b border-terminal-accent/30">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="ml-4 text-terminal-accent/70 text-sm">path_selector.exe</span>
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
                className="flex items-center text-left"
              >
                <span className="text-terminal-light">{currentInput}</span>
                <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-pulse"></span>
              </motion.div>
            )}
            
            {selectedPath && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-terminal-accent mt-4 text-left"
              >
                <AnimatedText
                  text="selection confirmed. press enter to continue..."
                  speed={20}
                  className="text-terminal-accent text-left"
                />
              </motion.div>
            )}
            
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 mt-4 text-left"
              >
                <AnimatedText
                  text="invalid input. choose [1] or [2]"
                  speed={20}
                  className="text-red-400 text-left"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PathSelector;
