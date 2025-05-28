
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedText from "@/components/AnimatedText";
import { motion, AnimatePresence } from "framer-motion";

const LandingPage: React.FC = () => {
  console.log("LandingPage component rendering");
  
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [showCTA, setShowCTA] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const navigate = useNavigate();

  const lines = [
    { text: "Your digital behavior is more than habit", rotation: 0, bold: false },
    { text: "— it's a reflection", rotation: 0, bold: true },
    { text: "This short experience helps you map your mind through the lens of screentime.", rotation: 0, bold: false },
    { text: "It's not just screentime.", rotation: 0, bold: false },
    { text: "It's self-time.", rotation: 0, bold: true },
  ];

  useEffect(() => {
    console.log("LandingPage: currentLine changed to", currentLine);
    // Handle animation sequence completions
    if (currentLine >= lines.length) {
      console.log("LandingPage: all lines complete, showing CTA");
      setTimeout(() => setShowCTA(true), 500);
    }
  }, [currentLine, lines.length]);

  const handleLineComplete = () => {
    console.log("LandingPage: line complete, moving to next");
    setTimeout(() => {
      setCurrentLine(prev => prev + 1);
    }, 800); // Delay between lines
  };

  // Figure 8 animation path
  const figure8Path = {
    x: [0, 20, 0, -20, 0],
    y: [0, -10, 0, -10, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    }
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("LandingPage: CTA clicked, navigating to quiz");
    setIsAnimating(true);
    // Wait for zoom animation to complete before navigating
    setTimeout(() => {
      document.body.style.backgroundColor = "black";
      navigate('/quiz');
    }, 1000);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center bg-black p-4 overflow-hidden"
        initial={{ opacity: 1, backgroundColor: "black" }}
        animate={isAnimating ? { scale: 20, opacity: 0, backgroundColor: "black" } : { scale: 1, opacity: 1, backgroundColor: "black" }}
        exit={{ opacity: 0, backgroundColor: "black" }}
        transition={{ 
          duration: isAnimating ? 1 : 0.5,
          ease: "easeInOut" 
        }}
      >
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
                    className={`text-terminal-light font-mono text-xl md:text-2xl tracking-tight text-center`}
                    onComplete={handleLineComplete}
                    bold={line.bold}
                    noWrap={true}
                  />
                )}
                {index === currentLine - 1 && (
                  <div className={`text-terminal-light font-mono text-xl md:text-2xl tracking-tight text-center opacity-0 ${line.bold ? 'font-bold' : ''} whitespace-nowrap`}>
                    {line.text}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Button - Only show after all lines are typed */}
          {showCTA && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-16 mb-8"
            >
              <a 
                href="/quiz" 
                onClick={handleCtaClick}
                className="group flex items-center justify-center gap-3 text-2xl md:text-4xl text-terminal-accent font-mono hover:text-glow transition-all duration-300 transform hover:scale-105"
              >
                <motion.div 
                  className="flex items-center"
                  animate={figure8Path}
                >
                  <motion.span className="absolute -left-9 group-hover:translate-x-2 transition-transform duration-300">→</motion.span>
                  <AnimatedText
                    text="explore your mind"
                    speed={30}
                    className="text-terminal-accent"
                    bold={false}
                    noWrap={true}
                  />
                </motion.div>
              </a>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LandingPage;
