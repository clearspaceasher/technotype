import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedText from "./AnimatedText";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserInfo {
  name: string;
  age: string;
  gender: string;
  randomAnswer: string;
}

interface UserInfoFormProps {
  onComplete: (userInfo: UserInfo) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onComplete }) => {
  const [currentField, setCurrentField] = useState<'name' | 'age' | 'gender' | 'random'>('name');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    age: '',
    gender: '',
    randomAnswer: ''
  });
  const [currentInput, setCurrentInput] = useState("");
  const [promptComplete, setPromptComplete] = useState(false);
  const [showError, setShowError] = useState(false);
  const [bump, setBump] = useState(false);
  const [randomQuestion, setRandomQuestion] = useState("");
  const navigate = useNavigate();

  // Random incredibly specific questions
  const randomQuestions = [
    "if you could only eat cereal with one specific utensil for the rest of your life, would you choose a dessert spoon or a tea spoon?",
    "when walking through automatic doors, do you slow down slightly or maintain your exact pace?",
    "if you had to choose between socks that are always slightly damp or shoes that squeak only on tuesdays, which would you pick?",
    "do you think the letter 'Q' feels lonely without 'U' in words like 'qi'?",
    "if elevators could only play one song forever, should it be elevator music or the jeopardy theme?",
    "would you rather have fingernails that grow backwards or toenails that change color with your mood?",
    "if you could only communicate through haikus on wednesdays, would you embrace it or move to a place where wednesday doesn't exist?",
    "do you believe doorknobs have a preferred direction of turning?",
    "if shadows could taste things, what do you think your shadow would want to eat first?",
    "would you rather hiccup in musical notes or sneeze in different accents?",
    "if you had to assign a personality to the number 7, would it be more of an introvert or extrovert?",
    "do you think plants judge us for talking to them or do they appreciate the conversation?",
    "if you could only use stairs that were either too tall or too short, which would cause you less existential dread?",
    "would you rather have a refrigerator that hums showtunes or a microwave that beeps in morse code?",
    "if you had to choose a theme song that plays every time you enter a room, would it be 8 seconds or 23 seconds long?"
  ];

  const prompts = {
    name: "> what should we call you?\n\n> ",
    age: "> how old are you?\n\n> ",
    gender: "> what's your gender?\n\n> ",
    random: `> ${randomQuestion}\n\n> `
  };

  const currentPrompt = prompts[currentField];

  const handleExit = () => {
    navigate('/');
  };

  // Set random question when component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * randomQuestions.length);
    setRandomQuestion(randomQuestions[randomIndex]);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!promptComplete) return;
      
      if (e.key === "Enter") {
        if (currentInput.trim()) {
          let finalValue = currentInput.trim();
          
          // Validate age is a number
          if (currentField === 'age') {
            if (!/^\d+$/.test(currentInput.trim())) {
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
                setCurrentInput("");
              }, 2000);
              return;
            }
          }
          
          // Handle gender shortcuts
          if (currentField === 'gender') {
            const input = currentInput.toLowerCase().trim();
            if (input === 'm') {
              finalValue = 'male';
            } else if (input === 'f') {
              finalValue = 'female';
            } else if (input === 'o') {
              finalValue = 'other';
            }
          }

          // Trigger bump animation
          setBump(true);
          setTimeout(() => setBump(false), 300);

          const newUserInfo = { ...userInfo, [currentField === 'random' ? 'randomAnswer' : currentField]: finalValue };
          setUserInfo(newUserInfo);
          setCurrentInput("");
          setPromptComplete(false);

          // Move to next field or complete
          if (currentField === 'name') {
            setCurrentField('age');
          } else if (currentField === 'age') {
            setCurrentField('gender');
          } else if (currentField === 'gender') {
            setCurrentField('random');
          } else {
            // All fields complete
            setTimeout(() => onComplete(newUserInfo), 500);
          }
        }
      } else if (e.key === "Backspace") {
        setCurrentInput(prev => prev.slice(0, -1));
        setShowError(false);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setCurrentInput(prev => prev + e.key);
        setShowError(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [promptComplete, currentInput, currentField, userInfo, onComplete, randomQuestion]);

  return (
    <div className="min-h-screen bg-black text-terminal-light p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Terminal with outline */}
        <motion.div 
          className="border border-terminal-accent/50 rounded-lg p-6 bg-black/80"
          animate={bump ? { y: [-2, 0], scale: [1, 1.005, 1] } : {}}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Terminal header */}
          <div className="flex items-center mb-6 pb-4 border-b border-terminal-accent/30">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div 
                  className="w-3 h-3 rounded-full bg-red-500 mr-2 cursor-pointer hover:bg-red-400 transition-colors"
                  title="exit/restart"
                />
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-black border border-terminal-accent/50 text-terminal-light">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-terminal-light">Exit User Registration?</AlertDialogTitle>
                  <AlertDialogDescription className="text-terminal-light/70">
                    Are you sure you want to exit? Your progress will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border border-terminal-accent/50 text-terminal-light hover:bg-terminal-accent/10">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleExit}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Exit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="ml-4 text-terminal-accent/70 text-sm">user_registration.exe</span>
          </div>
          
          {/* Terminal content */}
          <div className="space-y-2">
            {/* Show completed fields */}
            {userInfo.name && (
              <div className="text-left text-terminal-light/70">
                {`> name: ${userInfo.name}`}
              </div>
            )}
            {userInfo.age && (
              <div className="text-left text-terminal-light/70">
                {`> age: ${userInfo.age}`}
              </div>
            )}
            {userInfo.gender && (
              <div className="text-left text-terminal-light/70">
                {`> gender: ${userInfo.gender}`}
              </div>
            )}
            {userInfo.randomAnswer && (
              <div className="text-left text-terminal-light/70">
                {`> answer: ${userInfo.randomAnswer}`}
              </div>
            )}
            
            {/* Current prompt and input on same line */}
            <div className="text-left">
              <AnimatedText
                text={currentPrompt}
                speed={30}
                className="text-terminal-light whitespace-pre-line inline"
                onComplete={() => setPromptComplete(true)}
              />
              {promptComplete && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline"
                >
                  <span className="text-terminal-light">{currentInput}</span>
                  <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-pulse"></span>
                </motion.span>
              )}
            </div>
            
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 mt-4 text-left"
              >
                <AnimatedText
                  text={currentField === 'age' ? "please enter a valid number" : "invalid input"}
                  speed={20}
                  className="text-red-400 text-left"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserInfoForm;