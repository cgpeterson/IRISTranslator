import React, { createContext, useContext, useState, useEffect } from 'react';

const LLMContext = createContext();

export const LLM_PROVIDERS = {
  BASE44: 'base44',
  OPENAI: 'openai',
  GROK: 'grok',
  GEMINI: 'gemini',
  ANTHROPIC: 'anthropic',
};

export const LLM_PROVIDER_INFO = {
  [LLM_PROVIDERS.BASE44]: {
    name: 'Base44 (Default)',
    icon: '🤖',
    requiresApiKey: false,
  },
  [LLM_PROVIDERS.OPENAI]: {
    name: 'OpenAI (ChatGPT)',
    icon: '🤖',
    requiresApiKey: true,
    apiKeyField: 'openai_api_key',
  },
  [LLM_PROVIDERS.GROK]: {
    name: 'Grok (X.AI)',
    icon: '🚀',
    requiresApiKey: true,
    apiKeyField: 'grok_api_key',
  },
  [LLM_PROVIDERS.GEMINI]: {
    name: 'Google Gemini',
    icon: '💎',
    requiresApiKey: true,
    apiKeyField: 'gemini_api_key',
  },
  [LLM_PROVIDERS.ANTHROPIC]: {
    name: 'Anthropic (Claude)',
    icon: '🧠',
    requiresApiKey: true,
    apiKeyField: 'anthropic_api_key',
  },
};

const STORAGE_KEY = 'translator_llm_settings';

export function LLMProvider({ children }) {
  const [selectedProvider, setSelectedProvider] = useState(LLM_PROVIDERS.BASE44);
  const [apiKeys, setApiKeys] = useState({
    openai_api_key: '',
    grok_api_key: '',
    gemini_api_key: '',
    anthropic_api_key: '',
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { provider, keys } = JSON.parse(stored);
        if (provider) setSelectedProvider(provider);
        if (keys) setApiKeys(keys);
      } catch (error) {
        console.error('Error loading LLM settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  const saveSettings = (provider, keys) => {
    const settings = {
      provider: provider || selectedProvider,
      keys: keys || apiKeys,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  };

  const updateProvider = (provider) => {
    setSelectedProvider(provider);
    saveSettings(provider, apiKeys);
  };

  const updateApiKeys = (keys) => {
    setApiKeys(keys);
    saveSettings(selectedProvider, keys);
  };

  const getApiKeyForProvider = (provider) => {
    const info = LLM_PROVIDER_INFO[provider];
    if (!info || !info.requiresApiKey) return null;
    return apiKeys[info.apiKeyField] || '';
  };

  const hasApiKey = (provider) => {
    const key = getApiKeyForProvider(provider);
    return key && key.trim().length > 0;
  };

  const value = {
    selectedProvider,
    setSelectedProvider: updateProvider,
    apiKeys,
    setApiKeys: updateApiKeys,
    isSettingsOpen,
    setIsSettingsOpen,
    getApiKeyForProvider,
    hasApiKey,
  };

  return <LLMContext.Provider value={value}>{children}</LLMContext.Provider>;
}

export function useLLM() {
  const context = useContext(LLMContext);
  if (!context) {
    throw new Error('useLLM must be used within LLMProvider');
  }
  return context;
}
