
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
      className="min-h-screen bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ConversationEngine />
    </motion.div>
  );
};

export default Index;
