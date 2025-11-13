import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, AlertCircle, ExternalLink, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { secretManager } from '@/utils/secretManager';
import { LLM_PROVIDERS, PROVIDER_INFO } from '@/config/llmModels';

export default function LLMSettingsDialog({ open, onOpenChange, onSaved }) {
  const [apiKeys, setApiKeys] = useState({
    [LLM_PROVIDERS.OPENAI]: '',
    [LLM_PROVIDERS.XAI]: '',
    [LLM_PROVIDERS.GEMINI]: '',
    [LLM_PROVIDERS.ANTHROPIC]: '',
  });
  const [showKeys, setShowKeys] = useState({
    [LLM_PROVIDERS.OPENAI]: false,
    [LLM_PROVIDERS.XAI]: false,
    [LLM_PROVIDERS.GEMINI]: false,
    [LLM_PROVIDERS.ANTHROPIC]: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load existing keys when dialog opens
  useEffect(() => {
    let isMounted = true;
    
    if (open) {
      const loadKeys = async () => {
        const keys = {};
        for (const provider of Object.values(LLM_PROVIDERS)) {
          const key = await secretManager.getApiKey(provider);
          keys[provider] = key || '';
        }
        if (isMounted) {
          setApiKeys(keys);
        }
      };
      loadKeys();
    }
    
    return () => {
      isMounted = false;
    };
  }, [open]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate and save each API key using SecretManager
      for (const [provider, key] of Object.entries(apiKeys)) {
        const trimmedKey = key.trim();
        
        // Skip empty keys
        if (trimmedKey.length === 0) {
          await secretManager.setApiKey(provider, '');
          continue;
        }
        
        // Validate non-empty keys have minimum length
        if (trimmedKey.length < 10) {
          toast.error(`API key for ${PROVIDER_INFO[provider]?.name || provider} is too short or invalid.`);
          setIsSaving(false);
          return;
        }
        
        await secretManager.setApiKey(provider, trimmedKey);
      }
      
      toast.success('API keys saved successfully!');
      if (onSaved) {
        try {
          onSaved();
        } catch (error) {
          console.error('Error in onSaved callback:', error);
        }
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast.error('Failed to save API keys');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all API keys? This cannot be undone.')) {
      secretManager.clearAllApiKeys();
      setApiKeys({
        [LLM_PROVIDERS.OPENAI]: '',
        [LLM_PROVIDERS.XAI]: '',
        [LLM_PROVIDERS.GEMINI]: '',
        [LLM_PROVIDERS.ANTHROPIC]: '',
      });
      toast.success('All API keys cleared');
      if (onSaved) {
        try {
          onSaved();
        } catch (error) {
          console.error('Error in onSaved callback:', error);
        }
      }
    }
  };

  const apiProviders = Object.entries(PROVIDER_INFO).map(([key, info]) => ({
    key,
    name: info.name,
    icon: info.icon,
    description: `Get your API key from ${info.name}`,
    link: info.getKeyUrl,
    placeholder: info.keyPlaceholder,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Configure Premium AI Models</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add your API keys to use premium AI models. Your keys are encrypted and stored locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-blue-900/20 border-blue-700">
          <AlertCircle className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200 text-sm">
            API keys are encrypted using AES-256 and stored locally. They never leave your browser and are only used for your translations.
          </AlertDescription>
        </Alert>

        <div className="space-y-6 py-4">
          {apiProviders.map((provider) => (
            <div key={provider.key} className="space-y-2 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <Label className="text-white font-semibold">{provider.name}</Label>
                    <p className="text-xs text-gray-400">{provider.description}</p>
                  </div>
                </div>
                <a
                  href={provider.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="relative">
                <Input
                  type={showKeys[provider.key] ? 'text' : 'password'}
                  value={apiKeys[provider.key]}
                  onChange={(e) => setApiKeys({ ...apiKeys, [provider.key]: e.target.value })}
                  placeholder={provider.placeholder}
                  className="bg-gray-900 border-gray-600 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, [provider.key]: !showKeys[provider.key] })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showKeys[provider.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="border-red-600 text-red-400 hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Keys
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save API Keys
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}