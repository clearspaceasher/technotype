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
import { generateNextQuestion, generateTechnotypeFromConversation, ConversationMessage } from "@/lib/openai";

interface ConversationalQuizProps {
  onComplete: (technotype: string, description: string) => void;
}

const ConversationalQuiz: React.FC<ConversationalQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [questionComplete, setQuestionComplete] = useState(false);
  const [showingResponse, setShowingResponse] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isBumping, setIsBumping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    initializeQuiz();
  }, []);

  async function initializeQuiz() {
    try {
      setIsLoading(true);
      setError(null);
      const question = await generateNextQuestion(conversationHistory, 0);
      setCurrentQuestion(question);
      setConversationHistory([{ role: 'assistant' as const, content: question }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize quiz');
    } finally {
      setIsLoading(false);
    }
  }

  const currentQuestionText = currentQuestion ? `${'>'}  ${currentQuestion}` : "";

  // Calculate scale based on input length - small increments of 0.005 per character
  const currentScale = 1 + (currentInput.length * 0.005);
  
  // Calculate inverse zoom for the page - as text gets bigger, page zooms out
  const pageZoom = 1 / currentScale;

  const handleExit = () => {
    navigate('/');
  };

  async function handleAnswer(answer: string) {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add user's answer to conversation
      const newHistory = [...conversationHistory, { role: 'user' as const, content: answer }];
      setConversationHistory(newHistory);

      // Get next question
      const nextQuestion = await generateNextQuestion(newHistory, newHistory.length);
      setCurrentQuestion(nextQuestion);
      setConversationHistory([...newHistory, { role: 'assistant' as const, content: nextQuestion }]);

      // If we've reached 10 questions, generate the technotype
      if (newHistory.length >= 10) {
        const result = await generateTechnotypeFromConversation(newHistory);
        onComplete(result.technotype, result.description);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate next question');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!questionComplete || showingResponse || isLoading) return;
      
      if (e.key === "Enter") {
        if (currentInput.trim()) {
          // Trigger bump animation and snap back scale
          setIsBumping(true);
          setTimeout(() => setIsBumping(false), 200);
          
          const newAnswers = [...answers, currentInput.trim()];
          setAnswers(newAnswers);
          
          // Reset input immediately to snap scale back to 1
          setCurrentInput("");
          setShowingResponse(true);
          
          // Process the answer and move to next question
          handleAnswer(currentInput.trim()).then(() => {
            setQuestionComplete(false);
            setShowingResponse(false);
          });
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
  }, [questionComplete, showingResponse, currentInput, answers, isLoading]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-terminal-light p-8 font-mono flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="border border-red-500/50 rounded-lg p-6 bg-black/80">
            <h2 className="text-red-400 text-xl mb-4">Connection Error</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <div className="space-y-2 text-sm text-terminal-accent/70">
              <p>If you see this error, the backend serverless function is down or cannot reach OpenAI.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check your OpenAI API key in the Vercel dashboard</li>
                <li>Check your Vercel deployment status</li>
                <li>If the problem persists, try redeploying or contact support</li>
              </ul>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-terminal-accent/20 border border-terminal-accent/50 text-terminal-light hover:bg-terminal-accent/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-terminal-light p-8 font-mono flex items-center justify-center">
        <AnimatedText
          text="initializing conversation..."
          speed={20}
          className="text-terminal-accent/60"
        />
      </div>
    );
  }

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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div 
                  className="w-3 h-3 rounded-full bg-red-500 mr-2 cursor-pointer hover:bg-red-400 transition-colors"
                  title="exit/restart"
                />
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-black border border-terminal-accent/50 text-terminal-light">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-terminal-light">Exit Open Sequence?</AlertDialogTitle>
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
                className={`text-left break-words ${entry.role === 'assistant' ? 'text-terminal-light' : 'text-terminal-accent/80'}`}
              >
                {entry.role === 'assistant' ? `> ${entry.content}` : `  ${entry.content}`}
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
          ) : currentQuestion && (
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
                text={currentQuestionText}
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
