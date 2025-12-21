export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  history: ChatMessage[];
  prompt: string;
  defaultOrigin?: string;
  defaultTransl?: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  tokens: number;
  error?: string;
  details?: string;
}

const API_URL = 'https://nhmrdnczfxomarpncyot.supabase.co/functions/v1/ai-agent-staging';

export const sendChatMessage = async (
  prompt: string,
  history: ChatMessage[],
  token: string,
  defaultOrigin?: string,
  defaultTransl?: string
): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        history,
        prompt,
        defaultOrigin,
        defaultTransl,
      } as ChatRequest),
    });

    const data: ChatResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.details || `HTTP error! status: ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to get AI response');
    }

    return data.response;
  } catch (error) {
    console.error('Chat service error:', error);
    throw error;
  }
};
