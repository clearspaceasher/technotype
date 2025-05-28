
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
    ? `> ${questions[currentQuestion]}` 
    : "";

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!questionComplete || showingResponse) return;
      
      if (e.key === "Enter") {
        if (currentInput.trim()) {
          const newAnswers = [...answers, currentInput.trim()];
          setAnswers(newAnswers);
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
          }, 1500);
        }
      } else if (e.key === "Backspace") {
        setCurrentInput(prev => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        setCurrentInput(prev => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [questionComplete, showingResponse, currentInput, answers, currentQuestion, onComplete, questions.length]);

  return (
    <div className="min-h-screen bg-black text-terminal-light p-8 font-mono">
      <div className="max-w-2xl mx-auto">
        {/* Terminal header */}
        <div className="flex items-center mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="text-terminal-accent text-sm mb-2">
            question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="w-full bg-gray-800 h-1 rounded">
            <div 
              className="bg-terminal-accent h-1 rounded transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Question and input area */}
        <div className="space-y-4">
          {currentQuestion < questions.length && (
            <>
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
                  className="flex items-center mt-4"
                >
                  <span className="text-terminal-light mr-2">></span>
                  <span className="text-terminal-light">{currentInput}</span>
                  <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-pulse"></span>
                </motion.div>
              )}
              
              {showingResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-terminal-accent mt-4"
                >
                  <AnimatedText
                    text="response recorded. processing..."
                    speed={20}
                    className="text-terminal-accent"
                  />
                </motion.div>
              )}
            </>
          )}
        </div>
        
        {/* Show previous answers */}
        {answers.length > 0 && (
          <div className="mt-8 pt-4 border-t border-terminal-accent/30">
            <div className="text-terminal-accent/60 text-sm mb-2">previous responses:</div>
            {answers.slice(-3).map((answer, idx) => (
              <div key={idx} className="text-terminal-light/60 text-sm mb-1">
                {idx + answers.length - 2}: {answer.substring(0, 50)}...
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationalQuiz;
