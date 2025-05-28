

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";

interface ConversationalQuizProps {
  onComplete: (answers: string[], userInfo: {name: string, gender: string, age: string}) => void;
}

const ConversationalQuiz: React.FC<ConversationalQuizProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'userInfo' | 'questions'>('userInfo');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [questionComplete, setQuestionComplete] = useState(false);
  const [showingResponse, setShowingResponse] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{type: 'question' | 'answer', text: string}>>([]);
  const [isBumping, setIsBumping] = useState(false);
  
  // User info collection
  const [userInfo, setUserInfo] = useState({name: '', gender: '', age: ''});
  const [currentUserInfoField, setCurrentUserInfoField] = useState(0);
  
  const userInfoQuestions = [
    "what's your name?",
    "what's your gender?",
    "what's your age?"
  ];
  
  const userInfoFields = ['name', 'gender', 'age'] as const;

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

  const getCurrentQuestionText = () => {
    if (phase === 'userInfo') {
      return currentUserInfoField < userInfoQuestions.length 
        ? `${'>'}  ${userInfoQuestions[currentUserInfoField]}` 
        : "";
    } else {
      return currentQuestion < questions.length 
        ? `${'>'}  ${questions[currentQuestion]}` 
        : "";
    }
  };

  // Calculate scale based on input length - small increments of 0.005 per character
  const currentScale = 1 + (currentInput.length * 0.005);
  
  // Calculate inverse zoom for the page - as text gets bigger, page zooms out
  const pageZoom = 1 / currentScale;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!questionComplete || showingResponse) return;
      
      if (e.key === "Enter") {
        if (currentInput.trim()) {
          // Trigger bump animation and snap back scale
          setIsBumping(true);
          setTimeout(() => setIsBumping(false), 200);
          
          if (phase === 'userInfo') {
            // Handle user info collection
            const field = userInfoFields[currentUserInfoField];
            const newUserInfo = { ...userInfo, [field]: currentInput.trim() };
            setUserInfo(newUserInfo);
            
            // Add to conversation history
            setConversationHistory(prev => [
              ...prev,
              { type: 'question', text: userInfoQuestions[currentUserInfoField] },
              { type: 'answer', text: currentInput.trim() }
            ]);
            
            // Reset input immediately to snap scale back to 1
            setCurrentInput("");
            setShowingResponse(true);
            
            // Move to next user info field or start questions
            setTimeout(() => {
              if (currentUserInfoField < userInfoQuestions.length - 1) {
                setCurrentUserInfoField(currentUserInfoField + 1);
                setQuestionComplete(false);
                setShowingResponse(false);
              } else {
                // Start quiz questions
                setPhase('questions');
                setQuestionComplete(false);
                setShowingResponse(false);
              }
            }, 1000);
          } else {
            // Handle quiz questions
            const newAnswers = [...answers, currentInput.trim()];
            setAnswers(newAnswers);
            
            // Add to conversation history
            setConversationHistory(prev => [
              ...prev,
              { type: 'question', text: questions[currentQuestion] },
              { type: 'answer', text: currentInput.trim() }
            ]);
            
            // Reset input immediately to snap scale back to 1
            setCurrentInput("");
            setShowingResponse(true);
            
            // Show response briefly, then move to next question
            setTimeout(() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setQuestionComplete(false);
                setShowingResponse(false);
              } else {
                // Quiz complete
                onComplete(newAnswers, userInfo);
              }
            }, 1000);
          }
        }
      } else if (e.key === "Backspace") {
        setCurrentInput(prev => {
          const newInput = prev.slice(0, -1);
          return newInput;
        });
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setCurrentInput(prev => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [questionComplete, showingResponse, currentInput, answers, currentQuestion, currentUserInfoField, phase, userInfo, onComplete, questions.length, userInfoQuestions.length]);

  return (
    <motion.div 
      className="min-h-screen bg-black text-terminal-light p-8 font-mono"
      animate={{ 
        scale: pageZoom
      }}
      transition={{ 
        duration: 0.1, 
        ease: "easeOut" 
      }}
    >
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
                className={`text-left break-words ${entry.type === 'question' ? 'text-terminal-light' : 'text-terminal-accent/80'}`}
              >
                {entry.type === 'question' ? `> ${entry.text}` : `  ${entry.text}`}
              </motion.div>
            ))}
          </div>
          
          {/* Current question or processing state */}
          {showingResponse ? (
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
          ) : (
            <motion.div 
              className="space-y-4"
              animate={{ 
                scale: currentScale
              }}
              transition={{ 
                duration: 0.1, 
                ease: "easeOut" 
              }}
            >
              <AnimatedText
                text={getCurrentQuestionText()}
                speed={25}
                className="text-terminal-light text-left break-words"
                onComplete={() => setQuestionComplete(true)}
              />
              
              {questionComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start text-left"
                >
                  <span className="text-terminal-light mr-2 flex-shrink-0">{'>'}</span>
                  <div className="flex-1">
                    <span className="text-terminal-light break-words">{currentInput}</span>
                    <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-pulse"></span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConversationalQuiz;

