
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import AnimatedText from "@/components/AnimatedText";

type Question = {
  id: number;
  type: "image-choice" | "multiple-choice" | "slider" | "this-or-that";
  question: string;
  options?: {
    id: string;
    text: string;
    image?: string;
  }[];
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
};

const questions: Question[] = [
  {
    id: 1,
    type: "image-choice",
    question: "Which scene feels most like your ideal digital environment?",
    options: [
      { id: "focused", text: "Focused workspace", image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=500&h=350&fit=crop" },
      { id: "social", text: "Social hub", image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&h=350&fit=crop" },
      { id: "minimal", text: "Minimal setup", image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=500&h=350&fit=crop" },
      { id: "immersive", text: "Immersive experience", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=350&fit=crop" },
    ],
  },
  {
    id: 2,
    type: "multiple-choice",
    question: "When your phone buzzes with a notification, you usually:",
    options: [
      { id: "instant", text: "Check it immediately" },
      { id: "wait", text: "Check it when convenient" },
      { id: "ignore", text: "Often ignore it completely" },
    ],
  },
  {
    id: 3,
    type: "slider",
    question: "How much control do you feel over your screen time?",
    min: 0,
    max: 100,
    leftLabel: "None",
    rightLabel: "Complete",
  },
  {
    id: 4,
    type: "this-or-that",
    question: "What brings you more satisfaction?",
    options: [
      { id: "deep", text: "Deep focus on one thing" },
      { id: "breadth", text: "Exploring many things at once" },
    ],
  },
  {
    id: 5,
    type: "multiple-choice",
    question: "Your ideal relationship with technology is:",
    options: [
      { id: "empowering", text: "Tool that empowers me" },
      { id: "invisible", text: "Invisible and seamless" },
      { id: "limited", text: "Limited to specific purposes" },
      { id: "immersive", text: "Immersive and engaging" },
    ],
  },
];

const Index: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [sliderValue, setSliderValue] = useState(50);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Set background to black when component mounts
    document.body.style.backgroundColor = "black";
    
    // Cleanup function to reset background color when component unmounts
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);
  
  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestion.type === "slider") {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: sliderValue }));
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Quiz completed - would navigate to results
      console.log("Quiz completed", answers);
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerId }));
  };

  const handleStartQuiz = () => {
    setShowIntro(false);
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "image-choice":
        return (
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options?.map((option) => (
              <div key={option.id} className="relative">
                <button
                  className={`w-full h-40 overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    answers[currentQuestion.id] === option.id ? "ring-2 ring-terminal-accent scale-105" : "ring-1 ring-gray-700"
                  }`}
                  onClick={() => handleAnswerSelect(option.id)}
                >
                  <img
                    src={option.image}
                    alt={option.text}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 text-terminal-light text-sm">
                    {option.text}
                  </div>
                </button>
              </div>
            ))}
          </div>
        );
      
      case "multiple-choice":
        return (
          <RadioGroup
            value={answers[currentQuestion.id] || ""}
            className="space-y-3 mt-4"
            onValueChange={(value) => handleAnswerSelect(value)}
          >
            {currentQuestion.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  className="border-terminal-accent text-terminal-accent"
                />
                <Label
                  htmlFor={option.id}
                  className="text-terminal-light text-lg cursor-pointer"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case "slider":
        return (
          <div className="mt-8 space-y-6">
            <Slider
              value={[sliderValue]}
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={1}
              onValueChange={(values) => setSliderValue(values[0])}
              className="h-2 bg-gray-700"
            />
            <div className="flex justify-between text-terminal-light mt-2">
              <span>{currentQuestion.leftLabel}</span>
              <span>{sliderValue}%</span>
              <span>{currentQuestion.rightLabel}</span>
            </div>
          </div>
        );
      
      case "this-or-that":
        return (
          <div className="flex flex-col gap-4 mt-4">
            {currentQuestion.options?.map((option) => (
              <button
                key={option.id}
                className={`p-6 rounded-lg border text-lg transition-all duration-300 ${
                  answers[currentQuestion.id] === option.id
                    ? "bg-terminal-accent bg-opacity-20 border-terminal-accent text-terminal-light"
                    : "bg-black border-gray-700 text-terminal-light hover:border-terminal-accent"
                }`}
                onClick={() => handleAnswerSelect(option.id)}
              >
                {option.text}
              </button>
            ))}
          </div>
        );
    }
  };

  if (showIntro) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-black p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-xl">
          <Card className="bg-black border-gray-800">
            <CardContent className="p-8">
              <motion.div 
                className="space-y-6 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold text-terminal-light">
                  <AnimatedText 
                    text="Discover your digital mind"
                    speed={30}
                    className="inline-block"
                  />
                </h1>
                <p className="text-terminal-light text-lg">
                  <AnimatedText 
                    text="This quick quiz will help you understand your relationship with technology."
                    speed={30}
                    className="inline-block"
                  />
                </p>
                <Button 
                  className="bg-terminal-accent hover:bg-terminal-accent/80 text-black mt-4"
                  onClick={handleStartQuiz}
                >
                  Start Quiz <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-black p-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-black border border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-terminal-light">
                    Question {currentQuestionIndex + 1}/{questions.length}
                  </div>
                  <div className="h-1 bg-gray-800 flex-1 mx-4 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-terminal-accent" 
                      style={{
                        width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                        transition: "width 0.3s ease"
                      }}
                    />
                  </div>
                </div>

                <h2 className="text-2xl text-terminal-light mb-6">
                  <AnimatedText
                    text={currentQuestion.question}
                    speed={20}
                    className=""
                  />
                </h2>

                {renderQuestion()}

                <div className="mt-8 flex justify-end">
                  <Button
                    className={`bg-terminal-accent hover:bg-terminal-accent/80 text-black ${
                      (currentQuestion.type !== "slider" && !answers[currentQuestion.id]) ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleNext}
                    disabled={currentQuestion.type !== "slider" && !answers[currentQuestion.id]}
                  >
                    {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
                    <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Index;
