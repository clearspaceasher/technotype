
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AnimatedText from "@/components/AnimatedText";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [showCTA, setShowCTA] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Breaking down longer sentences into smaller chunks
  const lines = [
    { text: "Your digital behavior" },
    { text: "is more than habit" },
    { text: "— it's a reflection" },
    { text: "This short experience" },
    { text: "helps you map your mind" },
    { text: "through the lens of screentime" },
    { text: "It's not just screentime" },
    { text: "It's self-time" }
  ];

  useEffect(() => {
    // Handle animation sequence completions
    if (currentLine >= lines.length) {
      setTimeout(() => setShowCTA(true), 800); // Slightly longer delay before showing CTA
    }
  }, [currentLine]);

  const handleLineComplete = () => {
    // Ensure we're advancing to the next line
    setCurrentLine(prev => prev + 1);
  };

  useEffect(() => {
    // For debugging - log current line index
    console.log("Current line:", currentLine);
  }, [currentLine]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-dark p-4 overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* Animated text lines */}
        <div className="relative w-full flex-1 flex items-center justify-center" ref={containerRef}>
          {lines.map((line, index) => (
            <motion.div
              key={`line-${index}`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ 
                opacity: currentLine === index ? 1 : 0,
                y: currentLine === index ? 0 : 
                  (currentLine > index ? -50 : 50),
              }}
              transition={{ duration: 0.9, ease: "easeInOut" }} // Slower transition
              style={{ 
                position: 'absolute',
                maxWidth: "90vw",
                display: (index === currentLine || index === currentLine - 1) ? 'block' : 'none',
              }}
              className="flex justify-center items-center"
            >
              {index === currentLine && (
                <AnimatedText
                  text={line.text}
                  speed={50} // Slower typing speed
                  className="text-terminal-light font-mono text-[7vh] md:text-[10vh] lg:text-[15vh] leading-tight text-center"
                  onComplete={handleLineComplete}
                />
              )}
              {index === currentLine - 1 && (
                <div className="text-terminal-light font-mono text-[7vh] md:text-[10vh] lg:text-[15vh] leading-tight text-center">
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
          transition={{ duration: 0.8 }} // Slower CTA animation
          className="mt-16 mb-8"
        >
          {showCTA && (
            <Link 
              to="/quiz" 
              className="group flex items-center justify-center gap-3 text-[4vh] md:text-[6vh] text-terminal-accent font-mono hover:text-glow transition-all duration-300 transform hover:scale-105"
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
