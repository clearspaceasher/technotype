
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

const ArchetypeReveal: React.FC<ArchetypeRevealProps> = ({ archetype, archetypeData }) => {
  const [revealComplete, setRevealComplete] = useState(false);

  useEffect(() => {
    // Show the final result immediately with a small delay for animation purposes
    const timer = setTimeout(() => {
      setRevealComplete(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center">
      {/* Revealed archetype */}
      <motion.div
        className="relative w-80 h-80"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
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
                delay={400}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ArchetypeReveal;
