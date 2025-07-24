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
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [personalizedAttributes, setPersonalizedAttributes] = useState<any[]>([]);
  const [attributesLoading, setAttributesLoading] = useState(false);

  // Generate personalized attributes from OpenAI
  const generatePersonalizedAttributes = async () => {
    setAttributesLoading(true);
    try {
      const response = await fetch('/api/generate-personalized-attributes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          technotype: userArchetype,
          technotypeSummary: technotypeSummary,
          conversationHistory: conversationalAnswers,
          quizAnswers: answers
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setPersonalizedAttributes(data.attributes);
      } else {
        // Fallback to default attributes if API fails
        setPersonalizedAttributes(attributeDetails);
      }
    } catch (error) {
      console.error('Failed to generate personalized attributes:', error);
      setPersonalizedAttributes(attributeDetails);
    } finally {
      setAttributesLoading(false);
    }
  };

  // Generate attributes when skill tree is shown
  useEffect(() => {
    if (showSkillTree && personalizedAttributes.length === 0) {
      generatePersonalizedAttributes();
    }
  }, [showSkillTree]);

  // Attribute details for the skill tree (fallback)
  const attributeDetails = [
    {
      id: 0,
      title: "Digital Focus",
      description: "Set specific goals for each tech session",
      benefit: "Boost productivity by 40%"
    },
    {
      id: 1,
      title: "No Screens Before Bed",
      description: "Stop using devices 1 hour before sleep",
      benefit: "Improve sleep quality instantly"
    },
    {
      id: 2,
      title: "Intentional Usage",
      description: "Check your phone with purpose, not habit",
      benefit: "Reduce screen time by 30%"
    },
    {
      id: 3,
      title: "Digital Boundaries",
      description: "Set daily limits on app usage",
      benefit: "Create more meaningful relationships"
    },
    {
      id: 4,
      title: "Mindful Consumption",
      description: "Choose content that adds value to your life",
      benefit: "Reduce anxiety and stress"
    },
    {
      id: 5,
      title: "Tech Balance",
      description: "Spend equal time on digital and analog activities",
      benefit: "Enhance creativity and focus"
    },
    {
      id: 6,
      title: "Digital Wellness",
      description: "Take regular breaks from screens",
      benefit: "Improve mental clarity"
    },
    {
      id: 7,
      title: "Smart Habits",
      description: "Build consistent daily tech routines",
      benefit: "Achieve long-term digital wellbeing"
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
      const newClickedAttributes = [...clickedAttributes, id];
      setClickedAttributes(newClickedAttributes);
    }
  };

  useEffect(() => {
    if (showSkillTree && clickedAttributes.length === 8) {
      const timer = setTimeout(() => {
        setShowSignup(true);
      }, 1200);
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
    if (showSignup) {
      return (
        <div className="min-h-screen bg-black text-terminal-light p-8 font-mono flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-8 text-terminal-accent">Digital Transformation Awaits</h2>
              <div className="text-lg text-terminal-light/80 mb-8 space-y-4">
                <AnimatedText 
                  text="Get your personalized digital wellbeing plan delivered to your inbox." 
                  speed={20} 
                  className="text-terminal-light/80 text-lg"
                />
              </div>
              
              {!emailSubmitted ? (
                <div className="bg-terminal-accent/10 border border-terminal-accent/30 rounded-lg p-6 mb-8">
                  <div className="text-left mb-4">
                    <span className="text-terminal-accent">$ </span>
                    <AnimatedText 
                      text="Enter your email to receive your full technotype analysis:" 
                      speed={15} 
                      className="text-terminal-light inline"
                    />
                  </div>
                  <div className="flex gap-4">
                    <input 
                      type="email" 
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-black border border-terminal-accent/50 rounded px-4 py-3 text-terminal-light font-mono focus:outline-none focus:border-terminal-accent"
                    />
                    <button 
                      onClick={() => setEmailSubmitted(true)}
                      className="bg-terminal-accent text-black px-6 py-3 rounded font-bold font-mono hover:bg-terminal-accent/80 transition"
                    >
                      Get Plan →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-terminal-accent/10 border border-terminal-accent/30 rounded-lg p-6 mb-8">
                  <div className="text-center">
                    <span className="text-terminal-accent text-2xl">✓</span>
                    <AnimatedText 
                      text="Email submitted successfully! Your personalized plan is on its way." 
                      speed={20} 
                      className="text-terminal-light text-lg mt-2 block"
                    />
                  </div>
                </div>
              )}
              
              <div className="text-terminal-accent/60 text-sm">
                <AnimatedText 
                  text="Your privacy is protected. We'll only send you your personalized plan." 
                  speed={25} 
                  className="text-terminal-accent/60 text-sm"
                />
              </div>
            </motion.div>
          </div>
        </div>
      );
    }
    
    if (showSkillTree) {
      return (
        <div className="min-h-screen bg-black text-terminal-light p-8 font-mono flex items-center justify-center">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-terminal-accent -mt-24">{userArchetype} Attributes</h2>
            <div className="relative -mt-8">
              {attributesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <AnimatedText text="Generating your personalized attributes..." speed={20} className="text-terminal-accent" />
                </div>
              ) : (
                <>
                  {/* Skill Tree Structure */}
                  <div className="grid grid-cols-7 gap-6 mb-8">
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
                        <div className="text-center px-4">
                          <span className="font-bold text-terminal-accent text-base block">
                            {personalizedAttributes[0]?.title || attributeDetails[0].title}
                          </span>
                          {expandedHexagons.includes(0) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-3 text-sm text-terminal-light/80"
                            >
                              <div className="mb-2">
                                {personalizedAttributes[0]?.suggestion || attributeDetails[0].description}
                              </div>
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
                        <div className="text-center px-4">
                          <span className="font-bold text-terminal-accent text-base block">
                            {personalizedAttributes[1]?.title || attributeDetails[1].title}
                          </span>
                          {expandedHexagons.includes(1) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-3 text-sm text-terminal-light/80"
                            >
                              <div className="mb-2">
                                {personalizedAttributes[1]?.suggestion || attributeDetails[1].description}
                              </div>
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
                        <div className="text-center px-4">
                          <span className="font-bold text-terminal-accent text-base block">
                            {personalizedAttributes[2]?.title || attributeDetails[2].title}
                          </span>
                          {expandedHexagons.includes(2) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-3 text-sm text-terminal-light/80"
                            >
                              <div className="mb-2">
                                {personalizedAttributes[2]?.suggestion || attributeDetails[2].description}
                              </div>
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
                        <div className="text-center px-4">
                          <span className="font-bold text-terminal-accent text-base block">
                            {personalizedAttributes[3]?.title || attributeDetails[3].title}
                          </span>
                          {expandedHexagons.includes(3) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-3 text-sm text-terminal-light/80"
                            >
                              <div className="mb-2">
                                {personalizedAttributes[3]?.suggestion || attributeDetails[3].description}
                              </div>
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
                        <div className="text-center px-4">
                          <span className="font-bold text-terminal-accent text-base block">
                            {personalizedAttributes[4]?.title || attributeDetails[4].title}
                          </span>
                          {expandedHexagons.includes(4) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-3 text-sm text-terminal-light/80"
                            >
                              <div className="mb-2">
                                {personalizedAttributes[4]?.suggestion || attributeDetails[4].description}
                              </div>
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
                        <div className="text-center px-4">
                          <span className="font-bold text-terminal-accent text-base block">
                            {personalizedAttributes[5]?.title || attributeDetails[5].title}
                          </span>
                          {expandedHexagons.includes(5) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-3 text-sm text-terminal-light/80"
                            >
                              <div className="mb-2">
                                {personalizedAttributes[5]?.suggestion || attributeDetails[5].description}
                              </div>
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
                        <div className="text-center px-4">
                          <span className="font-bold text-terminal-accent text-base block">
                            {personalizedAttributes[6]?.title || attributeDetails[6].title}
                          </span>
                          {expandedHexagons.includes(6) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-3 text-sm text-terminal-light/80"
                            >
                              <div className="mb-2">
                                {personalizedAttributes[6]?.suggestion || attributeDetails[6].description}
                              </div>
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
                        <div className="text-center px-4">
                          <span className="font-bold text-terminal-accent text-base block">
                            {personalizedAttributes[7]?.title || attributeDetails[7].title}
                          </span>
                          {expandedHexagons.includes(7) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-3 text-sm text-terminal-light/80"
                            >
                              <div className="mb-2">
                                {personalizedAttributes[7]?.suggestion || attributeDetails[7].description}
                              </div>
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
                </>
              )}
            </div>
            <p className="text-terminal-accent/80 text-lg">Unlock all attributes to discover your digital transformation path</p>
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
            {/* Retro Desktop Icon */}
            {!showReveal && (
              <motion.div 
                className="flex justify-center items-center min-h-screen"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="scale-150">
                  <PixelIcon onClick={handleIconClick} clickCount={iconClicked} />
                </div>
              </motion.div>
            )}
            {/* Archetype Reveal Animation */}
            {showReveal && (
              <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-terminal-accent drop-shadow-lg animate-glow">
                  <AnimatedText text={userArchetype} speed={30} className="text-terminal-accent text-5xl md:text-6xl font-extrabold text-center" />
                </h2>
                <p className="text-xl text-terminal-light/80 mb-4 font-mono animate-fade-in">
                  <AnimatedText text={technotypeSummary} speed={22} className="text-terminal-light/80 text-xl text-center" />
                </p>
                {showLearnMorePrompt && (
                  <motion.div
                    onClick={handleLearnMore}
                    className="mt-16 flex items-center justify-center gap-3 text-5xl md:text-7xl text-terminal-accent font-mono hover:text-glow transition-all duration-300 transform hover:scale-105 cursor-pointer select-none"
                    animate={{
                      x: [0, 30, 0, -30, 0],
                      y: [0, -15, 0, -15, 0]
                    }}
                    transition={{
                      duration: 6,
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
