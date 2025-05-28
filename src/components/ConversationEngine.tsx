import React, { useState, useEffect } from "react";
import Terminal from "./Terminal";
import ConversationOption from "./ConversationOption";
import AnimatedText from "./AnimatedText";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import PixelIcon from "./PixelIcon";
import ArchetypeReveal from "./ArchetypeReveal";
import PathSelector from "./PathSelector";
import ConversationalQuiz from "./ConversationalQuiz";

interface UserInfo {
  name: string;
  age: string;
  gender: string;
}

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
  const [phase, setPhase] = useState<'path-selection' | 'guided-transition' | 'open-transition' | 'guided-quiz' | 'open-conversation' | 'results'>('path-selection');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [conversationalAnswers, setConversationalAnswers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [iconClicked, setIconClicked] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const [userArchetype, setUserArchetype] = useState<string>("optimizer");
  const [isZooming, setIsZooming] = useState(false);

  const handlePathSelection = (path: 1 | 2, userInfo: UserInfo) => {
    setUserInfo(userInfo);
    if (path === 1) {
      setPhase('guided-transition');
      // Start zoom animation before transitioning to guided quiz
      setTimeout(() => {
        setIsZooming(true);
        setTimeout(() => {
          setPhase('guided-quiz');
          setIsZooming(false);
        }, 1000);
      }, 5000); // Increased from 3000ms to 5000ms for longer animation
    } else {
      setPhase('open-transition');
      // Start zoom animation before transitioning to open conversation
      setTimeout(() => {
        setIsZooming(true);
        setTimeout(() => {
          setPhase('open-conversation');
          setIsZooming(false);
        }, 1000);
      }, 4500); // Increased from 2500ms to 4500ms for longer animation
    }
  };

  const handleConversationalComplete = (answers: string[]) => {
    setConversationalAnswers(answers);
    // For now, just set a default archetype
    setUserArchetype("seeker");
    setPhase('results');
    setIsFinished(true);
  };

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
        // Calculate user archetype based on answers
        const archetype = calculateArchetype(answers);
        setUserArchetype(archetype);
        setIsFinished(true);
      }
    }, 300); // Reduced delay for smoother experience
  };

  // Simple algorithm to determine archetype based on answers
  const calculateArchetype = (answers: Record<string, string>) => {
    let scores = {
      optimizer: 0,
      skeptic: 0,
      seeker: 0,
      unplugger: 0
    };
    
    // Score based on specific answer patterns
    if (answers["tech-morning"] === "digital") scores.optimizer += 1;
    if (answers["tech-morning"] === "analog") scores.unplugger += 1;
    
    if (answers["flow-state"] === "disrupted") scores.skeptic += 1;
    if (answers["flow-state"] === "connected") scores.optimizer += 1;
    
    if (answers["digital-presence"] === "curated") scores.optimizer += 1;
    if (answers["digital-presence"] === "authentic") scores.seeker += 1;
    
    if (answers["tech-breaks"] === "nature") scores.unplugger += 1;
    if (answers["tech-breaks"] === "social") scores.seeker += 1;
    
    if (answers["tech-balance"] === "tool") scores.skeptic += 1;
    if (answers["tech-balance"] === "extension") scores.optimizer += 1;
    
    if (answers["unplug-feelings"] === "free") scores.unplugger += 1;
    if (answers["unplug-feelings"] === "anxious") scores.optimizer += 1;
    
    if (answers["content-preference"] === "mindful") scores.seeker += 1;
    if (answers["content-preference"] === "escape") scores.optimizer += 1;
    
    if (answers["digital-future"] === "promising") scores.optimizer += 1;
    if (answers["digital-future"] === "concerning") scores.skeptic += 1;
    
    // Find highest score
    let maxScore = 0;
    let maxArchetype = "optimizer";
    
    Object.entries(scores).forEach(([archetype, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxArchetype = archetype;
      }
    });
    
    return maxArchetype;
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
          />
        )}
      </motion.div>
    );
  };

  // Guided Protocol Transition Animation
  const renderGuidedTransition = () => {
    return (
      <motion.div 
        className="min-h-screen bg-black text-terminal-light p-8 font-mono flex items-center justify-center"
        initial={{ opacity: 1, scale: 1 }}
        animate={isZooming ? { scale: 20, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ 
          duration: isZooming ? 1 : 0.5,
          ease: "easeInOut" 
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-terminal-accent text-4xl mb-8"
            >
              INITIALIZING GUIDED PROTOCOL
            </motion.div>
            
            <motion.div className="space-y-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, delay: 0.8 }}
                className="h-1 bg-terminal-accent mx-auto max-w-md"
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 3, delay: 1.5, repeat: Infinity }}
                className="text-terminal-light"
              >
                <AnimatedText
                  text="scanning digital behavior patterns..."
                  speed={40}
                  className="text-terminal-light"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5 }}
                className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-8"
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ 
                      duration: 1.2,
                      delay: i * 0.15,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="w-4 h-4 border border-terminal-accent"
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // Open Sequence Transition Animation
  const renderOpenTransition = () => {
    return (
      <motion.div 
        className="min-h-screen bg-black text-terminal-light p-8 font-mono flex items-center justify-center"
        initial={{ opacity: 1, scale: 1 }}
        animate={isZooming ? { scale: 20, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ 
          duration: isZooming ? 1 : 0.5,
          ease: "easeInOut" 
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-terminal-accent text-4xl mb-8"
            >
              ENTERING OPEN SEQUENCE
            </motion.div>
            
            <motion.div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-terminal-light text-left max-w-2xl mx-auto"
              >
                <AnimatedText
                  text="> no predetermined paths detected"
                  speed={35}
                  className="text-terminal-light mb-2"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                >
                  <AnimatedText
                    text="> adaptive conversation module: ACTIVE"
                    speed={35}
                    className="text-terminal-accent mb-2"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4.2 }}
                >
                  <AnimatedText
                    text="> preparing dynamic interface..."
                    speed={35}
                    className="text-terminal-light/70"
                  />
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.8, duration: 0.8 }}
                className="flex justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-terminal-accent border-t-transparent rounded-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // Render based on current phase
  if (phase === 'path-selection') {
    return <PathSelector onPathSelected={handlePathSelection} />;
  }

  if (phase === 'guided-transition') {
    return renderGuidedTransition();
  }

  if (phase === 'open-transition') {
    return renderOpenTransition();
  }

  if (phase === 'open-conversation') {
    return <ConversationalQuiz onComplete={handleConversationalComplete} />;
  }

  if (phase === 'results') {
    return (
      <div className="px-4 py-6 md:p-8 min-h-screen bg-black text-terminal-light flex flex-col">
        {renderResults()}
      </div>
    );
  }

  // Original guided quiz flow (phase === 'guided-quiz')
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
          
          <div className="flex justify-center items-center mt-8">
            {renderQuestion()}
          </div>
          
          <div className="flex-grow flex-grow-[3]"></div>
        </>
      ) : (
        renderResults()
      )}
    </div>
  );
};

export default ConversationEngine;
