
import React, { useState } from "react";

interface ConversationOptionProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const ConversationOption: React.FC<ConversationOptionProps> = ({ 
  text,
  onClick,
  disabled = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`px-4 py-2 border border-terminal-accent ${
        isHovered ? "bg-terminal-accent/20" : "bg-transparent"
      } text-left transition-all duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } mt-2 w-full`}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
    >
      <div className="flex items-center space-x-2">
        <span className="text-terminal-accent">&gt;</span>
        <span>{text}</span>
      </div>
    </button>
  );
};

export default ConversationOption;
