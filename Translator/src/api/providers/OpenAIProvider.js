import { ILLMProvider } from './ILLMProvider';

/**
 * OpenAI Provider (GPT-4o, O1, etc.)
 */
export class OpenAIProvider extends ILLMProvider {
  constructor(apiKey) {
    super(apiKey);
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }

  validateApiKey() {
    // OpenAI keys typically start with "sk-"
    return this.apiKey && this.apiKey.startsWith('sk-');
  }

  async generateContent(prompt, modelId = 'gpt-4o') {
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

        throw new Error(
          `OpenAI API error (${response.status}): ${errorData.error?.message || errorData.message || 'Unknown error'}`
        );
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }

      throw new Error('Unexpected response format from OpenAI API');
      
    } catch (error) {
      throw new Error(`OpenAI request failed: ${error.message}`);
    }
  }
}
