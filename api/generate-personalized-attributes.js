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

    const { technotype, technotypeSummary, conversationHistory, quizAnswers } = req.body;
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY?.trim().replace(/^Bearer\s+/i, "")
    });
    
    const prompt = `Based on the user's technotype profile, generate 8 personalized digital wellbeing attributes for their skill tree.

User's Technotype: ${technotype}
Technotype Summary: ${technotypeSummary}

Generate 8 attributes that are:
1. Specific to this user's technotype and behavior patterns
2. Actionable and practical
3. Concise (2-4 words for title, 1 sentence for suggestion)
4. Relevant to digital wellbeing and technology habits

Format your response as JSON:
{
  "attributes": [
    {
      "title": "Attribute Name",
      "suggestion": "One concise, actionable suggestion for this user"
    }
  ]
}

Make the attributes highly personalized based on their technotype. For example:
- If they're a "Digital Nomad", focus on work-life balance and productivity
- If they're a "Tech Traditionalist", focus on gradual digital adoption
- If they're a "Cyber Explorer", focus on mindful exploration and boundaries

Each attribute should be a specific skill or habit that would benefit this particular user type.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo",
      temperature: 0.7
    });

    const content = completion.choices[0].message.content || '';
    
    try {
      const result = JSON.parse(content);
      res.json(result);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback to default attributes
      res.json({
        attributes: [
          { title: "Digital Focus", suggestion: "Set specific goals for each tech session" },
          { title: "No Screens Before Bed", suggestion: "Stop using devices 1 hour before sleep" },
          { title: "Intentional Usage", suggestion: "Check your phone with purpose, not habit" },
          { title: "Digital Boundaries", suggestion: "Set daily limits on app usage" },
          { title: "Mindful Consumption", suggestion: "Choose content that adds value to your life" },
          { title: "Tech Balance", suggestion: "Spend equal time on digital and analog activities" },
          { title: "Digital Wellness", suggestion: "Take regular breaks from screens" },
          { title: "Smart Habits", suggestion: "Build consistent daily tech routines" }
        ]
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message,
      attributes: [
        { title: "Digital Focus", suggestion: "Set specific goals for each tech session" },
        { title: "No Screens Before Bed", suggestion: "Stop using devices 1 hour before sleep" },
        { title: "Intentional Usage", suggestion: "Check your phone with purpose, not habit" },
        { title: "Digital Boundaries", suggestion: "Set daily limits on app usage" },
        { title: "Mindful Consumption", suggestion: "Choose content that adds value to your life" },
        { title: "Tech Balance", suggestion: "Spend equal time on digital and analog activities" },
        { title: "Digital Wellness", suggestion: "Take regular breaks from screens" },
        { title: "Smart Habits", suggestion: "Build consistent daily tech routines" }
      ]
    });
  }
} 