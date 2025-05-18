
import React from "react";
import ConversationEngine from "@/components/ConversationEngine";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-terminal-dark p-4">
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
    </div>
  );
};

export default Index;
