// Types for API requests and responses
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

const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to check if server is running
async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Helper function to make API calls with retry logic
async function makeApiCall<T>(
  endpoint: string, 
  body: any, 
  retries: number = 2
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === retries) {
        // Check if server is running
        const serverRunning = await checkServerHealth();
        if (!serverRunning) {
          throw new Error('Backend server is not running. Please start the server first.');
        }
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw new Error('Request failed after multiple attempts');
}

// Function to generate technotype from quiz answers
export async function generateTechnotypeFromQuiz(answers: QuizAnswer[]): Promise<TechnotypeResult> {
  try {
    return await makeApiCall<TechnotypeResult>('/generate-technotype-quiz', { answers });
  } catch (error) {
    console.error('Failed to generate technotype from quiz:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate technotype from quiz');
  }
}

// Function to generate next question in conversation
export async function generateNextQuestion(
  conversationHistory: ConversationMessage[],
  currentQuestionCount: number
): Promise<string> {
  try {
    return await makeApiCall<string>('/generate-next-question', { conversationHistory, currentQuestionCount });
  } catch (error) {
    console.error('Failed to generate next question:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate next question');
  }
}

// Function to generate technotype from conversation
export async function generateTechnotypeFromConversation(
  conversationHistory: ConversationMessage[]
): Promise<TechnotypeResult> {
  try {
    return await makeApiCall<TechnotypeResult>('/generate-technotype-conversation', { conversationHistory });
  } catch (error) {
    console.error('Failed to generate technotype from conversation:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate technotype from conversation');
  }
} 