
import React, { useState, useEffect } from "react";
import Terminal from "./Terminal";
import ConversationOption from "./ConversationOption";
import AnimatedText from "./AnimatedText";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { motion } from "framer-motion";

// Digital wellbeing quiz questions
const quizQuestions = [
  {
    id: "morning-routine",
    question: "First thing you reach for in the morning?",
    type: "multiple-choice",
    options: [
      { id: "phone", text: "Phone" },
      { id: "coffee", text: "Coffee" },
      { id: "stretch", text: "Stretch" },
      { id: "journal", text: "Journal" }
    ]
  },
  {
    id: "notification-feeling",
    question: "When your phone buzzes with notifications, you feel:",
    type: "slider",
    min: 0,
    max: 100,
    step: 1,
    labels: ["Anxious", "Curious", "Excited"]
  },
  {
    id: "digital-break",
    question: "Your ideal digital break is:",
    type: "multiple-choice",
    options: [
      { id: "nature", text: "Nature escape" },
      { id: "social", text: "In-person socializing" },
      { id: "analog-hobby", text: "Analog hobby" },
      { id: "different-screen", text: "Different screen activity" }
    ]
  },
  {
    id: "missed-notifications",
    question: "Missing notifications makes you feel:",
    type: "multiple-choice",
    options: [
      { id: "relieved", text: "Relieved" },
      { id: "anxious", text: "Anxious" },
      { id: "indifferent", text: "Indifferent" }
    ]
  },
  {
    id: "tech-balance",
    question: "Your tech-life balance feels:",
    type: "slider",
    min: 0,
    max: 100,
    step: 1,
    labels: ["Out of control", "Manageable", "Perfect"]
  },
  {
    id: "digital-consumption",
    question: "You prefer digital content that is:",
    type: "multiple-choice",
    options: [
      { id: "educational", text: "Educational" },
      { id: "entertaining", text: "Entertaining" },
      { id: "mindless", text: "Mindless escape" },
      { id: "creative", text: "Creative inspiration" }
    ]
  },
  {
    id: "screen-time",
    question: "Your ideal daily screen time:",
    type: "slider",
    min: 0,
    max: 100,
    step: 1,
    labels: ["Minimal", "Moderate", "Unlimited"]
  },
  {
    id: "social-validation",
    question: "Online social validation feels:",
    type: "this-or-that",
    options: [
      { id: "meaningful", text: "Meaningful" },
      { id: "empty", text: "Empty" }
    ]
  },
  {
    id: "tech-attitude",
    question: "Technology primarily makes your life:",
    type: "this-or-that",
    options: [
      { id: "better", text: "Better" },
      { id: "complicated", text: "Complicated" }
    ]
  },
  {
    id: "final-question",
    question: "Your digital self is:",
    type: "multiple-choice",
    options: [
      { id: "authentic", text: "Authentic me" },
      { id: "curated", text: "Curated version" },
      { id: "separate", text: "Separate entity" },
      { id: "extension", text: "Natural extension" }
    ]
  }
];

const ConversationEngine: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (currentQuestion < quizQuestions.length) {
      setSelectedOption(null);
      setSliderValue(50);
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion]);

  const handleOptionSelect = (option: string) => {
    const questionId = quizQuestions[currentQuestion].id;
    setAnswers({ ...answers, [questionId]: option });
    setSelectedOption(option);

    // Add delay before moving to next question
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsFinished(true);
      }
    }, 800);
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
  };

  const handleSliderComplete = () => {
    const questionId = quizQuestions[currentQuestion].id;
    setAnswers({ ...answers, [questionId]: sliderValue });

    // Add delay before moving to next question
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsFinished(true);
      }
    }, 800);
  };

  const handleThisOrThat = (option: string) => {
    handleOptionSelect(option);
  };

  const renderQuestion = () => {
    if (currentQuestion >= quizQuestions.length) return null;
    
    const question = quizQuestions[currentQuestion];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-terminal-light text-2xl md:text-3xl mb-6">
          <AnimatedText
            text={question.question}
            speed={30}
            className="text-terminal-light"
          />
        </h2>

        {question.type === "multiple-choice" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option) => (
              <ConversationOption
                key={option.id}
                text={option.text}
                onClick={() => handleOptionSelect(option.id)}
                selected={selectedOption === option.id}
              />
            ))}
          </div>
        )}

        {question.type === "slider" && (
          <div className="my-12">
            <div className="flex justify-between mb-2 text-terminal-light opacity-80">
              {question.labels.map((label, index) => {
                const position = index / (question.labels.length - 1) * 100;
                return (
                  <span key={index} style={{ position: 'relative', left: `${position}%`, transform: 'translateX(-50%)' }}>
                    {label}
                  </span>
                );
              })}
            </div>
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              value={[sliderValue]}
              onValueChange={handleSliderChange}
              onValueCommit={handleSliderComplete}
              className="my-6"
            />
            <Button
              onClick={handleSliderComplete}
              className="mt-4 bg-terminal-accent text-black hover:bg-terminal-accent/80"
            >
              Continue
            </Button>
          </div>
        )}

        {question.type === "this-or-that" && (
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {question.options.map((option) => (
              <motion.div 
                key={option.id}
                className="flex-1"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <button
                  onClick={() => handleThisOrThat(option.id)}
                  className={`w-full p-6 md:p-8 rounded-lg border-2 ${
                    selectedOption === option.id 
                      ? "border-terminal-accent bg-terminal-dark/50" 
                      : "border-terminal-light/30 hover:border-terminal-light/50"
                  } transition-all`}
                >
                  <span className="text-2xl text-terminal-light">{option.text}</span>
                </button>
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
            speed={30}
            className="text-terminal-accent"
          />
        </h2>
        <p className="text-terminal-light text-lg mb-8">
          Thank you for exploring your relationship with technology.
        </p>
        <p className="text-terminal-light text-lg mb-12">
          Your digital wellbeing profile is being synthesized...
        </p>
        {/* This would connect to a results page in a full implementation */}
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
    <Terminal>
      <div className="px-4 py-6 md:p-8">
        {!isFinished ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <span className="text-terminal-light">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: quizQuestions.length }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-4 rounded-full ${
                      i <= currentQuestion ? "bg-terminal-accent" : "bg-gray-600"
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
    </Terminal>
  );
};

export default ConversationEngine;
