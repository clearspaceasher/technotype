export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok',
    env_debug: {
      openai_key_exists: !!process.env.OPENAI_API_KEY,
      openai_key_length: process.env.OPENAI_API_KEY?.length,
      openai_key_prefix: process.env.OPENAI_API_KEY?.substring(0, 4)
    }
  });
} 