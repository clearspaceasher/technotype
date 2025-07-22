import OpenAI from 'openai';

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY?.slice(0, 10), "...", process.env.OPENAI_API_KEY?.length);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY?.trim().replace(/^Bearer\\s+/i, "") });
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Hello" }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      max_tokens: 10
    });
    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
} 