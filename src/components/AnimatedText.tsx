
import React, { useState, useEffect } from "react";

interface AnimatedTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  delay?: number;
  bold?: boolean;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  speed = 25,
  className = "",
  onComplete,
  delay = 0,
  bold = false,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    // Reset state when text prop changes
    setDisplayedText("");
    setCurrentIndex(0);
    setIsTyping(false);
  }, [text]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Initial delay before starting to type
    if (!isTyping && currentIndex === 0) {
      timeout = setTimeout(() => {
        setIsTyping(true);
      }, delay);
      return () => clearTimeout(timeout);
    }

    // Start typing process
    if (isTyping && currentIndex < text.length) {
      timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (isTyping && currentIndex === text.length) {
      // Animation complete
      setIsTyping(false);
      if (onComplete) onComplete();
    }
  }, [text, speed, currentIndex, isTyping, onComplete, delay]);

  const fontClassNames = bold ? "font-bold" : "";

  return (
    <div className={`${className} ${fontClassNames} break-words whitespace-normal w-full text-center mx-auto`}>
      <span>{displayedText}</span>
      {isTyping && <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-cursor-blink"></span>}
    </div>
  );
};

export default AnimatedText;
