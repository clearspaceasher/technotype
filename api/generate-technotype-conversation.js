import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { conversationHistory } = req.body;
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const prompt = `Based on the following conversation, generate a technotype personality profile:

Conversation:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Generate a technotype result with:
1. A technotype name (e.g., "Digital Nomad", "Tech Traditionalist", "Cyber Explorer")
2. A detailed description of this technotype (2-3 paragraphs)
3. A brief, engaging, one-sentence summary of the technotype for use as a subtitle

Format your response as JSON:
{
  "technotype": "Technotype Name",
  "description": "Detailed description...",
  "summary": "One-sentence summary..."
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
        description: content || "A technology enthusiast who embraces digital innovation and adapts quickly to new tools and platforms.",
        summary: "A curious explorer who thrives on digital innovation."
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