import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";

interface ConversationalQuizProps {
  onComplete: (answers: string[]) => void;
}

const ConversationalQuiz: React.FC<ConversationalQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [questionComplete, setQuestionComplete] = useState(false);
  const [showingResponse, setShowingResponse] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{type: 'question' | 'answer', text: string}>>([]);
  const [isBumping, setIsBumping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Placeholder questions - will be replaced with AI integration later
  const questions = [
    "describe your relationship with notifications...",
    "when was the last time you felt truly disconnected?",
    "what does digital freedom mean to you?",
    "how do you define authentic online presence?",
    "what technology scares you the most?",
    "describe your ideal digital day...",
    "what would you do with unlimited screen time?",
    "how do you handle digital overwhelm?",
    "what's your relationship with social media?",
    "if technology disappeared tomorrow, how would you feel?"
  ];

  const currentQuestionText = currentQuestion < questions.length 
    ? `${'>'}  ${questions[currentQuestion]}` 
    : "";

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!questionComplete || showingResponse) return;
      
      if (e.key === "Enter") {
        if (currentInput.trim()) {
          // Trigger bump animation and snap back scale
          setIsBumping(true);
          setIsTyping(false);
          setTimeout(() => setIsBumping(false), 200);
          
          const newAnswers = [...answers, currentInput.trim()];
          setAnswers(newAnswers);
          
          // Add to conversation history
          setConversationHistory(prev => [
            ...prev,
            { type: 'question', text: questions[currentQuestion] },
            { type: 'answer', text: currentInput.trim() }
          ]);
          
          setShowingResponse(true);
          
          // Show response briefly, then move to next question
          setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(currentQuestion + 1);
              setCurrentInput("");
              setQuestionComplete(false);
              setShowingResponse(false);
            } else {
              // Quiz complete
              onComplete(newAnswers);
            }
          }, 1000);
        }
      } else if (e.key === "Backspace") {
        setCurrentInput(prev => {
          const newInput = prev.slice(0, -1);
          setIsTyping(newInput.length > 0);
          return newInput;
        });
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setCurrentInput(prev => prev + e.key);
        setIsTyping(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [questionComplete, showingResponse, currentInput, answers, currentQuestion, onComplete, questions.length]);

  return (
    <div className="min-h-screen bg-black text-terminal-light p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Terminal with outline */}
        <motion.div 
          className="border border-terminal-accent/50 rounded-lg p-6 bg-black/80"
          animate={isBumping ? { scale: [1, 1.02, 1] } : { scale: 1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {/* Terminal header */}
          <div className="flex items-center mb-6 pb-4 border-b border-terminal-accent/30">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="ml-4 text-terminal-accent/70 text-sm">open_sequence.exe</span>
          </div>
          
          {/* Conversation history */}
          <div className="space-y-2 mb-4">
            {conversationHistory.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`text-left ${entry.type === 'question' ? 'text-terminal-light' : 'text-terminal-accent/80'}`}
              >
                {entry.type === 'question' ? `> ${entry.text}` : `  ${entry.text}`}
              </motion.div>
            ))}
          </div>
          
          {/* Current question */}
          {currentQuestion < questions.length && (
            <motion.div 
              className="space-y-4"
              animate={{ 
                scale: isTyping ? 1.02 : 1 
              }}
              transition={{ 
                duration: 0.15, 
                ease: "easeOut" 
              }}
            >
              <AnimatedText
                text={currentQuestionText}
                speed={25}
                className="text-terminal-light text-left"
                onComplete={() => setQuestionComplete(true)}
              />
              
              {questionComplete && !showingResponse && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center text-left"
                >
                  <span className="text-terminal-light mr-2">{'>'}</span>
                  <span className="text-terminal-light">{currentInput}</span>
                  <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-pulse"></span>
                </motion.div>
              )}
              
              {showingResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-terminal-accent/60 text-left"
                >
                  <AnimatedText
                    text="  processing response..."
                    speed={20}
                    className="text-terminal-accent/60 text-left"
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ConversationalQuiz;
