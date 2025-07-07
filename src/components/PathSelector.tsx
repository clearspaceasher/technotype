import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedText from "./AnimatedText";
import UserInfoForm from "./UserInfoForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [promptComplete, setPromptComplete] = useState(false);
  const [bump, setBump] = useState(false);
  const navigate = useNavigate();

  const promptText = `> welcome, ${userInfo?.name || 'user'}.

> initiating open sequence...
    no map. no right answers. just a conversation.

> press enter to begin

> `;

  const handleUserInfoComplete = (info: UserInfo) => {
    setUserInfo(info);
    setPhase('path-selection');
  };

  const handleExit = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (phase !== 'path-selection' || !promptComplete) return;
      
      if (e.key === "Enter") {
        // Trigger bump animation
        setBump(true);
        setTimeout(() => setBump(false), 300);
        // Start open sequence (path 2)
        setTimeout(() => onPathSelected(2, userInfo!), 500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onPathSelected, promptComplete, phase, userInfo]);

  if (phase === 'user-info') {
    return <UserInfoForm onComplete={handleUserInfoComplete} />;
  }

  return (
    <div className="min-h-screen bg-black text-terminal-light p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Terminal with outline */}
        <motion.div 
          className="border border-terminal-accent/50 rounded-lg p-6 bg-black/80"
          animate={bump ? { y: [-2, 0], scale: [1, 1.005, 1] } : {}}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Terminal header */}
          <div className="flex items-center mb-6 pb-4 border-b border-terminal-accent/30">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div 
                  className="w-3 h-3 rounded-full bg-red-500 mr-2 cursor-pointer hover:bg-red-400 transition-colors"
                  title="exit/restart"
                />
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-black border border-terminal-accent/50 text-terminal-light">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-terminal-light">Exit Path Selector?</AlertDialogTitle>
                  <AlertDialogDescription className="text-terminal-light/70">
                    Are you sure you want to exit? Your progress will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border border-terminal-accent/50 text-terminal-light hover:bg-terminal-accent/10">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleExit}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Exit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="ml-4 text-terminal-accent/70 text-sm">path_selector.exe</span>
          </div>
          
          {/* Terminal content */}
          <div className="space-y-2">
            {/* Prompt and cursor */}
            <div className="text-left">
              <AnimatedText
                text={promptText}
                speed={30}
                className="text-terminal-light whitespace-pre-line inline"
                onComplete={() => setPromptComplete(true)}
              />
              {promptComplete && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline"
                >
                  <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-pulse"></span>
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PathSelector;
