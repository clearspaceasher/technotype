
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimatedText from "@/components/AnimatedText";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [showCTA, setShowCTA] = useState<boolean>(false);

  const lines = [
    { text: "Your digital behavior is more than habit", rotation: 0 },
    { text: "— it's a reflection", rotation: 90 },
    { text: "This short experience helps you map your mind through the lens of screentime.", rotation: 0 },
    { text: "It's not just screentime.", rotation: -90 },
    { text: "It's self-time.", rotation: 0 }
  ];

  useEffect(() => {
    // Handle animation sequence completions
    if (currentLine >= lines.length) {
      setTimeout(() => setShowCTA(true), 500);
    }
  }, [currentLine]);

  const handleLineComplete = () => {
    setCurrentLine(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-dark p-4 overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* Animated text lines */}
        <div className="relative w-full flex-1 flex items-center justify-center">
          {lines.map((line, index) => (
            <motion.div
              key={`line-${index}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: currentLine === index ? 1 : 0,
                y: currentLine === index ? 0 : (currentLine > index ? -50 : 50)
              }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              style={{ 
                position: 'absolute',
                transform: `rotate(${line.rotation}deg)`,
                width: "90vw",
                display: (index <= currentLine && index === currentLine - 1) || index === currentLine ? 'block' : 'none'
              }}
              className="flex justify-center"
            >
              {index === currentLine && (
                <AnimatedText
                  text={line.text}
                  speed={30}
                  className="text-terminal-light font-mono leading-tight text-center"
                  onComplete={handleLineComplete}
                  singleLine={true} // Enable single line mode
                />
              )}
              {index === currentLine - 1 && (
                <div className="text-terminal-light font-mono leading-tight text-center opacity-0">
                  {line.text}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: showCTA ? 1 : 0, scale: showCTA ? 1 : 0.9 }}
          transition={{ duration: 0.5 }}
          className="mt-16 mb-8"
        >
          {showCTA && (
            <Link 
              to="/quiz" 
              className="group flex items-center justify-center gap-3 text-[8vh] text-terminal-accent font-mono hover:text-glow transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative">
                <span className="absolute -left-9 group-hover:translate-x-2 transition-transform duration-300">→</span>
                explore your mind
              </span>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
