import React, { createContext, useContext, useState, useEffect } from 'react';
import { LLM_MODELS, getDefaultModel } from '@/config/llmModels';
import { secretManager } from '@/utils/secretManager';

const ModelContext = createContext(null);

const SELECTED_MODEL_KEY = 'iris_selected_model';

export function ModelProvider({ children }) {
  const [currentModel, setCurrentModel] = useState(getDefaultModel());
  const [credentialStatuses, setCredentialStatuses] = useState({});

  // Load selected model from localStorage on mount
  useEffect(() => {
    const savedModelId = localStorage.getItem(SELECTED_MODEL_KEY);
    if (savedModelId && LLM_MODELS[savedModelId]) {
      setCurrentModel(LLM_MODELS[savedModelId]);
    }
  }, []);

  // Check credential status for all providers
  useEffect(() => {
    const checkCredentials = () => {
      const statuses = {};
      const providers = ['gemini', 'openai', 'anthropic', 'xai'];
      
      providers.forEach(provider => {
        statuses[provider] = secretManager.hasApiKey(provider);
      });
      
      setCredentialStatuses(statuses);
    };

    checkCredentials();
    
    // Re-check when storage changes (e.g., in another tab)
    window.addEventListener('storage', checkCredentials);
    return () => window.removeEventListener('storage', checkCredentials);
  }, []);

  const selectModel = (modelId) => {
    const model = LLM_MODELS[modelId];
    if (!model) {
      console.error('Model not found:', modelId);
      return false;
    }

    // Check if credentials exist for premium models
    if (model.requiresApiKey && !credentialStatuses[model.provider]) {
      return false; // Caller should show credential modal
    }

    setCurrentModel(model);
    localStorage.setItem(SELECTED_MODEL_KEY, modelId);
    return true;
  };

  const refreshCredentialStatus = () => {
    const statuses = {};
    const providers = ['gemini', 'openai', 'anthropic', 'xai'];
    
    providers.forEach(provider => {
      statuses[provider] = secretManager.hasApiKey(provider);
    });
    
    setCredentialStatuses(statuses);
  };

  const getConnectionStatus = (provider) => {
    return credentialStatuses[provider] || false;
  };

  const value = {
    currentModel,
    selectModel,
    availableModels: LLM_MODELS,
    credentialStatuses,
    getConnectionStatus,
    refreshCredentialStatus,
  };

  return (
    <ModelContext.Provider value={value}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
}
