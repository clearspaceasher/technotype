
export type CharacterClass = 
  | 'Tactician'
  | 'Berserker'
  | 'Shadow'
  | 'Technomancer'
  | 'Diplomat';

export interface ConversationNode {
  id: string;
  text: string;
  options: Array<{
    text: string;
    nextNodeId: string;
    classWeight?: Partial<Record<CharacterClass, number>>;
  }>;
  audio?: string;
}

export type ConversationGraph = Record<string, ConversationNode>;

// Define our conversation flow
export const conversationData: ConversationGraph = {
  intro: {
    id: "intro",
    text: "SYSTEM ONLINE. INITIATING PERSONALITY ASSESSMENT PROTOCOL...\n\nSubject status: UNKNOWN\nClearance: LEVEL 3\nMission objective: PROFILE DETERMINATION",
    options: [
      {
        text: "Continue",
        nextNodeId: "welcome",
      },
    ],
  },
  welcome: {
    id: "welcome",
    text: "Welcome, operative. I am AXIS, your assignment AI. Before deployment, I need to determine your optimal role in the field. Answer honestly.",
    options: [
      {
        text: "I'm ready. Let's begin.",
        nextNodeId: "question1",
      },
      {
        text: "Why do I need classification?",
        nextNodeId: "why_classify",
      },
    ],
  },
  why_classify: {
    id: "why_classify",
    text: "Classification optimizes mission success. Each operative has natural inclinations and strengths. I analyze your decision patterns to identify your optimal tactical profile.",
    options: [
      {
        text: "Understood. I'm ready now.",
        nextNodeId: "question1",
      }
    ],
  },
  question1: {
    id: "question1",
    text: "Scenario 1: Your team is ambushed during extraction. Two escape routes exist. How do you proceed?",
    options: [
      {
        text: "Analyze terrain and enemy patterns to determine optimal path.",
        nextNodeId: "question2",
        classWeight: {
          Tactician: 2,
          Technomancer: 1,
        },
      },
      {
        text: "Charge through the weakest point in their line, creating chaos.",
        nextNodeId: "question2",
        classWeight: {
          Berserker: 2,
          Tactician: -1,
        },
      },
      {
        text: "Slip away unnoticed through the shadows while creating a diversion.",
        nextNodeId: "question2",
        classWeight: {
          Shadow: 2,
          Diplomat: -1,
        },
      },
      {
        text: "Deploy tech countermeasures to blind enemies and secure escape.",
        nextNodeId: "question2",
        classWeight: {
          Technomancer: 2,
        },
      },
      {
        text: "Negotiate with the ambush leader for safe passage.",
        nextNodeId: "question2",
        classWeight: {
          Diplomat: 2,
          Berserker: -1,
        },
      },
    ],
  },
  question2: {
    id: "question2",
    text: "Scenario 2: A high-value asset is being held in a fortified compound. Your approach?",
    options: [
      {
        text: "Develop a precise entry and extraction plan with contingencies.",
        nextNodeId: "question3",
        classWeight: {
          Tactician: 2,
        },
      },
      {
        text: "Launch a direct assault when they least expect it.",
        nextNodeId: "question3",
        classWeight: {
          Berserker: 2,
          Shadow: -1,
        },
      },
      {
        text: "Infiltrate silently, leaving no trace of your presence.",
        nextNodeId: "question3",
        classWeight: {
          Shadow: 2,
        },
      },
      {
        text: "Hack their systems to create access points and blindspots.",
        nextNodeId: "question3",
        classWeight: {
          Technomancer: 2,
          Berserker: -1,
        },
      },
      {
        text: "Pose as a negotiator to gain access through the front door.",
        nextNodeId: "question3",
        classWeight: {
          Diplomat: 2,
          Shadow: -1,
        },
      },
    ],
  },
  question3: {
    id: "question3",
    text: "Scenario 3: You discover a double agent in your ranks. Your response?",
    options: [
      {
        text: "Carefully collect evidence and orchestrate a controlled exposure.",
        nextNodeId: "final",
        classWeight: {
          Tactician: 2,
        },
      },
      {
        text: "Confront them directly and decisively.",
        nextNodeId: "final",
        classWeight: {
          Berserker: 2,
          Shadow: -1,
        },
      },
      {
        text: "Monitor them secretly to uncover their entire network.",
        nextNodeId: "final",
        classWeight: {
          Shadow: 2,
        },
      },
      {
        text: "Plant false intelligence and track the information flow.",
        nextNodeId: "final",
        classWeight: {
          Technomancer: 2,
        },
      },
      {
        text: "Turn them into a triple agent working for your side.",
        nextNodeId: "final",
        classWeight: {
          Diplomat: 2,
          Berserker: -1,
        },
      },
    ],
  },
  final: {
    id: "final",
    text: "Analysis complete. Processing profile...",
    options: [
      {
        text: "View results",
        nextNodeId: "results",
      },
    ],
  },
  results: {
    id: "results",
    text: "Based on your responses, your operative classification has been determined.",
    options: [
      {
        text: "Reveal my class",
        nextNodeId: "class_reveal",
      },
    ],
  },
  class_reveal: {
    id: "class_reveal",
    text: "", // This will be dynamically set based on the calculated class
    options: [
      {
        text: "Tell me more about my abilities",
        nextNodeId: "abilities",
      },
      {
        text: "Start over",
        nextNodeId: "intro",
      },
    ],
  },
  abilities: {
    id: "abilities",
    text: "", // This will be dynamically set based on the calculated class
    options: [
      {
        text: "Start over",
        nextNodeId: "intro",
      },
    ],
  },
};

export const classDescriptions: Record<CharacterClass, { description: string, abilities: string }> = {
  Tactician: {
    description: "CLASS: TACTICIAN\n\nPrimary Function: Strategic Command\n\nYou perceive the battlefield as a complex system of variables. Your mind naturally calculates probabilities, identifies patterns, and develops multi-layered plans. You anticipate enemy movements before they occur and position your team for optimal advantage.",
    abilities: "ABILITIES:\n\n1. Battlefield Analysis - Rapidly identify tactical advantages in any environment\n2. Strategic Deployment - Optimize team positioning for maximum effectiveness\n3. Contingency Planning - Develop backup strategies that anticipate mission variables\n4. Command Presence - Enhance team coordination and execution efficiency"
  },
  Berserker: {
    description: "CLASS: BERSERKER\n\nPrimary Function: Frontline Assault\n\nYou are a force of nature, channeling controlled aggression into devastating combat effectiveness. When others retreat, you advance. Your presence on the battlefield generates fear in enemies and confidence in allies. Few can match your raw combat potential.",
    abilities: "ABILITIES:\n\n1. Overwhelming Force - Channel aggression into devastating close-quarters combat\n2. Intimidation Tactics - Demoralize enemies through aggressive action\n3. Adrenaline Control - Maintain peak combat performance under extreme pressure\n4. Shock Assault - Break enemy formations and create tactical opportunities"
  },
  Shadow: {
    description: "CLASS: SHADOW\n\nPrimary Function: Covert Operations\n\nYou exist in the spaces between perception. Stealth is not just your skill—it's your state of being. You can infiltrate secured locations, gather intelligence, and eliminate targets without leaving a trace. Your greatest victories are the ones no one will ever know about.",
    abilities: "ABILITIES:\n\n1. Ghost Protocol - Move undetected through monitored environments\n2. Infiltration Expertise - Bypass security systems without triggering alerts\n3. Silent Elimination - Remove threats without revealing your presence\n4. Information Extraction - Gather intelligence from secured sources"
  },
  Technomancer: {
    description: "CLASS: TECHNOMANCER\n\nPrimary Function: Technical Warfare\n\nYou speak the language of machines fluently. Complex systems reveal their secrets to you, and you can bend networks to your will. On the modern battlefield, where everything is connected, you control the invisible infrastructure that determines victory.",
    abilities: "ABILITIES:\n\n1. System Intrusion - Hack into secured networks with unprecedented speed\n2. Electronic Warfare - Disrupt enemy communications and technological systems\n3. Drone Mastery - Deploy and control automated systems for reconnaissance and combat\n4. Adaptive Programming - Create custom solutions for unforeseen technical challenges"
  },
  Diplomat: {
    description: "CLASS: DIPLOMAT\n\nPrimary Function: Human Intelligence\n\nYou understand people at a fundamental level. You can read subtle behavioral cues, build rapport with diverse personalities, and navigate complex social dynamics. In a world of sensors and surveillance, human connection remains the most powerful intelligence tool.",
    abilities: "ABILITIES:\n\n1. Behavioral Analysis - Instantly read intentions and emotional states\n2. Persuasive Communication - Influence targets through precise psychological tactics\n3. Identity Crafting - Assume convincing covers and personas as needed\n4. Network Development - Build and maintain valuable human intelligence sources"
  }
};
