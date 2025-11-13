import { ILLMProvider } from './ILLMProvider';

/**
 * xAI Provider (Grok models)
 */
export class XAIProvider extends ILLMProvider {
  constructor(apiKey) {
    super(apiKey);
    this.baseUrl = 'https://api.x.ai/v1/chat/completions';
  }

  validateApiKey() {
    // xAI keys typically start with "xai-" followed by at least 32 alphanumeric characters
    const xaiKeyPattern = /^xai-[a-zA-Z0-9]{32,}$/;
    return typeof this.apiKey === 'string' && xaiKeyPattern.test(this.apiKey);
  }

  async generateContent(prompt, modelId = 'grok-beta') {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        // Log detailed error for debugging
        console.error('xAI API error details:', {
          status: response.status,
          error: errorData.error?.message || errorData.message || errorData
        });

        throw new Error('xAI API request failed. Please check your API key and try again.');
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }

      throw new Error('Unexpected response format from xAI API');
      
    } catch (error) {
      throw new Error(`xAI request failed: ${error.message}`);
    }
  }
}
