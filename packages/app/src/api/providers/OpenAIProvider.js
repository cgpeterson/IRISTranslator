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
    // OpenAI keys must match pattern: sk-[A-Za-z0-9]{48} or newer format
    // Note: OpenAI has updated key formats, so we check for minimum length after prefix
    return typeof this.apiKey === 'string' && 
           this.apiKey.startsWith('sk-') && 
           this.apiKey.length >= 20;
  }

  async generateContent(prompt, modelId = 'gpt-4o', sentenceLimit = null, systemInstruction = null) {
    try {
      // Define base system prompt
      let systemContent = systemInstruction || "You are a helpful assistant.";
      
      // Append limit instruction if exists
      if (sentenceLimit && sentenceLimit > 0) {
        systemContent += ` Answer in exactly ${sentenceLimit} sentence${sentenceLimit === 1 ? '' : 's'}.`;
      }

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
              role: 'system',
              content: systemContent
            },
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
        console.error('OpenAI API error details:', {
          status: response.status,
          error: errorData.error?.message || errorData.message || errorData
        });

        throw new Error('OpenAI API request failed. Please check your API key and try again.');
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
