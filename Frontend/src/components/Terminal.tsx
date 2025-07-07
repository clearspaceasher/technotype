
import React from "react";
import { useNavigate } from "react-router-dom";

interface TerminalProps {
  children: React.ReactNode;
}

const Terminal: React.FC<TerminalProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/');
  };

  return (
    <div className="w-full h-full bg-black p-4 md:p-6 overflow-y-auto">
      <div className="flex flex-col space-y-1 mb-3">
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full bg-red-500 mr-2 cursor-pointer hover:bg-red-400 transition-colors"
            onClick={handleExit}
            title="exit/restart"
          ></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="border-b border-terminal-accent/30"></div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default Terminal;
