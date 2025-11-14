import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LLM_MODELS, getDefaultModel, LLM_PROVIDERS } from '@/config/llmModels';
import { secretManager } from '@/utils/secretManager';

const ModelContext = createContext(null);

const SELECTED_MODEL_KEY = 'iris_selected_model';
const SENTENCE_LIMIT_KEY = 'iris_sentence_limit';
const RETRY_SETS_KEY = 'iris_retry_sets';
const PROVIDER_KEYS = Object.values(LLM_PROVIDERS);

export function ModelProvider({ children }) {
  const [currentModel, setCurrentModel] = useState(getDefaultModel());
  const [credentialStatuses, setCredentialStatuses] = useState({});
  const [sentenceLimit, setSentenceLimit] = useState(() => {
    const saved = localStorage.getItem(SENTENCE_LIMIT_KEY);
    return saved ? parseInt(saved, 10) : null;
  });
  const [retrySets, setRetrySets] = useState(() => {
    const saved = localStorage.getItem(RETRY_SETS_KEY);
    return saved ? parseInt(saved, 10) : 1; // Default to 1 set (3 retries)
  });

  // Load selected model from localStorage on mount
  useEffect(() => {
    const savedModelId = localStorage.getItem(SELECTED_MODEL_KEY);
    if (savedModelId && LLM_MODELS[savedModelId]) {
      setCurrentModel(LLM_MODELS[savedModelId]);
    }
  }, []);

  // Stable reference for credential checking
  const checkCredentials = useCallback(() => {
    const statuses = {};
    
    PROVIDER_KEYS.forEach(provider => {
      statuses[provider] = secretManager.hasApiKey(provider);
    });
    
    setCredentialStatuses(statuses);
  }, []);

  // Check credential status for all providers
  useEffect(() => {
    checkCredentials();
    
    // Re-check when storage changes (e.g., in another tab)
    window.addEventListener('storage', checkCredentials);
    return () => window.removeEventListener('storage', checkCredentials);
  }, [checkCredentials]);

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

  const refreshCredentialStatus = useCallback(() => {
    checkCredentials();
  }, [checkCredentials]);

  const getConnectionStatus = (provider) => {
    return credentialStatuses[provider] || false;
  };

  const updateSentenceLimit = (limit) => {
    // Validate: must be null, 0, or positive integer between 1-99
    if (limit === null || limit === 0 || limit === '') {
      setSentenceLimit(null);
      localStorage.removeItem(SENTENCE_LIMIT_KEY);
      return true;
    } else {
      const numLimit = parseInt(limit, 10);
      if (!isNaN(numLimit) && numLimit >= 1 && numLimit <= 99) {
        setSentenceLimit(numLimit);
        localStorage.setItem(SENTENCE_LIMIT_KEY, numLimit.toString());
        return true;
      } else {
        return false;
      }
    }
  };

  const updateRetrySets = (sets) => {
    // Validate: must be positive integer between 1-10
    const numSets = parseInt(sets, 10);
    if (!isNaN(numSets) && numSets >= 1 && numSets <= 10) {
      setRetrySets(numSets);
      localStorage.setItem(RETRY_SETS_KEY, numSets.toString());
      return true;
    }
    return false;
  };

  const value = {
    currentModel,
    selectModel,
    availableModels: LLM_MODELS,
    credentialStatuses,
    getConnectionStatus,
    refreshCredentialStatus,
    sentenceLimit,
    updateSentenceLimit,
    retrySets,
    updateRetrySets,
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
