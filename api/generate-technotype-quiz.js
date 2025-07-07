import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { answers } = req.body;
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const prompt = `Based on the following quiz answers, generate a technotype personality profile:

Quiz Answers:
${answers.map((answer, index) => `${index + 1}. ${answer.question}: ${answer.answer}`).join('\n')}

Generate a technotype result with:
1. A technotype name (e.g., "Digital Nomad", "Tech Traditionalist", "Cyber Explorer")
2. A detailed description of this technotype (2-3 paragraphs)

Format your response as JSON:
{
  "technotype": "Technotype Name",
  "description": "Detailed description..."
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7
    });

    const content = completion.choices[0].message.content || '';
    
    try {
      const result = JSON.parse(content);
      res.json(result);
    } catch (parseError) {
      res.json({
        technotype: "Digital Explorer",
        description: content || "A technology enthusiast who embraces digital innovation and adapts quickly to new tools and platforms."
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      details: error.message,
      technotype: "Digital Explorer",
      description: "A technology enthusiast who embraces digital innovation and adapts quickly to new tools and platforms."
    });
  }
} 