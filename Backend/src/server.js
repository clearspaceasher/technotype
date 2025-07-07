import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, existsSync, readFileSync } from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the correct path
const envPath = join(__dirname, '..', '.env.local');
console.log('Loading .env file from:', envPath);

// Clear any existing environment variables that might interfere
delete process.env.OPENAI_API_KEY;
delete process.env.PORT;

// Load environment variables if file exists
if (existsSync(envPath)) {
  console.log('.env.local file found, loading variables...');
  
  // Read the file content to debug
  try {
    const envContent = readFileSync(envPath, 'utf8');
    console.log('Raw .env.local content:');
    console.log(envContent);
  } catch (readError) {
    console.error('Error reading .env.local file:', readError);
  }
  
  const result = dotenv.config({ path: envPath, override: true });
  if (result.error) {
    console.error('Error loading .env file:', result.error);
  } else {
    console.log('Environment variables loaded successfully');
    console.log('Loaded variables:', result.parsed);
  }
} else {
  console.log('.env.local file not found, using system environment variables');
}

// Debug logging for environment variables
console.log('=== ENVIRONMENT VARIABLE DEBUG ===');
console.log('PORT:', process.env.PORT);
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length);
console.log('OPENAI_API_KEY first 4 chars:', process.env.OPENAI_API_KEY?.substring(0, 4));
console.log('OPENAI_API_KEY full value:', process.env.OPENAI_API_KEY);
console.log('Current working directory:', process.cwd());
console.log('Files in current directory:', readdirSync('.'));
console.log('===================================');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    env_debug: {
      openai_key_exists: !!process.env.OPENAI_API_KEY,
      openai_key_length: process.env.OPENAI_API_KEY?.length,
      openai_key_prefix: process.env.OPENAI_API_KEY?.substring(0, 4)
    }
  });
});

// Generate next question endpoint
app.post('/api/generate-next-question', async (req, res) => {
  try {
    const { conversationHistory, currentQuestionCount } = req.body;
    
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
    res.status(500).json({ error: error.message });
  }
});

// Generate technotype from quiz answers endpoint
app.post('/api/generate-technotype-quiz', async (req, res) => {
  try {
    const { answers } = req.body;
    
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
      // If JSON parsing fails, return a structured response
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
});

// Generate technotype from conversation endpoint
app.post('/api/generate-technotype-conversation', async (req, res) => {
  try {
    const { conversationHistory } = req.body;
    
    const prompt = `Based on the following conversation, generate a technotype personality profile:

Conversation:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

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
      // If JSON parsing fails, return a structured response
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
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Health check available at: http://localhost:${port}/api/health`);
}); 