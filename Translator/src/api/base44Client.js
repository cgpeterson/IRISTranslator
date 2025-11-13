// Free LLM API Client using Hugging Face Inference API
class FreeLLMClient {
  constructor() {
    // Using Hugging Face's free Inference API
    this.baseUrl = 'https://api-inference.huggingface.co/models';
    // Using a free, fast model that doesn't require authentication
    this.model = 'mistralai/Mistral-7B-Instruct-v0.2';
  }

  integrations = {
    Core: {
      InvokeLLM: async ({ prompt }) => {
        try {
          const response = await fetch(`${this.baseUrl}/${this.model}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              inputs: prompt,
              parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
                return_full_text: false
              }
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('LLM API error:', response.status, errorText);
            
            // If model is loading, show helpful message
            if (response.status === 503) {
              return 'The AI model is loading. Please try again in a few moments...';
            }
            
            throw new Error(`API request failed: ${response.status}`);
          }

          const data = await response.json();
          
          // Handle Hugging Face response format
          if (Array.isArray(data) && data.length > 0) {
            return data[0].generated_text || String(data[0]);
          }
          
          return data.generated_text || data.result || data.text || String(data);
        } catch (error) {
          console.error('InvokeLLM error:', error);
          
          // Provide fallback for network errors
          if (error.message.includes('Failed to fetch')) {
            return 'Unable to connect to translation service. Please check your internet connection.';
          }
          
          throw error;
        }
      },
    },
  };
}

export const base44 = new FreeLLMClient();
