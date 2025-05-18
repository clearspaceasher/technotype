
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimatedText from "@/components/AnimatedText";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [showCTA, setShowCTA] = useState<boolean>(false);

  const lines = [
    { text: "Your digital behavior is more than habit", rotation: 0, bold: false },
    { text: "— it's a reflection", rotation: 0, bold: true },
    { text: "This short experience helps you map your mind through the lens of screentime.", rotation: 0, bold: false },
    { text: "It's not just screentime.", rotation: 0, bold: false },
    { text: "It's self-time.", rotation: 0, bold: true }
  ];

  useEffect(() => {
    // Handle animation sequence completions
    if (currentLine >= lines.length) {
      setTimeout(() => setShowCTA(true), 500);
    }
  }, [currentLine]);

  const handleLineComplete = () => {
    setTimeout(() => {
      setCurrentLine(prev => prev + 1);
    }, 800); // Delay between lines
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-dark p-4 overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* Animated text lines */}
        <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center">
          {lines.map((line, index) => (
            <motion.div
              key={`line-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: currentLine === index ? 1 : 0,
                y: currentLine === index ? 0 : (currentLine > index ? -20 : 20)
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ 
                position: 'absolute',
                width: "90%",
                display: (index <= currentLine && index === currentLine - 1) || index === currentLine ? 'block' : 'none'
              }}
              className="w-full px-8"
            >
              {index === currentLine && (
                <AnimatedText
                  text={line.text}
                  speed={30}
                  className="text-terminal-light font-mono text-xl md:text-2xl tracking-tight text-center whitespace-nowrap"
                  onComplete={handleLineComplete}
                  bold={line.bold}
                />
              )}
              {index === currentLine - 1 && (
                <div className={`text-terminal-light font-mono text-xl md:text-2xl tracking-tight text-center opacity-0 whitespace-nowrap ${line.bold ? 'font-bold' : ''}`}>
                  {line.text}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: showCTA ? 1 : 0, 
            scale: showCTA ? 1 : 0.9,
            y: showCTA ? 0 : 20
          }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 100
          }}
          className="mt-16 mb-8"
        >
          {showCTA && (
            <Link 
              to="/quiz" 
              className="group flex items-center justify-center gap-3 text-xl md:text-2xl text-terminal-accent font-mono hover:text-glow transition-all duration-300 transform hover:scale-105"
            >
              <motion.span 
                className="relative"
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  duration: 1.5 
                }}
              >
                <span className="absolute -left-9 group-hover:translate-x-2 transition-transform duration-300">→</span>
                explore your mind
              </motion.span>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
