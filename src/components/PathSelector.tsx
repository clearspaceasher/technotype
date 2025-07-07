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
  const [phase, setPhase] = useState<'user-info' | 'matrix-quote'>('user-info');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [quoteComplete, setQuoteComplete] = useState(false);
  const [matrixStarted, setMatrixStarted] = useState(false);
  const [fadeIntensity, setFadeIntensity] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [binaryText, setBinaryText] = useState('');
  const [clickable, setClickable] = useState(false);
  const navigate = useNavigate();

  const matrixQuotes = [
    "There is no spoon.",
    "Welcome to the desert of the real.",
    "The Matrix has you.",
    "Follow the white rabbit.",
    "Free your mind.",
    "What is real?",
    "You take the blue pill, the story ends.",
    "Reality is often disappointing.",
    "The body cannot live without the mind."
  ];
  
  const selectedQuote = matrixQuotes[Math.floor(Math.random() * matrixQuotes.length)];

  const handleUserInfoComplete = (info: UserInfo) => {
    setUserInfo(info);
    setPhase('matrix-quote');
  };

  const handleExit = () => {
    navigate('/');
  };

  const handleQuoteComplete = () => {
    setQuoteComplete(true);
    // Start matrix transformation after 1 second
    setTimeout(() => {
      setMatrixStarted(true);
      startMatrixTransformation();
    }, 1000);
  };

  const startMatrixTransformation = () => {
    let transformSpeed = 1000; // Start slow
    let fadeSpeed = 50;
    let currentFade = 0;
    let currentGlow = 0;
    
    const transformInterval = setInterval(() => {
      // Transform text to binary
      const newBinary = selectedQuote
        .split('')
        .map(char => char === ' ' ? ' ' : Math.random() > 0.5 ? '1' : '0')
        .join('');
      setBinaryText(newBinary);
      
      // Speed up transformation
      transformSpeed = Math.max(50, transformSpeed * 0.9);
      clearInterval(transformInterval);
      setTimeout(() => startMatrixTransformation(), transformSpeed);
      
      // Increase fade and glow
      currentFade = Math.min(0.95, currentFade + 0.02);
      currentGlow = Math.min(1, currentGlow + 0.03);
      setFadeIntensity(currentFade);
      setGlowIntensity(currentGlow);
      
      // Make clickable when effect is strong enough
      if (currentFade > 0.7) {
        setClickable(true);
      }
    }, transformSpeed);
  };

  const handleMatrixClick = () => {
    if (clickable && userInfo) {
      onPathSelected(2, userInfo);
    }
  };

  if (phase === 'user-info') {
    return <UserInfoForm onComplete={handleUserInfoComplete} />;
  }

  return (
    <div className="min-h-screen bg-black text-terminal-light p-8 font-mono relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Terminal with outline - fades out */}
        <motion.div 
          className="border border-terminal-accent/50 rounded-lg p-6 bg-black/80"
          animate={{ 
            opacity: 1 - fadeIntensity,
            scale: 1 - (fadeIntensity * 0.1)
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Terminal header - fades out */}
          <motion.div 
            className="flex items-center mb-6 pb-4 border-b border-terminal-accent/30"
            animate={{ opacity: 1 - fadeIntensity }}
          >
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
            <span className="ml-4 text-terminal-accent/70 text-sm">matrix.exe</span>
          </motion.div>
          
          {/* Matrix Quote Content */}
          <div className="text-center py-8">
            <div 
              className={`text-2xl md:text-4xl font-mono transition-all duration-300 ${
                clickable ? 'cursor-pointer' : ''
              }`}
              onClick={handleMatrixClick}
              style={{
                textShadow: matrixStarted ? 
                  `0 0 ${5 + (glowIntensity * 15)}px #00ff00, 0 0 ${10 + (glowIntensity * 30)}px #00ff00` : 
                  'none',
                color: matrixStarted ? '#00ff00' : '#ffffff'
              }}
            >
              {!quoteComplete && (
                <AnimatedText
                  text={selectedQuote}
                  speed={50}
                  className="text-terminal-light"
                  onComplete={handleQuoteComplete}
                />
              )}
              {matrixStarted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-400"
                >
                  {binaryText}
                </motion.div>
              )}
              {quoteComplete && !matrixStarted && (
                <div className="text-terminal-light">
                  {selectedQuote}
                </div>
              )}
            </div>
            
            {clickable && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                className="mt-8 text-sm text-terminal-accent/70"
              >
                click to enter the matrix...
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PathSelector;
