import { ILLMProvider } from './ILLMProvider';

/**
 * Anthropic Provider (Claude models)
 */
export class AnthropicProvider extends ILLMProvider {
  constructor(apiKey) {
    super(apiKey);
    this.baseUrl = 'https://api.anthropic.com/v1/messages';
  }

  validateApiKey() {
    // Anthropic keys typically start with "sk-ant-" and are followed by at least 32 lowercase alphanumeric characters
    const anthropicKeyRegex = /^sk-ant-[a-z0-9]{32,}$/;
    return typeof this.apiKey === 'string' && anthropicKeyRegex.test(this.apiKey);
  }

  async generateContent(prompt, modelId = 'claude-3-5-sonnet-20241022', sentenceLimit = null, systemInstruction = null) {
    try {
      // Construct the user message
      let userMessage = prompt;
      
      // Prepend custom system instruction if provided
      if (systemInstruction) {
        userMessage = `${systemInstruction}\n\n${prompt}`;
      }
      
      // Add sentence limit instruction if needed
      if (sentenceLimit && sentenceLimit > 0) {
        userMessage = `Please limit your response to exactly ${sentenceLimit} sentence${sentenceLimit === 1 ? '' : 's'}.\n\n${userMessage}`;
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: modelId,
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: userMessage
            }
          ],
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
        console.error('Anthropic API error details:', {
          status: response.status,
          error: errorData.error?.message || errorData.message || errorData
        });

        throw new Error('Anthropic API request failed. Please check your API key and try again.');
      }

      const data = await response.json();
      
      if (data.content && data.content.length > 0) {
        return data.content[0].text;
      }

      throw new Error('Unexpected response format from Anthropic API');
      
    } catch (error) {
      throw new Error(`Anthropic request failed: ${error.message}`);
    }
  }
}
