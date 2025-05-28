
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";

interface UserInfo {
  name: string;
  age: string;
  gender: string;
}

interface UserInfoFormProps {
  onComplete: (userInfo: UserInfo) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onComplete }) => {
  const [currentField, setCurrentField] = useState<'name' | 'age' | 'gender'>('name');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    age: '',
    gender: ''
  });
  const [currentInput, setCurrentInput] = useState("");
  const [promptComplete, setPromptComplete] = useState(false);
  const [showError, setShowError] = useState(false);
  const [bump, setBump] = useState(false);

  const prompts = {
    name: "> what should we call you?\n\n> ",
    age: "> how old are you?\n\n> ",
    gender: "> what's your gender? (m/f/other)\n\n> "
  };

  const currentPrompt = prompts[currentField];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!promptComplete) return;
      
      if (e.key === "Enter") {
        if (currentInput.trim()) {
          if (currentField === 'gender') {
            const validGenders = ['m', 'f', 'male', 'female', 'other', 'non-binary', 'nb'];
            if (!validGenders.includes(currentInput.toLowerCase().trim())) {
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
                setCurrentInput("");
              }, 2000);
              return;
            }
          }

          // Trigger bump animation
          setBump(true);
          setTimeout(() => setBump(false), 300);

          const newUserInfo = { ...userInfo, [currentField]: currentInput.trim() };
          setUserInfo(newUserInfo);
          setCurrentInput("");
          setPromptComplete(false);

          // Move to next field or complete
          if (currentField === 'name') {
            setCurrentField('age');
          } else if (currentField === 'age') {
            setCurrentField('gender');
          } else {
            // All fields complete
            setTimeout(() => onComplete(newUserInfo), 500);
          }
        }
      } else if (e.key === "Backspace") {
        setCurrentInput(prev => prev.slice(0, -1));
        setShowError(false);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setCurrentInput(prev => prev + e.key);
        setShowError(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [promptComplete, currentInput, currentField, userInfo, onComplete]);

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
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="ml-4 text-terminal-accent/70 text-sm">user_registration.exe</span>
          </div>
          
          {/* Terminal content */}
          <div className="space-y-2">
            {/* Show completed fields */}
            {userInfo.name && (
              <div className="text-left text-terminal-light/70">
                {`> name: ${userInfo.name}`}
              </div>
            )}
            {userInfo.age && (
              <div className="text-left text-terminal-light/70">
                {`> age: ${userInfo.age}`}
              </div>
            )}
            {userInfo.gender && (
              <div className="text-left text-terminal-light/70">
                {`> gender: ${userInfo.gender}`}
              </div>
            )}
            
            {/* Current prompt and input on same line */}
            <div className="text-left">
              <AnimatedText
                text={currentPrompt}
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
                  <span className="text-terminal-light">{currentInput}</span>
                  <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-pulse"></span>
                </motion.span>
              )}
            </div>
            
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 mt-4 text-left"
              >
                <AnimatedText
                  text="please enter m, f, or other"
                  speed={20}
                  className="text-red-400 text-left"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserInfoForm;
