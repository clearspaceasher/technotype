
import React, { useState, useEffect } from "react";
import Terminal from "./Terminal";
import ConversationOption from "./ConversationOption";
import AnimatedText from "./AnimatedText";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

// Digital wellbeing quiz questions - all "this-or-that" type only
const quizQuestions = [
  {
    id: "tech-morning",
    question: "First thing in the morning?",
    options: [
      { id: "digital", text: "Check notifications" },
      { id: "analog", text: "Offline ritual" }
    ]
  },
  {
    id: "flow-state",
    question: "When deeply focused, notifications make you feel:",
    options: [
      { id: "disrupted", text: "Disrupted" },
      { id: "connected", text: "Connected" }
    ]
  },
  {
    id: "digital-presence",
    question: "Your online identity is:",
    options: [
      { id: "curated", text: "Carefully curated" },
      { id: "authentic", text: "Authentic mirror" }
    ]
  },
  {
    id: "tech-breaks",
    question: "Ideal break from screens:",
    options: [
      { id: "nature", text: "Nature immersion" },
      { id: "social", text: "Social interaction" }
    ]
  },
  {
    id: "tech-balance",
    question: "Your relationship with technology:",
    options: [
      { id: "tool", text: "It's a tool" },
      { id: "extension", text: "It's an extension of me" }
    ]
  },
  {
    id: "unplug-feelings",
    question: "Being unreachable makes you feel:",
    options: [
      { id: "free", text: "Liberated" },
      { id: "anxious", text: "Anxious" }
    ]
  },
  {
    id: "content-preference",
    question: "You prefer content that is:",
    options: [
      { id: "mindful", text: "Thought-provoking" },
      { id: "escape", text: "Escapist" }
    ]
  },
  {
    id: "digital-future",
    question: "The increasingly digital future is:",
    options: [
      { id: "promising", text: "Full of promise" },
      { id: "concerning", text: "Concerning" }
    ]
  }
];

const ConversationEngine: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);

  useEffect(() => {
    if (currentQuestion < quizQuestions.length) {
      setSelectedOption(null);
      setOptionsVisible(false);
      setIsTyping(true);
      
      // Show options after question finishes typing
      const timer = setTimeout(() => {
        setOptionsVisible(true);
        setIsTyping(false);
      }, quizQuestions[currentQuestion].question.length * 20 + 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestion]);

  const handleOptionSelect = (option: string) => {
    const questionId = quizQuestions[currentQuestion].id;
    setAnswers({ ...answers, [questionId]: option });
    setSelectedOption(option);

    // Move to next question with minimal delay
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsFinished(true);
      }
    }, 300); // Reduced delay for smoother experience
  };

  const renderQuestion = () => {
    if (currentQuestion >= quizQuestions.length) return null;
    
    const question = quizQuestions[currentQuestion];
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-terminal-light text-2xl md:text-3xl mb-6">
          <AnimatedText
            text={question.question}
            speed={20}
            className="text-terminal-light"
          />
        </h2>

        {optionsVisible && (
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {question.options.map((option) => (
              <motion.div 
                key={option.id}
                className="flex-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ConversationOption
                  key={option.id}
                  text={option.text}
                  onClick={() => handleOptionSelect(option.id)}
                  selected={selectedOption === option.id}
                  animateText={true}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  const renderResults = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-terminal-light text-3xl mb-6">
          <AnimatedText
            text="Digital Self Exploration Complete"
            speed={20}
            className="text-terminal-accent"
          />
        </h2>
        <p className="text-terminal-light text-lg mb-8">
          <AnimatedText
            text="Thank you for exploring your relationship with technology."
            speed={20}
            delay={800}
            className="text-terminal-light"
          />
        </p>
        <p className="text-terminal-light text-lg mb-12">
          <AnimatedText
            text="Your digital wellbeing profile is being synthesized..."
            speed={20}
            delay={1600}
            className="text-terminal-light"
          />
        </p>
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-terminal-accent text-black hover:bg-terminal-accent/80"
        >
          Return Home
        </Button>
      </motion.div>
    );
  };

  return (
    <div className="px-4 py-6 md:p-8 min-h-screen bg-black text-terminal-light">
      {!isFinished ? (
        <>
          <div className="flex justify-center mb-8">
            <div className="flex gap-1 max-w-md w-full">
              {Array.from({ length: quizQuestions.length }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i <= currentQuestion ? "bg-terminal-accent" : "bg-gray-800"
                  }`}
                />
              ))}
            </div>
          </div>
          {renderQuestion()}
        </>
      ) : (
        renderResults()
      )}
    </div>
  );
};

export default ConversationEngine;
