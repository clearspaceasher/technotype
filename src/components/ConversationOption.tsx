
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
  
  // Figure-8 animation pattern, mirrored for each option
  const figure8Motion = {
    x: isLeftOption 
      ? [0, 10, 15, 10, 0, -10, -15, -10, 0]
      : [0, -10, -15, -10, 0, 10, 15, 10, 0],
    y: [0, -5, 0, 5, 0, -5, 0, 5, 0]
  };

  return (
    <motion.button
      className={`px-4 py-2 border border-terminal-accent ${
        selected ? "bg-terminal-accent/30" : 
        isHovered ? "bg-terminal-accent/20" : "bg-transparent"
      } text-left transition-all duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } mt-2 w-full`}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      animate={isHovered || selected ? figure8Motion : {}}
      transition={{
        duration: 3,
        ease: "easeInOut",
        times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
        repeat: Infinity,
        repeatType: "loop"
      }}
    >
      <div className="flex items-center space-x-2">
        <span className="text-terminal-accent">&gt;</span>
        <div className="text-xl md:text-2xl text-terminal-light flex-1">
          {animateText ? (
            <AnimatedText 
              text={text} 
              speed={15}
              className="text-terminal-accent font-bold"
              bold={true}
              noWrap={true}
            />
          ) : (
            <span className="text-terminal-accent font-bold">{text}</span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default ConversationOption;
