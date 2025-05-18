
import React, { useState, useEffect } from "react";
import Terminal from "./Terminal";
import ConversationOption from "./ConversationOption";
import AnimatedText from "./AnimatedText";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { motion } from "framer-motion";

// Digital wellbeing quiz questions - simplified to two options
const quizQuestions = [
  {
    id: "tech-morning",
    question: "First thing in the morning?",
    type: "this-or-that",
    options: [
      { id: "digital", text: "Check notifications" },
      { id: "analog", text: "Offline ritual" }
    ]
  },
  {
    id: "flow-state",
    question: "When deeply focused, notifications make you feel:",
    type: "this-or-that",
    options: [
      { id: "disrupted", text: "Disrupted" },
      { id: "connected", text: "Connected" }
    ]
  },
  {
    id: "digital-presence",
    question: "Your online identity is:",
    type: "this-or-that",
    options: [
      { id: "curated", text: "Carefully curated" },
      { id: "authentic", text: "Authentic mirror" }
    ]
  },
  {
    id: "tech-breaks",
    question: "Ideal break from screens:",
    type: "this-or-that",
    options: [
      { id: "nature", text: "Nature immersion" },
      { id: "social", text: "Social interaction" }
    ]
  },
  {
    id: "notification-feeling",
    question: "Notification sounds make you:",
    type: "slider",
    min: 0,
    max: 100,
    step: 1,
    labels: ["Anxious", "Excited"]
  },
  {
    id: "tech-balance",
    question: "Your relationship with technology:",
    type: "this-or-that",
    options: [
      { id: "tool", text: "It's a tool" },
      { id: "extension", text: "It's an extension of me" }
    ]
  },
  {
    id: "unplug-feelings",
    question: "Being unreachable makes you feel:",
    type: "this-or-that",
    options: [
      { id: "free", text: "Liberated" },
      { id: "anxious", text: "Anxious" }
    ]
  },
  {
    id: "content-preference",
    question: "You prefer content that is:",
    type: "this-or-that",
    options: [
      { id: "mindful", text: "Thought-provoking" },
      { id: "escape", text: "Escapist" }
    ]
  },
  {
    id: "tech-innovation",
    question: "New tech makes you feel:",
    type: "slider",
    min: 0,
    max: 100,
    step: 1,
    labels: ["Skeptical", "Excited"]
  },
  {
    id: "digital-future",
    question: "The increasingly digital future is:",
    type: "this-or-that",
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
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (currentQuestion < quizQuestions.length) {
      setSelectedOption(null);
      setSliderValue(50);
      setIsTyping(false); // Remove typing delay
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

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
  };

  const handleSliderComplete = () => {
    const questionId = quizQuestions[currentQuestion].id;
    setAnswers({ ...answers, [questionId]: sliderValue });

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }} // Faster transition for smoother feel
        className="mb-8"
      >
        <h2 className="text-terminal-light text-2xl md:text-3xl mb-6">
          <AnimatedText
            text={question.question}
            speed={20} // Faster typing speed
            className="text-terminal-light"
          />
        </h2>

        {question.type === "this-or-that" && (
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {question.options.map((option) => (
              <motion.div 
                key={option.id}
                className="flex-1"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ConversationOption
                  key={option.id}
                  text={option.text}
                  onClick={() => handleOptionSelect(option.id)}
                  selected={selectedOption === option.id}
                />
              </motion.div>
            ))}
          </div>
        )}

        {question.type === "slider" && (
          <div className="my-8">
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
          Thank you for exploring your relationship with technology.
        </p>
        <p className="text-terminal-light text-lg mb-12">
          Your digital wellbeing profile is being synthesized...
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
    <Terminal>
      <div className="px-4 py-6 md:p-8">
        {!isFinished ? (
          <>
            <div className="flex justify-center mb-8">
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
