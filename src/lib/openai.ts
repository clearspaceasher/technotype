import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only use this in development
});

export interface QuizAnswer {
  question: string;
  answer: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TechnotypeResult {
  technotype: string;
  description: string;
}

// Function to generate technotype from quiz answers
export async function generateTechnotypeFromQuiz(answers: QuizAnswer[]): Promise<TechnotypeResult> {
  const prompt = `Based on the following answers to a technology personality quiz, generate a unique technotype and description that best matches the user's preferences and behavior:

${answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')}

Please provide:
1. A creative, unique technotype name (2-3 words) that captures their essence
2. A concise description (2-3 sentences) explaining why this technotype fits them, based on their answers

The description should be:
- Clear and easy to understand
- Focused on their unique relationship with technology
- Highlight their key traits and preferences
- Be encouraging and positive

Format the response as JSON with "technotype" and "description" fields.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content || '{}');
}

// Function to generate next question in conversation
export async function generateNextQuestion(
  conversationHistory: ConversationMessage[],
  currentQuestionCount: number
): Promise<string> {
  // If this is the first question (no conversation history), return a fixed question
  if (conversationHistory.length === 0) {
    return "How do you typically start your day with technology?";
  }

  const prompt = `You are an AI conducting a technology personality assessment conversation. 
The goal is to understand the user's relationship with technology and build a comprehensive technotype profile.
You have asked ${currentQuestionCount} questions so far.

Previous conversation:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Generate ONE engaging question that will help build the user's technotype profile. 
The question should be:
- Concise and easy to answer (1-2 sentences max)
- Relevant to the conversation so far
- Thought-provoking but not too complex
- Have a stoic, logical, slightly robotic tone
- Focused on technology habits, preferences, or feelings

Format your response as two lines:
First line: A brief, logical observation or analysis of the previous response
Second line: The actual question, without quotes

Example good responses:
Your preference for offline activities indicates a balanced approach to technology.
How do you prioritize digital and analog activities in your daily routine?

Your response suggests a systematic approach to digital organization.
What is your preferred method for managing digital information?

Your answer reveals a pragmatic relationship with technology.
How do you measure the effectiveness of your technology usage?

Avoid:
- Questions requiring long explanations
- Overly technical terminology
- Emotional or personal inquiries
- Vague or ambiguous phrasing

Maintain a consistent, logical, slightly robotic tone throughout.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
    temperature: 0.7
  });

  return completion.choices[0].message.content || '';
}

// Function to generate technotype from conversation
export async function generateTechnotypeFromConversation(
  conversationHistory: ConversationMessage[]
): Promise<TechnotypeResult> {
  const prompt = `Based on the following conversation about technology preferences and behavior, generate a unique technotype and description that best matches the user's personality:

${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Please provide:
1. A creative, unique technotype name (2-3 words) that captures their essence
2. A concise description (2-3 sentences) explaining why this technotype fits them, based on the conversation

The description should be:
- Clear and easy to understand
- Focused on their unique relationship with technology
- Highlight their key traits and preferences
- Be encouraging and positive

Format the response as JSON with "technotype" and "description" fields.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content || '{}');
} 