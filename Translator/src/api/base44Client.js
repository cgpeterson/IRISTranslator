// Multi-Provider LLM Client (Gemini, OpenAI, Anthropic, xAI) with Dynamic Model Selection and Retry Logic
import { ProviderFactory } from './providers/ProviderFactory';
import { secretManager } from '@/utils/secretManager';
import { LLM_MODELS } from '@/config/llmModels';

class GeminiClient {
  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.cachedBaseUrl = null; // Store the URL here after we find it once
  }

  // Helper: Pauses execution for a set time
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper to find the best available model
  async resolveModelUrl() {
    // 1. Return cached URL if we already found it
    if (this.cachedBaseUrl) return this.cachedBaseUrl;

    try {
      // 2. Ask Google what models are available
      const listResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${this.geminiApiKey}`
      );
      
      if (!listResponse.ok) {
        throw new Error('Failed to list models');
      }

      const data = await listResponse.json();
      const models = data.models || [];

      // 3. Find the newest "Flash" model that supports content generation
      // We look for models containing "flash" and supporting "generateContent"
      const flashModels = models.filter(m => 
        m.name.toLowerCase().includes('flash') && 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent')
      );

      // Sort by version number (descending) so we get the highest number (e.g., 2.5 > 1.5)
      flashModels.sort((a, b) => {
        // Extract version numbers from model names like "models/gemini-1.5-flash"
        const versionRegex = /(\d+\.?\d*)/g;
        const versionsA = a.name.match(versionRegex);
        const versionsB = b.name.match(versionRegex);
        
        const versionA = versionsA ? parseFloat(versionsA[0]) : 0;
        const versionB = versionsB ? parseFloat(versionsB[0]) : 0;
        
        return versionB - versionA;
      });

      // Default fallback if no flash model is found
      let selectedModel = 'models/gemini-1.5-flash'; 
      
      if (flashModels.length > 0) {
        selectedModel = flashModels[0].name;
        console.log(`Dynamically selected model: ${selectedModel}`);
      } else {
        console.warn('No Flash model found, using default: gemini-1.5-flash');
      }

      // 4. Construct and cache the URL
      this.cachedBaseUrl = `https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent`;
      return this.cachedBaseUrl;

    } catch (error) {
      console.warn('Model resolution failed, falling back to hardcoded default.', error);
      // Fallback to a safe default if the List request fails
      this.cachedBaseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
      return this.cachedBaseUrl;
    }
  }

  integrations = {
    Core: {
      InvokeLLM: async ({ prompt, modelId = 'gemini-1.5-flash', sentenceLimit = null }) => {
        try {
          // Get the model configuration
          const model = LLM_MODELS[modelId];
          if (!model) {
            return `ERROR: Unknown model: ${modelId}`;
          }

          // Get API key - either from user's storage or environment variable
          let apiKey;
          if (model.requiresApiKey) {
            apiKey = await secretManager.getApiKey(model.provider);
            if (!apiKey) {
              return `ERROR: API key not configured for ${model.name}.

Please add your ${model.name} API key:

1. Click the model selector in the top-right corner
2. Select a premium model to open the credentials dialog
3. Add your ${model.name} API key
4. Try again

Your API keys are encrypted and stored securely in your browser.`;
            }
          } else {
            // Use environment variable for default models
            if (model.provider === 'gemini') {
              apiKey = this.geminiApiKey;
              if (!apiKey) {
                return `ERROR: Gemini API key not configured.

Please set VITE_GEMINI_API_KEY in your environment variables.

For Vercel deployment:
1. Go to Project Settings → Environment Variables
2. Add: VITE_GEMINI_API_KEY = your_api_key_here
3. Redeploy your application

For local development:
1. Create a .env file in the Translator directory
2. Add: VITE_GEMINI_API_KEY=your_api_key_here
3. Restart the dev server

See SETUP_GEMINI.md for detailed instructions.`;
              }
            }
          }

          // Create provider instance and generate content
          const provider = ProviderFactory.createProvider(model.provider, apiKey);
          const result = await provider.generateContent(prompt, modelId, sentenceLimit);
          return result;

        } catch (error) {
          console.error('LLM invocation error:', error);
          return `ERROR: ${error.message}

Please check:
- Your API key is valid
- You have sufficient credits/quota
- The model is available in your region

Error details: ${error.message}`;
        }
      },
    },
  };
}

export const base44 = new GeminiClient();
