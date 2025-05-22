import React, { useState, useEffect } from "react";
import Terminal from "./Terminal";
import ConversationOption from "./ConversationOption";
import AnimatedText from "./AnimatedText";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import PixelIcon from "./PixelIcon";
import ArchetypeReveal from "./ArchetypeReveal";
import { generateArchetypeAndDescription } from "@/services/openai";

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

// Archetypes based on quiz responses
const archetypes = [
  { id: "optimizer", name: "The Optimizer", color: "#4ADE80" },
  { id: "skeptic", name: "The Skeptic", color: "#F43F5E" },
  { id: "seeker", name: "The Seeker", color: "#9b87f5" },
  { id: "unplugger", name: "The Unplugger", color: "#0FA0CE" }
];

const ConversationEngine: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [iconClicked, setIconClicked] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const [userArchetype, setUserArchetype] = useState<string>("optimizer");
  const [archetypeDescription, setArchetypeDescription] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleOptionSelect = async (option: string) => {
    const questionId = quizQuestions[currentQuestion].id;
    setAnswers({ ...answers, [questionId]: option });
    setSelectedOption(option);

    // Move to next question with minimal delay
    setTimeout(async () => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsGenerating(true);
        try {
          // Convert answers to the format expected by the OpenAI service
          const quizAnswers = Object.entries(answers).map(([id, answer]) => ({
            id,
            answer: answer as string
          }));

          // Generate archetype and description
          const { archetype, description } = await generateArchetypeAndDescription(quizAnswers);
          
          // Find the matching archetype data
          const matchingArchetype = archetypes.find(a => a.name.toLowerCase() === archetype.toLowerCase()) || archetypes[0];
          
          setUserArchetype(matchingArchetype.id);
          setArchetypeDescription(description);
        } catch (error) {
          console.error('Error generating archetype:', error);
          // Fallback to default archetype
          setUserArchetype("optimizer");
          setArchetypeDescription("Your digital identity has been revealed.");
        } finally {
          setIsGenerating(false);
          setIsFinished(true);
        }
      }
    }, 300);
  };

  const handleIconClick = () => {
    // Track number of clicks
    setIconClicked(iconClicked + 1);
    
    // If double click, show archetype reveal
    if (iconClicked === 1) {
      setShowReveal(true);
      // Reset click counter
      setIconClicked(0);
    }
    
    // Reset counter after a delay if not double clicked
    setTimeout(() => {
      if (iconClicked > 0) {
        setIconClicked(0);
      }
    }, 500);
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
        <h2 className="text-terminal-light text-2xl md:text-3xl mb-12">
          <AnimatedText
            text={question.question}
            speed={20}
            className="text-terminal-light"
          />
        </h2>

        {optionsVisible && (
          <div className="flex flex-col md:flex-row gap-16 justify-center">
            {question.options.map((option, index) => (
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
                  isLeftOption={index === 0} // Left option for first, right for second
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
        <h2 className="text-terminal-accent text-3xl md:text-4xl mb-12 text-glow">
          <AnimatedText
            text="DIGITAL EXPLORATION COMPLETE"
            speed={30}
            className="text-terminal-accent font-bold"
            bold={true}
          />
        </h2>
        
        {/* Retro Desktop Icon */}
        {!showReveal && (
          <motion.div 
            className="flex justify-center items-center py-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <PixelIcon onClick={handleIconClick} clickCount={iconClicked} />
          </motion.div>
        )}
        
        {/* Archetype Reveal Animation */}
        {showReveal && (
          <ArchetypeReveal 
            archetype={userArchetype}
            archetypeData={archetypes.find(a => a.id === userArchetype) || archetypes[0]}
            description={archetypeDescription}
            isLoading={isGenerating}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="px-4 py-6 md:p-8 min-h-screen bg-black text-terminal-light flex flex-col">
      {!isFinished ? (
        <>
          <div className="flex justify-center mb-8 mt-4">
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
          
          {/* Remove flex-grow completely to position content at the top */}
          
          <div className="flex justify-center items-center mt-8">
            {renderQuestion()}
          </div>
          
          {/* Add more flex-grow at the bottom to push everything up */}
          <div className="flex-grow flex-grow-[3]"></div>
        </>
      ) : (
        renderResults()
      )}
    </div>
  );
};

export default ConversationEngine;
