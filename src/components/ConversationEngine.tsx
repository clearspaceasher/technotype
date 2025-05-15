
import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import AnimatedText from "./AnimatedText";
import ConversationOption from "./ConversationOption";
import Terminal from "./Terminal";
import { 
  conversationData, 
  ConversationNode, 
  CharacterClass, 
  classDescriptions 
} from "@/data/conversationData";

const ConversationEngine: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string>("intro");
  const [currentNode, setCurrentNode] = useState<ConversationNode>(conversationData.intro);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<JSX.Element[]>([]);
  const [userClass, setUserClass] = useState<CharacterClass | null>(null);
  const [classScores, setClassScores] = useState<Record<CharacterClass, number>>({
    Tactician: 0,
    Berserker: 0,
    Shadow: 0,
    Technomancer: 0,
    Diplomat: 0,
  });
  
  useEffect(() => {
    // Update current node when ID changes
    setCurrentNode(conversationData[currentNodeId]);
    setShowOptions(false);
  }, [currentNodeId]);

  const handleAnimationComplete = () => {
    setShowOptions(true);
    // Play a subtle sound effect when text animation completes
    const audio = new Audio("/typing-complete.mp3");
    audio.volume = 0.2;
    audio.play().catch(e => console.log("Audio playback prevented:", e));
  };

  const handleOptionClick = (nextNodeId: string, classWeights?: Partial<Record<CharacterClass, number>>) => {
    // Play selection sound
    const audio = new Audio("/option-select.mp3");
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Audio playback prevented:", e));
    
    // Update class scores based on the selected option
    if (classWeights) {
      setClassScores(prevScores => {
        const newScores = { ...prevScores };
        
        // Apply weights to each class score
        Object.entries(classWeights).forEach(([className, weight]) => {
          const classKey = className as CharacterClass;
          newScores[classKey] = (newScores[classKey] || 0) + (weight || 0);
        });
        
        return newScores;
      });
    }
    
    // Add the current exchange to the history
    setConversationHistory(prev => [
      ...prev,
      <div key={`node-${currentNodeId}`} className="mb-6">
        <div className="mb-2 text-terminal-light">
          <span className="text-terminal-accent">&gt; AXIS: </span>
          {currentNode.text}
        </div>
      </div>
    ]);
    
    // Special case for result nodes
    if (nextNodeId === "class_reveal") {
      // Determine the user's class based on the highest score
      const sortedClasses = Object.entries(classScores)
        .sort(([, a], [, b]) => b - a)
        .map(([className]) => className as CharacterClass);
      
      const determinedClass = sortedClasses[0];
      setUserClass(determinedClass);
      
      // Create a custom node with the class reveal text
      const customNode = {
        ...conversationData.class_reveal,
        text: classDescriptions[determinedClass].description
      };
      
      setCurrentNode(customNode);
    } else if (nextNodeId === "abilities" && userClass) {
      // Create a custom node with the abilities text for the determined class
      const customNode = {
        ...conversationData.abilities,
        text: classDescriptions[userClass].abilities
      };
      
      setCurrentNode(customNode);
    } else {
      // Normal case, just move to the next node
      setCurrentNodeId(nextNodeId);
    }
  };

  return (
    <div className="w-full h-full max-w-3xl mx-auto">
      <Terminal>
        {conversationHistory}
        <div className="mb-6">
          <AnimatedText
            text={currentNode.text}
            speed={30}
            className="mb-2 text-terminal-light"
            onComplete={handleAnimationComplete}
          />
          
          {showOptions && currentNode.options.map((option, index) => (
            <ConversationOption
              key={`${currentNodeId}-option-${index}`}
              text={option.text}
              onClick={() => handleOptionClick(option.nextNodeId, option.classWeight)}
            />
          ))}
        </div>
      </Terminal>
    </div>
  );
};

export default ConversationEngine;
