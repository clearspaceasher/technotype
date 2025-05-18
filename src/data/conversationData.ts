
export type CharacterClass = 
  | 'Observer'
  | 'Catalyst'
  | 'Weaver'
  | 'Architect'
  | 'Mediator';

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
    text: "SYSTEM INITIALIZING...\n\nWelcome to the archetype discovery process.\n\nLet's explore how your mind works.",
    options: [
      {
        text: "Begin",
        nextNodeId: "welcome",
      },
    ],
  },
  welcome: {
    id: "welcome",
    text: "I am ECHO, a pattern-recognition system. Through our conversation, I'll help identify your cognitive archetype—the unique way you process the world. There are no right answers here, only honest ones.",
    options: [
      {
        text: "I'm ready to explore.",
        nextNodeId: "question1",
      },
      {
        text: "Why identify archetypes?",
        nextNodeId: "why_classify",
      },
    ],
  },
  why_classify: {
    id: "why_classify",
    text: "Understanding your cognitive patterns offers insight into how you naturally approach situations. We all have different ways of thinking, each with its own strengths. This exploration helps reveal those patterns.",
    options: [
      {
        text: "That makes sense. Let's continue.",
        nextNodeId: "question1",
      }
    ],
  },
  question1: {
    id: "question1",
    text: "Scenario 1: You find yourself in an unexpected situation with two possible paths forward. How do you typically proceed?",
    options: [
      {
        text: "I observe patterns and variables before making a calculated decision.",
        nextNodeId: "question2",
        classWeight: {
          Observer: 2,
          Architect: 1,
        },
      },
      {
        text: "I trust my instincts and act decisively in the moment.",
        nextNodeId: "question2",
        classWeight: {
          Catalyst: 2,
          Observer: -1,
        },
      },
      {
        text: "I find the hidden third option that others might miss.",
        nextNodeId: "question2",
        classWeight: {
          Weaver: 2,
          Mediator: -1,
        },
      },
      {
        text: "I analyze the systems at play and optimize my approach.",
        nextNodeId: "question2",
        classWeight: {
          Architect: 2,
        },
      },
      {
        text: "I consider how my choice affects everyone involved.",
        nextNodeId: "question2",
        classWeight: {
          Mediator: 2,
          Catalyst: -1,
        },
      },
    ],
  },
  question2: {
    id: "question2",
    text: "Scenario 2: You encounter a complex problem that others have struggled to solve. What's your approach?",
    options: [
      {
        text: "I gather all available information and look for overlooked patterns.",
        nextNodeId: "question3",
        classWeight: {
          Observer: 2,
        },
      },
      {
        text: "I try something unconventional that disrupts the usual way of thinking.",
        nextNodeId: "question3",
        classWeight: {
          Catalyst: 2,
          Weaver: -1,
        },
      },
      {
        text: "I connect seemingly unrelated concepts to create a new perspective.",
        nextNodeId: "question3",
        classWeight: {
          Weaver: 2,
        },
      },
      {
        text: "I break down the problem into components and rebuild a solution methodically.",
        nextNodeId: "question3",
        classWeight: {
          Architect: 2,
          Catalyst: -1,
        },
      },
      {
        text: "I bring people together to find consensus and collaborate on a solution.",
        nextNodeId: "question3",
        classWeight: {
          Mediator: 2,
          Observer: -1,
        },
      },
    ],
  },
  question3: {
    id: "question3",
    text: "Scenario 3: You discover something important that contradicts what others believe. How do you respond?",
    options: [
      {
        text: "I document my findings meticulously before sharing my conclusions.",
        nextNodeId: "final",
        classWeight: {
          Observer: 2,
        },
      },
      {
        text: "I present my discovery immediately to spark necessary change.",
        nextNodeId: "final",
        classWeight: {
          Catalyst: 2,
          Weaver: -1,
        },
      },
      {
        text: "I explore how this new information connects to other domains of knowledge.",
        nextNodeId: "final",
        classWeight: {
          Weaver: 2,
        },
      },
      {
        text: "I develop a framework that integrates both the old and new understanding.",
        nextNodeId: "final",
        classWeight: {
          Architect: 2,
        },
      },
      {
        text: "I find ways to introduce the idea gently to minimize resistance.",
        nextNodeId: "final",
        classWeight: {
          Mediator: 2,
          Catalyst: -1,
        },
      },
    ],
  },
  final: {
    id: "final",
    text: "Thank you for your responses. Analyzing your cognitive patterns...",
    options: [
      {
        text: "Continue",
        nextNodeId: "results",
      },
    ],
  },
  results: {
    id: "results",
    text: "Analysis complete. Your responses reveal a distinct pattern of thinking—an archetype that shapes how you perceive and interact with the world.",
    options: [
      {
        text: "Reveal my archetype",
        nextNodeId: "class_reveal",
      },
    ],
  },
  class_reveal: {
    id: "class_reveal",
    text: "", // This will be dynamically set based on the calculated class
    options: [
      {
        text: "Tell me more about these tendencies",
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
  Observer: {
    description: "ARCHETYPE: THE OBSERVER\n\nPrimary Tendency: Pattern Recognition\n\nYou naturally step back to watch and analyze. Where others see random events, you perceive the underlying patterns. Your mind excels at collecting data points and forming connections that reveal deeper truths about systems and behaviors.",
    abilities: "COGNITIVE TENDENCIES:\n\n1. Information Synthesis - You excel at gathering diverse information and distilling it to its essence\n2. Pattern Recognition - You naturally identify recurring themes and connections others miss\n3. Predictive Analysis - Your observations often allow you to anticipate outcomes with unusual accuracy\n4. Objective Assessment - You maintain emotional distance when evaluating situations"
  },
  Catalyst: {
    description: "ARCHETYPE: THE CATALYST\n\nPrimary Tendency: Transformation\n\nYou are drawn to action and change. Your mind naturally identifies when and how to apply pressure to transform situations. You're comfortable with disruption when it serves a purpose, and you often provide the spark that initiates necessary change.",
    abilities: "COGNITIVE TENDENCIES:\n\n1. Decisive Action - You quickly move from thought to implementation when conviction strikes\n2. Momentum Building - You excel at creating energy that carries initiatives forward\n3. Comfort with Uncertainty - You navigate changing conditions with unusual ease\n4. Intuitive Timing - You sense the right moment to act for maximum impact"
  },
  Weaver: {
    description: "ARCHETYPE: THE WEAVER\n\nPrimary Tendency: Connection\n\nYour mind naturally bridges disparate concepts. You see relationships between seemingly unrelated ideas and domains. This allows you to create novel solutions by importing frameworks from one context to solve problems in another. Your thinking transcends traditional boundaries.",
    abilities: "COGNITIVE TENDENCIES:\n\n1. Conceptual Integration - You blend ideas from different domains into coherent new frameworks\n2. Metaphorical Thinking - You use analogies to illuminate complex concepts and find hidden parallels\n3. Boundary Transcendence - You move fluidly between different disciplines and perspectives\n4. Emergent Insight - You recognize when combined elements create something greater than their parts"
  },
  Architect: {
    description: "ARCHETYPE: THE ARCHITECT\n\nPrimary Tendency: System Design\n\nYour mind naturally constructs and optimizes systems. You excel at understanding how components interact and creating structures that efficiently achieve objectives. You build mental models that help you navigate complexity with unusual clarity.",
    abilities: "COGNITIVE TENDENCIES:\n\n1. System Optimization - You instinctively identify ways to improve efficiency and effectiveness\n2. Structural Analysis - You quickly grasp how components interact within complex systems\n3. Process Creation - You develop frameworks that translate vision into executable steps\n4. Logical Progression - You build arguments and systems that follow clear, coherent principles"
  },
  Mediator: {
    description: "ARCHETYPE: THE MEDIATOR\n\nPrimary Tendency: Harmonization\n\nYou naturally sense the human dimension in all situations. Your mind seeks balance and understanding between different perspectives. You excel at finding common ground and creating environments where diverse ideas can coexist and synthesize.",
    abilities: "COGNITIVE TENDENCIES:\n\n1. Perspective Integration - You naturally reconcile seemingly contradictory viewpoints\n2. Emotional Navigation - You read subtle social cues and underlying feelings\n3. Value Alignment - You find shared principles that unite people with different positions\n4. Communication Translation - You reframe ideas to resonate with different audiences"
  }
};
