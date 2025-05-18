
import React, { useState, useEffect, useRef } from "react";

interface AnimatedTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  delay?: number;
  singleLine?: boolean; // New prop to enable single line mode
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  speed = 25,
  className = "",
  onComplete,
  delay = 0,
  singleLine = false, // Default to false for backward compatibility
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [fontSize, setFontSize] = useState(20); // Default font size in vh
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Reset state when text prop changes
    setDisplayedText("");
    setCurrentIndex(0);
    setIsTyping(false);
    setFontSize(20); // Reset font size
  }, [text]);

  // Dynamic font sizing effect - now responds to each character addition
  useEffect(() => {
    if (!singleLine || !containerRef.current || !textRef.current) return;
    
    // Calculate and adjust font size to fit container width
    const adjustFontSize = () => {
      if (!containerRef.current || !textRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const textWidth = textRef.current.scrollWidth;
      
      if (textWidth > containerWidth) {
        const ratio = containerWidth / textWidth * 0.95; // Use 95% of the ratio for a bit of margin
        setFontSize(current => Math.max(current * ratio, 3)); // Ensure minimum size
      }
    };

    // Run font adjustment after each character is added
    adjustFontSize();
    
    // Also set up a resize observer for container size changes
    const resizeObserver = new ResizeObserver(adjustFontSize);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) resizeObserver.disconnect();
    };
  }, [displayedText, singleLine]);

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

  const dynamicStyle = singleLine ? { fontSize: `${fontSize}vh`, whiteSpace: 'nowrap' } : {};

  return (
    <div className={className} ref={containerRef} style={{ overflow: 'hidden', width: '100%' }}>
      <span ref={textRef} style={dynamicStyle}>{displayedText}</span>
      {isTyping && <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-cursor-blink"></span>}
    </div>
  );
};

export default AnimatedText;
