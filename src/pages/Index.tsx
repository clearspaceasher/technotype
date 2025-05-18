
import React from "react";
import ConversationEngine from "@/components/ConversationEngine";
import { motion } from "framer-motion";

const Index: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-terminal-dark p-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="w-full max-w-4xl">
        <header className="mb-6">
          <h1 className="text-terminal-accent text-xl font-bold mb-1 tracking-wide">ARCHETYPE DISCOVERY SYSTEM</h1>
          <div className="h-1 w-full bg-terminal-accent/30 mb-6"></div>
          <p className="text-terminal-muted text-sm">
            A journey into mind patterns and cognitive tendencies
          </p>
        </header>
        <ConversationEngine />
      </div>
    </motion.div>
  );
};

export default Index;
