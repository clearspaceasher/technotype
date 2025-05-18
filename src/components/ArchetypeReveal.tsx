
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";

interface ArchetypeRevealProps {
  archetype: string;
  archetypeData: {
    id: string;
    name: string;
    color: string;
  };
}

const archetypeIcons = [
  "optimizer", "skeptic", "seeker", "unplugger"
];

const ArchetypeReveal: React.FC<ArchetypeRevealProps> = ({ archetype, archetypeData }) => {
  const [isSpinning, setIsSpinning] = useState(true);
  const [revealComplete, setRevealComplete] = useState(false);

  useEffect(() => {
    // Stop the spinning animation after 3 seconds
    const timer = setTimeout(() => {
      setIsSpinning(false);
      
      // Show the final result after the spinning stops
      setTimeout(() => {
        setRevealComplete(true);
      }, 500);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center">
      {/* Spinning animation container */}
      <motion.div
        className="relative w-80 h-80"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Spinning icons */}
        {isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center">
            {archetypeIcons.map((icon, index) => (
              <SpinningArchetype
                key={icon}
                index={index}
                isTarget={icon === archetype}
              />
            ))}
          </div>
        )}
        
        {/* Revealed archetype */}
        {!isSpinning && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: revealComplete ? [0, -10, 0] : 0
            }}
            transition={{ 
              duration: 0.5,
              y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
            }}
          >
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold mb-6"
              style={{ backgroundColor: archetypeData.color, color: 'black' }}
            >
              {archetypeData.id.charAt(0).toUpperCase()}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-terminal-light mb-2">
                {archetypeData.name}
              </h3>
              
              <div className="text-terminal-accent text-sm md:text-base mt-6">
                <AnimatedText 
                  text="Your digital identity has been revealed" 
                  speed={30}
                  delay={800}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Component for the spinning archetypes
const SpinningArchetype: React.FC<{ index: number; isTarget: boolean }> = ({ index, isTarget }) => {
  // Different colors for each spinning icon
  const colors = ["#4ADE80", "#F43F5E", "#9b87f5", "#0FA0CE"];
  
  return (
    <motion.div
      className="absolute w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
      style={{ backgroundColor: colors[index % colors.length] }}
      animate={{
        x: [
          Math.sin(index * Math.PI/2) * 100,
          Math.sin(index * Math.PI/2 + Math.PI) * 100,
          Math.sin(index * Math.PI/2 + Math.PI * 2) * 100,
          Math.sin(index * Math.PI/2 + Math.PI * 3) * 100,
          isTarget ? 0 : (Math.sin(index * Math.PI/2) * 200)
        ],
        y: [
          Math.cos(index * Math.PI/2) * 100,
          Math.cos(index * Math.PI/2 + Math.PI) * 100,
          Math.cos(index * Math.PI/2 + Math.PI * 2) * 100,
          Math.cos(index * Math.PI/2 + Math.PI * 3) * 100,
          isTarget ? 0 : (Math.cos(index * Math.PI/2) * 200)
        ],
        scale: isTarget ? [1, 1, 1, 1, 1.2] : [1, 1, 1, 1, 0.5],
        opacity: isTarget ? 1 : [1, 1, 1, 1, 0],
        rotate: [0, 180, 360, 540, 720],
      }}
      transition={{
        duration: 3,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
    >
      {String.fromCharCode(65 + index)}
    </motion.div>
  );
};

export default ArchetypeReveal;
