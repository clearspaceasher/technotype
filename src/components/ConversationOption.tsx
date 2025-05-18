
import React, { useState } from "react";
import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";

interface ConversationOptionProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
  animateText?: boolean;
  isLeftOption?: boolean; // To determine which direction the figure-8 goes
}

const ConversationOption: React.FC<ConversationOptionProps> = ({ 
  text,
  onClick,
  disabled = false,
  selected = false,
  animateText = false,
  isLeftOption = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  // Even more aggressive figure-8 animation pattern, mirrored for each option
  const figure8Motion = {
    x: isLeftOption 
      ? [0, 30, 50, 30, 0, -30, -50, -30, 0]
      : [0, -30, -50, -30, 0, 30, 50, 30, 0],
    y: [0, -20, 0, 20, 0, -20, 0, 20, 0]
  };

  // Handle click with animation
  const handleClick = () => {
    if (disabled) return;
    
    // Set clicked state to trigger animation
    setIsClicked(true);
    
    // Reset after animation completes
    setTimeout(() => {
      setIsClicked(false);
      onClick();
    }, 150); // Animation duration
  };

  return (
    <motion.button
      className={`text-center transition-all duration-200 ${
        selected ? "text-terminal-accent text-glow" : 
        isHovered ? "text-terminal-accent text-glow" : "text-white"
      } ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } mt-4 w-full`}
      onClick={disabled ? undefined : handleClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      animate={figure8Motion}
      transition={{
        duration: 2.0, // Even faster animation for more aggressive sway
        ease: "easeInOut",
        times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
        repeat: Infinity,
        repeatType: "loop"
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className="flex items-center justify-center space-x-2"
        animate={isClicked ? { 
          scale: [1, 0.95, 1.05, 1],
          opacity: [1, 0.8, 1] 
        } : {}}
        transition={{ duration: 0.15 }}
      >
        <div className="text-2xl md:text-3xl flex-1">
          {animateText ? (
            <AnimatedText 
              text={text} 
              speed={15}
              className={selected || isHovered ? "text-terminal-accent font-bold text-glow" : "text-white font-bold"}
              bold={true}
              noWrap={true}
            />
          ) : (
            <span className={selected || isHovered ? "text-terminal-accent font-bold text-glow" : "text-white font-bold"}>
              {text}
            </span>
          )}
        </div>
      </motion.div>
      
      {/* Ripple effect overlay */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 rounded-md bg-terminal-accent"
          initial={{ opacity: 0.3, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default ConversationOption;
