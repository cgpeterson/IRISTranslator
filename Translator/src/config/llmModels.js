/**
 * LLM Model configurations
 * Defines available models (Standard and Premium)
 */

export const LLM_PROVIDERS = {
  GEMINI: 'gemini',
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  XAI: 'xai',
};

export const MODEL_TIERS = {
  STANDARD: 'standard',
  PREMIUM: 'premium',
};

export const LLM_MODELS = {
  // Standard (Free/Default) Models
  'gemini-1.5-flash': {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: LLM_PROVIDERS.GEMINI,
    tier: MODEL_TIERS.STANDARD,
    description: 'Fast and efficient (Default)',
    requiresApiKey: false, // Uses environment variable
    icon: '⚡',
  },

  // Premium Models - Google Gemini
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: LLM_PROVIDERS.GEMINI,
    tier: MODEL_TIERS.PREMIUM,
    description: 'Advanced reasoning and understanding',
    requiresApiKey: true,
    icon: '💎',
  },

  // Premium Models - OpenAI
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: LLM_PROVIDERS.OPENAI,
    tier: MODEL_TIERS.PREMIUM,
    description: 'Latest GPT-4 with vision',
    requiresApiKey: true,
    icon: '🤖',
  },
  'o1-preview': {
    id: 'o1-preview',
    name: 'O1 Preview',
    provider: LLM_PROVIDERS.OPENAI,
    tier: MODEL_TIERS.PREMIUM,
    description: 'Advanced reasoning model',
    requiresApiKey: true,
    icon: '🧠',
  },

  // Premium Models - Anthropic
  'claude-3-5-sonnet-20241022': {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: LLM_PROVIDERS.ANTHROPIC,
    tier: MODEL_TIERS.PREMIUM,
    description: 'Most intelligent Claude model',
    requiresApiKey: true,
    icon: '🎭',
  },

  // Premium Models - xAI (Grok)
  'grok-beta': {
    id: 'grok-beta',
    name: 'Grok Beta',
    provider: LLM_PROVIDERS.XAI,
    tier: MODEL_TIERS.PREMIUM,
    description: 'Real-time knowledge with humor',
    requiresApiKey: true,
    icon: '🚀',
  },
  'grok-2': {
    id: 'grok-2',
    name: 'Grok 2',
    provider: LLM_PROVIDERS.XAI,
    tier: MODEL_TIERS.PREMIUM,
    description: 'Latest Grok model',
    requiresApiKey: true,
    icon: '🚀',
  },
};

/**
 * Get models by tier
 */
export function getModelsByTier(tier) {
  return Object.values(LLM_MODELS).filter(model => model.tier === tier);
}

/**
 * Get models by provider
 */
export function getModelsByProvider(provider) {
  return Object.values(LLM_MODELS).filter(model => model.provider === provider);
}

/**
 * Get default model
 */
export function getDefaultModel() {
  return LLM_MODELS['gemini-1.5-flash'];
}

/**
 * Provider display information
 */
export const PROVIDER_INFO = {
  [LLM_PROVIDERS.GEMINI]: {
    name: 'Google Gemini',
    keyPlaceholder: 'Enter your Gemini API key',
    keyPrefix: 'AIza',
    getKeyUrl: 'https://makersuite.google.com/app/apikey',
    icon: '💎',
  },
  [LLM_PROVIDERS.OPENAI]: {
    name: 'OpenAI',
    keyPlaceholder: 'Enter your OpenAI API key',
    keyPrefix: 'sk-',
    getKeyUrl: 'https://platform.openai.com/api-keys',
    icon: '🤖',
  },
  [LLM_PROVIDERS.ANTHROPIC]: {
    name: 'Anthropic',
    keyPlaceholder: 'Enter your Anthropic API key',
    keyPrefix: 'sk-ant-',
    getKeyUrl: 'https://console.anthropic.com/',
    icon: '🎭',
  },
  [LLM_PROVIDERS.XAI]: {
    name: 'xAI (Grok)',
    keyPlaceholder: 'Enter your xAI API key',
    keyPrefix: 'xai-',
    getKeyUrl: 'https://console.x.ai/',
    icon: '🚀',
  },
};
