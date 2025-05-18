
import React, { useEffect } from "react";
import ConversationEngine from "@/components/ConversationEngine";
import { motion } from "framer-motion";

const Index: React.FC = () => {
  useEffect(() => {
    // Set background to black when component mounts
    document.body.style.backgroundColor = "black";
    
    // Cleanup function to reset background color when component unmounts
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);
  
  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-black p-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="w-full max-w-5xl">
        <ConversationEngine />
      </div>
    </motion.div>
  );
};

export default Index;
