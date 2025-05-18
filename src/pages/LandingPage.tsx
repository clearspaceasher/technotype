
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
    setTimeout(() => {
      setCurrentLine(prev => prev + 1);
    }, 800); // Delay between lines
  };

  // Function to determine exit direction based on upcoming rotation
  const getExitDirection = (currentIdx: number) => {
    if (currentIdx >= lines.length - 1) return { y: -100 };
    
    const nextRotation = lines[currentIdx + 1].rotation;
    
    if (nextRotation === 90) return { y: -100, x: 0 }; // Exit upward
    if (nextRotation === -90) return { y: 100, x: 0 }; // Exit downward
    
    // For level text, exit opposite to where the previous came from
    if (currentIdx > 0) {
      const prevRotation = lines[currentIdx].rotation;
      if (prevRotation === 90) return { y: -100, x: 0 }; // Continue upward movement
      if (prevRotation === -90) return { y: 100, x: 0 }; // Continue downward movement
    }
    
    return { y: -100 }; // Default exit upward
  };
  
  // Function to determine entry direction based on rotation
  const getEntryDirection = (rotation: number) => {
    if (rotation === 90) return { y: 100, x: 0 }; // Enter from bottom
    if (rotation === -90) return { y: -100, x: 0 }; // Enter from top
    return { y: 100, x: 0 }; // Default enter from bottom
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-dark p-4 overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* Animated text lines */}
        <div className="relative w-full flex-1 flex items-center justify-center">
          {lines.map((line, index) => (
            <motion.div
              key={`line-${index}`}
              initial={{ 
                opacity: 0, 
                ...getEntryDirection(line.rotation)
              }}
              animate={{ 
                opacity: currentLine === index ? 1 : 0,
                y: currentLine === index ? 0 : 
                  (currentLine > index ? getExitDirection(index).y : getEntryDirection(line.rotation).y),
                x: currentLine === index ? 0 : 
                  (currentLine > index ? getExitDirection(index).x : getEntryDirection(line.rotation).x)
              }}
              exit={{ 
                opacity: 0, 
                ...getExitDirection(index)
              }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{ 
                position: 'absolute',
                transform: `rotate(${line.rotation}deg)`,
                maxWidth: "90vw",
                display: (index === currentLine || index === currentLine - 1) ? 'block' : 'none'
              }}
            >
              {index === currentLine && (
                <AnimatedText
                  text={line.text}
                  speed={30}
                  className="text-terminal-light font-mono text-[20vh] leading-tight text-center whitespace-nowrap"
                  onComplete={handleLineComplete}
                />
              )}
              {index === currentLine - 1 && (
                <div className="text-terminal-light font-mono text-[20vh] leading-tight text-center whitespace-nowrap">
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
