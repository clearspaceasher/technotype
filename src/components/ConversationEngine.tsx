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
import { generateTechnotypeFromQuiz, QuizAnswer } from "@/lib/openai";

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

// Add a default set of technotype attributes and real-life changes for the skill tree
const defaultAttributes = [
  { id: 1, label: "No screens before bed", description: "Wind down without digital devices for better sleep." },
  { id: 2, label: "Mindful notifications", description: "Limit notifications to reduce distractions." },
  { id: 3, label: "Tech-free meals", description: "Keep meals device-free to foster presence." },
  { id: 4, label: "Scheduled breaks", description: "Take regular breaks from screens to recharge." },
  { id: 5, label: "Curated content", description: "Consume content that aligns with your values." },
  { id: 6, label: "Intentional social", description: "Prioritize meaningful digital interactions." },
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
  const [technotypeDescription, setTechnotypeDescription] = useState<string>("");
  const [isZooming, setIsZooming] = useState(false);
  const [technotypeSummary, setTechnotypeSummary] = useState<string>("");
  const [showLearnMorePrompt, setShowLearnMorePrompt] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [clickedAttributes, setClickedAttributes] = useState<number[]>([]);
  const [showSignup, setShowSignup] = useState(false);
  const [expandedHexagons, setExpandedHexagons] = useState<number[]>([]);

  // Attribute details for the skill tree
  const attributeDetails = [
    {
      id: 0,
      title: "Digital Focus",
      description: "Master the art of intentional technology use",
      benefit: "Improved productivity and reduced digital overwhelm"
    },
    {
      id: 1,
      title: "No Screens Before Bed",
      description: "Create a 1-hour screen-free buffer before sleep",
      benefit: "Better sleep quality and improved circadian rhythm"
    },
    {
      id: 2,
      title: "Intentional Usage",
      description: "Set specific purposes for each tech session",
      benefit: "Reduced mindless scrolling and increased fulfillment"
    },
    {
      id: 3,
      title: "Digital Boundaries",
      description: "Establish clear limits on device usage",
      benefit: "Stronger relationships and better work-life balance"
    },
    {
      id: 4,
      title: "Mindful Consumption",
      description: "Consciously choose what content to engage with",
      benefit: "Reduced anxiety and more meaningful online experiences"
    },
    {
      id: 5,
      title: "Tech Balance",
      description: "Find harmony between digital and analog activities",
      benefit: "Enhanced creativity and reduced digital dependency"
    },
    {
      id: 6,
      title: "Digital Wellness",
      description: "Prioritize mental health in the digital age",
      benefit: "Improved mood and reduced screen fatigue"
    },
    {
      id: 7,
      title: "Smart Habits",
      description: "Build sustainable technology routines",
      benefit: "Long-term digital wellbeing and life satisfaction"
    }
  ];

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

  const handleConversationalComplete = (technotype: string, description: string, summary: string) => {
    setUserArchetype(technotype);
    setTechnotypeDescription(description);
    setTechnotypeSummary(summary);
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

  useEffect(() => {
    if (phase === 'results' && showReveal) {
      const timer = setTimeout(() => setShowLearnMorePrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, showReveal]);

  const handleOptionSelect = async (option: string) => {
    const questionId = quizQuestions[currentQuestion].id;
    setAnswers({ ...answers, [questionId]: option });
    setSelectedOption(option);

    // Move to next question with minimal delay
    setTimeout(async () => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Convert answers to QuizAnswer format
        const quizAnswers: QuizAnswer[] = quizQuestions.map(q => ({
          question: q.question,
          answer: q.options.find(o => o.id === answers[q.id])?.text || ''
        }));

        // Generate technotype using OpenAI
        try {
          const result = await generateTechnotypeFromQuiz(quizAnswers);
          setUserArchetype(result.technotype);
          setTechnotypeDescription(result.description);
          setIsFinished(true);
          setPhase('results');
        } catch (error) {
          console.error('Failed to generate technotype:', error);
          // Show user-friendly error message
          alert(`Failed to generate technotype: ${error instanceof Error ? error.message : 'Unknown error'}. Using fallback archetype.`);
          // Fallback to default archetype if generation fails
          const archetype = calculateArchetype(answers);
          setUserArchetype(archetype);
          setIsFinished(true);
          setPhase('results');
        }
      }
    }, 300);
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

  const handleLearnMore = () => {
    setShowSkillTree(true);
  };

  const handleAttributeClick = (id: number) => {
    // Toggle expansion
    if (expandedHexagons.includes(id)) {
      setExpandedHexagons(expandedHexagons.filter(hex => hex !== id));
    } else {
      setExpandedHexagons([...expandedHexagons, id]);
    }
    
    // Toggle activation
    if (!clickedAttributes.includes(id)) {
      setClickedAttributes([...clickedAttributes, id]);
    }
  };

  useEffect(() => {
    if (showSkillTree && clickedAttributes.length === 8) {
      const timer = setTimeout(() => setShowSignup(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [showSkillTree, clickedAttributes]);

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
    if (showSkillTree) {
      return (
        <div className="min-h-screen bg-black text-terminal-light p-8 font-mono flex items-center justify-center">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-terminal-accent">Your Technotype Skill Tree</h2>
            <div className="relative">
              {/* Skill Tree Structure */}
              <div className="grid grid-cols-7 gap-4 mb-8">
                {/* Row 1 - Center node */}
                <div className="col-start-4">
                  <motion.div
                    onClick={() => handleAttributeClick(0)}
                    className={`hexagon cursor-pointer transition-all duration-300 flex items-center justify-center font-mono text-lg select-none
                      ${clickedAttributes.includes(0) ? 'hexagon-active' : 'hexagon-inactive'}`}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="text-center">
                      <span className="font-bold text-terminal-accent text-sm block">{attributeDetails[0].title}</span>
                      {expandedHexagons.includes(0) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-2 text-xs text-terminal-light/80"
                        >
                          <div className="mb-1">{attributeDetails[0].description}</div>
                          <div className="text-terminal-accent/60">{attributeDetails[0].benefit}</div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
                
                {/* Row 2 - Three nodes */}
                <div className="col-start-2">
                  <motion.div
                    onClick={() => handleAttributeClick(1)}
                    className={`hexagon cursor-pointer transition-all duration-300 flex items-center justify-center font-mono text-lg select-none
                      ${clickedAttributes.includes(1) ? 'hexagon-active' : 'hexagon-inactive'}`}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <div className="text-center">
                      <span className="font-bold text-terminal-accent text-sm block">{attributeDetails[1].title}</span>
                      {expandedHexagons.includes(1) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-2 text-xs text-terminal-light/80"
                        >
                          <div className="mb-1">{attributeDetails[1].description}</div>
                          <div className="text-terminal-accent/60">{attributeDetails[1].benefit}</div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
                <div className="col-start-4">
                  <motion.div
                    onClick={() => handleAttributeClick(2)}
                    className={`hexagon cursor-pointer transition-all duration-300 flex items-center justify-center font-mono text-lg select-none
                      ${clickedAttributes.includes(2) ? 'hexagon-active' : 'hexagon-inactive'}`}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <div className="text-center">
                      <span className="font-bold text-terminal-accent text-sm block">{attributeDetails[2].title}</span>
                      {expandedHexagons.includes(2) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-2 text-xs text-terminal-light/80"
                        >
                          <div className="mb-1">{attributeDetails[2].description}</div>
                          <div className="text-terminal-accent/60">{attributeDetails[2].benefit}</div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
                <div className="col-start-6">
                  <motion.div
                    onClick={() => handleAttributeClick(3)}
                    className={`hexagon cursor-pointer transition-all duration-300 flex items-center justify-center font-mono text-lg select-none
                      ${clickedAttributes.includes(3) ? 'hexagon-active' : 'hexagon-inactive'}`}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <div className="text-center">
                      <span className="font-bold text-terminal-accent text-sm block">{attributeDetails[3].title}</span>
                      {expandedHexagons.includes(3) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-2 text-xs text-terminal-light/80"
                        >
                          <div className="mb-1">{attributeDetails[3].description}</div>
                          <div className="text-terminal-accent/60">{attributeDetails[3].benefit}</div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
                
                {/* Row 3 - Five nodes */}
                <div className="col-start-1">
                  <motion.div
                    onClick={() => handleAttributeClick(4)}
                    className={`hexagon cursor-pointer transition-all duration-300 flex items-center justify-center font-mono text-lg select-none
                      ${clickedAttributes.includes(4) ? 'hexagon-active' : 'hexagon-inactive'}`}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <div className="text-center">
                      <span className="font-bold text-terminal-accent text-sm block">{attributeDetails[4].title}</span>
                      {expandedHexagons.includes(4) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-2 text-xs text-terminal-light/80"
                        >
                          <div className="mb-1">{attributeDetails[4].description}</div>
                          <div className="text-terminal-accent/60">{attributeDetails[4].benefit}</div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
                <div className="col-start-3">
                  <motion.div
                    onClick={() => handleAttributeClick(5)}
                    className={`hexagon cursor-pointer transition-all duration-300 flex items-center justify-center font-mono text-lg select-none
                      ${clickedAttributes.includes(5) ? 'hexagon-active' : 'hexagon-inactive'}`}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <div className="text-center">
                      <span className="font-bold text-terminal-accent text-sm block">{attributeDetails[5].title}</span>
                      {expandedHexagons.includes(5) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-2 text-xs text-terminal-light/80"
                        >
                          <div className="mb-1">{attributeDetails[5].description}</div>
                          <div className="text-terminal-accent/60">{attributeDetails[5].benefit}</div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
                <div className="col-start-5">
                  <motion.div
                    onClick={() => handleAttributeClick(6)}
                    className={`hexagon cursor-pointer transition-all duration-300 flex items-center justify-center font-mono text-lg select-none
                      ${clickedAttributes.includes(6) ? 'hexagon-active' : 'hexagon-inactive'}`}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <div className="text-center">
                      <span className="font-bold text-terminal-accent text-sm block">{attributeDetails[6].title}</span>
                      {expandedHexagons.includes(6) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-2 text-xs text-terminal-light/80"
                        >
                          <div className="mb-1">{attributeDetails[6].description}</div>
                          <div className="text-terminal-accent/60">{attributeDetails[6].benefit}</div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
                <div className="col-start-7">
                  <motion.div
                    onClick={() => handleAttributeClick(7)}
                    className={`hexagon cursor-pointer transition-all duration-300 flex items-center justify-center font-mono text-lg select-none
                      ${clickedAttributes.includes(7) ? 'hexagon-active' : 'hexagon-inactive'}`}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <div className="text-center">
                      <span className="font-bold text-terminal-accent text-sm block">{attributeDetails[7].title}</span>
                      {expandedHexagons.includes(7) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-2 text-xs text-terminal-light/80"
                        >
                          <div className="mb-1">{attributeDetails[7].description}</div>
                          <div className="text-terminal-accent/60">{attributeDetails[7].benefit}</div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00ff00" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00ff00" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {/* Add connection lines between hexagons */}
                <line x1="25%" y1="20%" x2="15%" y2="40%" stroke="url(#lineGradient)" strokeWidth="2" />
                <line x1="25%" y1="20%" x2="35%" y2="40%" stroke="url(#lineGradient)" strokeWidth="2" />
                <line x1="25%" y1="20%" x2="55%" y2="40%" stroke="url(#lineGradient)" strokeWidth="2" />
                <line x1="15%" y1="40%" x2="10%" y2="60%" stroke="url(#lineGradient)" strokeWidth="2" />
                <line x1="35%" y1="40%" x2="25%" y2="60%" stroke="url(#lineGradient)" strokeWidth="2" />
                <line x1="55%" y1="40%" x2="45%" y2="60%" stroke="url(#lineGradient)" strokeWidth="2" />
                <line x1="55%" y1="40%" x2="65%" y2="60%" stroke="url(#lineGradient)" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-terminal-accent/80 text-lg">Click each hexagon to unlock your technotype attributes!</p>
          </div>
        </div>
      );
    }
    if (showSignup) {
      return (
        <div className="min-h-screen bg-black text-terminal-light p-8 font-mono flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-terminal-accent">Join Clearspace</h2>
            <p className="text-lg text-terminal-light/80 mb-8">Sign up to continue your digital wellbeing journey and unlock more personalized insights.</p>
            {/* Replace with your signup form or link */}
            <button className="bg-terminal-accent text-black px-8 py-3 rounded-lg font-bold text-xl hover:bg-terminal-accent/80 transition">Sign Up</button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-black text-terminal-light p-8 font-mono">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-8 text-terminal-accent">
              Technotype:
            </h1>
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
              <div className="bg-black/80 p-8 mb-8 flex flex-col items-center justify-center">
                <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-terminal-accent drop-shadow-lg animate-glow">
                  <AnimatedText text={userArchetype} speed={30} className="text-terminal-accent text-5xl md:text-6xl font-extrabold text-center" />
                </h2>
                <p className="text-xl text-terminal-light/80 mb-4 font-mono animate-fade-in">
                  <AnimatedText text={technotypeSummary} speed={22} className="text-terminal-light/80 text-xl text-center" />
                </p>
                {showLearnMorePrompt && (
                  <motion.div
                    onClick={handleLearnMore}
                    className="mt-8 flex items-center justify-center gap-3 text-4xl md:text-6xl text-terminal-accent font-mono hover:text-glow transition-all duration-300 transform hover:scale-105 cursor-pointer select-none"
                    animate={{
                      x: [0, 20, 0, -20, 0],
                      y: [0, -10, 0, -10, 0]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Learn More"
                  >
                    <AnimatedText
                      text="learn more"
                      speed={30}
                      className="text-terminal-accent"
                      bold={false}
                      noWrap={true}
                    />
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
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
    return <ConversationalQuiz onComplete={(t, d, s) => handleConversationalComplete(t, d, s)} />;
  }

  if (phase === 'results') {
    return renderResults();
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
