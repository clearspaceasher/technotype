
import React, { useEffect } from "react";
import ConversationEngine from "@/components/ConversationEngine";
import { motion } from "framer-motion";

const Index: React.FC = () => {
  useEffect(() => {
    // Set background to black when component mounts and ensure body has full height
    document.body.style.backgroundColor = "black";
    document.body.style.minHeight = "100vh";
    
    // Cleanup function to reset background color when component unmounts
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.minHeight = "";
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
