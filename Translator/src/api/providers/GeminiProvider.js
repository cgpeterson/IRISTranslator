import { ILLMProvider } from './ILLMProvider';

/**
 * Google Gemini Provider
 */
export class GeminiProvider extends ILLMProvider {
  constructor(apiKey) {
    super(apiKey);
    this.cachedBaseUrl = null;
  }

  validateApiKey() {
    // Gemini keys typically start with "AIza"
    return this.apiKey && this.apiKey.startsWith('AIza');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async resolveModelUrl(modelId = 'gemini-1.5-flash') {
    if (this.cachedBaseUrl) return this.cachedBaseUrl;

    try {
      const listResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`
      );
      
      if (!listResponse.ok) {
        throw new Error('Failed to list models');
      }

      const data = await listResponse.json();
      const models = data.models || [];

      // Find the requested model or fall back to flash
      let selectedModel = `models/${modelId}`;
      const modelExists = models.find(m => m.name === selectedModel);
      
      if (!modelExists) {
        // Fallback to flash model
        const flashModels = models.filter(m => 
          m.name.toLowerCase().includes('flash') && 
          m.supportedGenerationMethods && 
          m.supportedGenerationMethods.includes('generateContent')
        );
        
        if (flashModels.length > 0) {
          selectedModel = flashModels[0].name;
        } else {
          selectedModel = 'models/gemini-1.5-flash';
        }
      }

      this.cachedBaseUrl = `https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent`;
      return this.cachedBaseUrl;

    } catch (error) {
      console.warn('Model resolution failed, using default.', error);
      this.cachedBaseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;
      return this.cachedBaseUrl;
    }
  }

  async generateContent(prompt, modelId = 'gemini-1.5-flash') {
    const maxRetries = 3;
    let attempt = 0;
    let lastError = null;

    while (attempt < maxRetries) {
      try {
        const currentUrl = await this.resolveModelUrl(modelId);

        const response = await fetch(`${currentUrl}?key=${this.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192,
            }
          }),
        });

        if (response.status === 503) {
          attempt++;
          console.warn(`Gemini 503 Overloaded. Retrying attempt ${attempt}/${maxRetries}...`);
          await this.delay(1000 * attempt);
          continue;
        }

        if (!response.ok) {
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { message: errorText };
          }

          throw new Error(
            `Gemini API error (${response.status}): ${errorData.error?.message || errorData.message || 'Unknown error'}`
          );
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
          const content = data.candidates[0].content;
          if (content && content.parts && content.parts.length > 0) {
            return content.parts[0].text;
          }
        }

        throw new Error('Unexpected response format from Gemini API');
        
      } catch (error) {
        lastError = error;
        if (attempt >= maxRetries - 1) break;
        
        attempt++;
        console.warn(`Network error. Retrying attempt ${attempt}/${maxRetries}...`);
        await this.delay(1000 * attempt);
      }
    }

    throw new Error(`Gemini request failed after ${maxRetries} attempts: ${lastError?.message}`);
  }
}
