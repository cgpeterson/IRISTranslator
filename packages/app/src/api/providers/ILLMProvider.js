/**
 * Base LLM Provider Interface
 * All providers must implement these methods
 */
export class ILLMProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Generate content using the LLM
   * @param {string} prompt - The prompt to send to the LLM
   * @param {string} modelId - The specific model ID to use for generation
   * @param {number|null} sentenceLimit - Optional maximum number of sentences for the response (1-99)
   * @param {string|null} systemInstruction - Optional system instruction to guide the model's behavior
   * @returns {Promise<string>} - The generated text
   */
  async generateContent(prompt, modelId, sentenceLimit = null, systemInstruction = null) {
    throw new Error('generateContent() must be implemented by subclass');
  }

  /**
   * Validate the API key format
   * @returns {boolean} - Whether the API key is valid
   */
  validateApiKey() {
    return this.apiKey && this.apiKey.length > 0;
  }
}
