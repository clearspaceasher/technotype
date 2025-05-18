
import React from "react";
import { motion } from "framer-motion";
import { Computer } from "lucide-react";

interface PixelIconProps {
  onClick: () => void;
  clickCount: number;
}

const PixelIcon: React.FC<PixelIconProps> = ({ onClick, clickCount }) => {
  return (
    <motion.div 
      className="cursor-pointer flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      animate={clickCount > 0 ? { scale: [1, 0.95, 1] } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Pixelated border for the icon */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 border-2 border-terminal-accent flex items-center justify-center bg-black p-1">
        {/* Pixelated corners */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-black"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-black"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-black"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-black"></div>
        
        {/* Pixelated Icon */}
        <div className="w-full h-full flex items-center justify-center bg-black">
          <Computer className="w-16 h-16 md:w-20 md:h-20 text-terminal-accent" />
        </div>
      </div>
      
      {/* Icon text */}
      <div className="mt-3 text-terminal-light text-xs md:text-sm font-mono">
        <AnimatedPixelText text="TECHNOTYPE.EXE" />
      </div>
      
      {/* Double-click hint */}
      <div className="mt-2 text-terminal-muted text-[10px] md:text-xs italic">
        Double-click to run
      </div>
    </motion.div>
  );
};

// Simple component for the pixelated text animation
const AnimatedPixelText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.05 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default PixelIcon;
