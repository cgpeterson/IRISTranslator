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
    // Anthropic keys typically start with "sk-ant-"
    return this.apiKey && this.apiKey.startsWith('sk-ant-');
  }

  async generateContent(prompt, modelId = 'claude-3.5-sonnet') {
    try {
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
              content: prompt
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

        throw new Error(
          `Anthropic API error (${response.status}): ${errorData.error?.message || errorData.message || 'Unknown error'}`
        );
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
