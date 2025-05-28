
import React, { useState, useEffect } from "react";
import { useSound } from "../hooks/useSound";

interface AnimatedTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  delay?: number;
  bold?: boolean;
  noWrap?: boolean;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  speed = 25,
  className = "",
  onComplete,
  delay = 0,
  bold = false,
  noWrap = false,
}) => {
  console.log("AnimatedText rendering with text:", text);
  
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const { playSound, stopSound } = useSound();
  
  useEffect(() => {
    console.log("AnimatedText: text changed, resetting state");
    // Reset state when text prop changes
    setDisplayedText("");
    setCurrentIndex(0);
    setIsTyping(false);
    if (stopSound) {
      stopSound('typing');
    }
  }, [text, stopSound]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Initial delay before starting to type
    if (!isTyping && currentIndex === 0) {
      timeout = setTimeout(() => {
        console.log("AnimatedText: starting typing animation");
        setIsTyping(true);
        // Start typing sound loop
        if (playSound) {
          playSound('typing', { loop: true, volume: 0.2 });
        }
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
      console.log("AnimatedText: animation complete");
      setIsTyping(false);
      if (stopSound) {
        stopSound('typing');
      }
      if (onComplete) onComplete();
    }
  }, [text, speed, currentIndex, isTyping, onComplete, delay, playSound, stopSound]);

  const fontClassNames = bold ? "font-bold" : "";
  const wrapClassNames = noWrap ? "whitespace-nowrap" : "break-words whitespace-pre-wrap";

  return (
    <div className={`${className} ${fontClassNames} ${wrapClassNames} w-full`}>
      <span>{displayedText}</span>
      {isTyping && <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-pulse"></span>}
    </div>
  );
};

export default AnimatedText;
