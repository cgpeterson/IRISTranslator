import { GeminiProvider } from './GeminiProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { AnthropicProvider } from './AnthropicProvider';
import { XAIProvider } from './XAIProvider';
import { LLM_PROVIDERS } from '@/config/llmModels';

/**
 * Factory for creating LLM provider instances
 */
export class ProviderFactory {
  static createProvider(provider, apiKey) {
    switch (provider) {
      case LLM_PROVIDERS.GEMINI:
        return new GeminiProvider(apiKey);
      case LLM_PROVIDERS.OPENAI:
        return new OpenAIProvider(apiKey);
      case LLM_PROVIDERS.ANTHROPIC:
        return new AnthropicProvider(apiKey);
      case LLM_PROVIDERS.XAI:
        return new XAIProvider(apiKey);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}
