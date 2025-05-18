
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
  
  // Even more aggressive figure-8 animation pattern, mirrored for each option
  const figure8Motion = {
    x: isLeftOption 
      ? [0, 20, 30, 20, 0, -20, -30, -20, 0]
      : [0, -20, -30, -20, 0, 20, 30, 20, 0],
    y: [0, -15, 0, 15, 0, -15, 0, 15, 0]
  };

  return (
    <motion.button
      className={`text-center transition-all duration-200 ${
        selected ? "text-terminal-accent text-glow" : 
        isHovered ? "text-terminal-accent text-glow" : "text-white"
      } ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } mt-4 w-full`}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      // Always animate, not just on hover
      animate={figure8Motion}
      transition={{
        duration: 2.2, // Even faster animation for more aggressive sway
        ease: "easeInOut",
        times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
        repeat: Infinity,
        repeatType: "loop"
      }}
    >
      <div className="flex items-center justify-center space-x-2">
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
      </div>
    </motion.button>
  );
};

export default ConversationOption;
