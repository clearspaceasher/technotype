import OpenAI from 'openai';

// Debug: Check if API key is available
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
if (!apiKey) {
  console.error('OpenAI API key is not found in environment variables');
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
});

interface QuizAnswer {
  id: string;
  answer: string;
}

export const generateArchetypeAndDescription = async (answers: QuizAnswer[]): Promise<{ archetype: string; description: string }> => {
  try {
    console.log('Generating archetype and description based on answers:', answers);
    
    // First, generate the archetype based on answers
    const archetypeCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a digital archetype analyzer. Based on the quiz answers, determine the most fitting digital archetype. 
          Choose from these archetypes: The Optimizer, The Skeptic, The Seeker, The Unplugger.
          Return ONLY the archetype name, nothing else.`
        },
        {
          role: "user",
          content: `Based on these quiz answers, what is the most fitting digital archetype?\n${answers.map(a => `${a.id}: ${a.answer}`).join('\n')}`
        }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 50,
      temperature: 0.7,
    });

    const archetype = archetypeCompletion.choices[0]?.message?.content?.trim() || "The Optimizer";

    // Then, generate a description for the determined archetype
    const descriptionCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a digital archetype analyzer. Generate a unique, insightful description of a digital archetype that reflects their relationship with technology. Keep it concise (2-3 sentences) and engaging."
        },
        {
          role: "user",
          content: `Generate a unique description for the digital archetype: ${archetype}. Consider these quiz answers in the description: ${answers.map(a => `${a.id}: ${a.answer}`).join(', ')}`
        }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 150,
      temperature: 0.7,
    });

    return {
      archetype,
      description: descriptionCompletion.choices[0]?.message?.content || "Unable to generate description."
    };
  } catch (error) {
    console.error('Error generating archetype and description:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    return {
      archetype: "The Optimizer",
      description: "Unable to generate description at this time."
    };
  }
}; 