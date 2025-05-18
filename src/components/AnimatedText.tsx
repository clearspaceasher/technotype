
import React, { useState, useEffect } from "react";

interface AnimatedTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  delay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  speed = 50, // Default to slower typing speed
  className = "",
  onComplete,
  delay = 200, // Added slightly longer default delay
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
      // Animation complete - ensure callback is called
      timeout = setTimeout(() => {
        console.log("Animation complete, calling onComplete");
        if (onComplete) onComplete();
      }, 300); // Added pause after typing finishes
      
      setIsTyping(false);
      return () => clearTimeout(timeout);
    }
  }, [text, speed, currentIndex, isTyping, onComplete, delay]);

  return (
    <div className={className}>
      <span>{displayedText}</span>
      {isTyping && <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-cursor-blink"></span>}
    </div>
  );
};

export default AnimatedText;
