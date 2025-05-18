
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AnimatedText from "@/components/AnimatedText";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [showCTA, setShowCTA] = useState<boolean>(false);
  const [textProgress, setTextProgress] = useState<number>(0);
  const [lastLineEndPosition, setLastLineEndPosition] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // This function updates the typing progress (0-100%)
  const handleTextProgress = (progress: number) => {
    setTextProgress(progress);

    // Save the ending position of the current line when it completes typing
    if (progress >= 99 && currentLine < lines.length - 1) {
      setLastLineEndPosition(calculateEndPosition(currentLine));
    }
  };

  // Calculate the final position of the current line
  const calculateEndPosition = (lineIndex: number) => {
    const line = lines[lineIndex];
    return line.text.length;
  };

  const handleLineComplete = () => {
    setTextProgress(0);
    setTimeout(() => {
      setCurrentLine(prev => prev + 1);
    }, 800); // Delay between lines
  };

  // Function to determine exit animation for current line
  const getExitAnimation = (currentIdx: number, nextIdx: number) => {
    if (currentIdx >= lines.length - 1) return { y: -100, opacity: 0 };
    
    // Get the rotation of the next line to determine exit direction
    const nextRotation = nextIdx < lines.length ? lines[nextIdx].rotation : 0;
    
    if (nextRotation === 90) return { y: -100, opacity: 0 }; // Exit upward
    if (nextRotation === -90) return { y: 100, opacity: 0 }; // Exit downward
    
    // Default exit upward
    return { y: -100, opacity: 0 };
  };

  // Function to determine entry animation based on rotation
  const getEntryAnimation = (rotation: number) => {
    if (rotation === 90) return { y: 100, opacity: 0 }; // Enter from bottom
    if (rotation === -90) return { y: -100, opacity: 0 }; // Enter from top
    return { y: 100, opacity: 0 }; // Default enter from bottom
  };

  // Calculate the starting position for each new line
  const getStartingPosition = (index: number) => {
    if (index === 0) return 0;
    return lastLineEndPosition;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-dark p-4 overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* Animated text lines */}
        <div className="relative w-full flex-1 flex items-center justify-center" ref={containerRef}>
          {lines.map((line, index) => (
            <motion.div
              key={`line-${index}`}
              initial={getEntryAnimation(line.rotation)}
              animate={{ 
                opacity: currentLine === index ? 1 : 0,
                y: currentLine === index ? 0 : 
                  (currentLine > index ? getExitAnimation(index, index + 1).y : getEntryAnimation(line.rotation).y),
              }}
              exit={getExitAnimation(index, index + 1)}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{ 
                position: 'absolute',
                transformOrigin: line.rotation === 90 ? 'bottom center' : line.rotation === -90 ? 'top center' : 'center',
                maxWidth: "90vw",
                display: (index === currentLine || index === currentLine - 1) ? 'block' : 'none',
                // Apply rotation immediately (not animated)
                transform: `rotate(${line.rotation}deg) translateX(${
                  currentLine === index 
                    ? `-${(textProgress)}%` 
                    : getStartingPosition(index) + 'px'
                })`,
              }}
              className="flex justify-center items-center"
            >
              {index === currentLine && (
                <AnimatedText
                  text={line.text}
                  speed={30}
                  className="text-terminal-light font-mono text-[20vh] leading-tight text-center whitespace-nowrap"
                  onComplete={handleLineComplete}
                  onProgress={handleTextProgress}
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
