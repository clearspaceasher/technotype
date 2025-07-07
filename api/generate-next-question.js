import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is missing in environment variables!');
      return res.status(500).json({ error: 'OPENAI_API_KEY is missing in environment variables!' });
    }

    const { conversationHistory, currentQuestionCount } = req.body;
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const prompt = `You are an AI conducting a technology personality assessment conversation. 
The goal is to understand the user's relationship with technology.
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

Respond with ONLY the next question, and nothing else. Do not include any commentary, analysis, or extra lines. Just the question.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7
    });

    res.json(completion.choices[0].message.content || '');
  } catch (error) {
    console.error('Error:', error);
    if (error.stack) console.error(error.stack);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
} 