import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, AlertCircle, ExternalLink } from 'lucide-react';
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
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function LLMSettingsDialog({ open, onOpenChange, onSaved, user }) {
  const [apiKeys, setApiKeys] = useState({
    openai_api_key: '',
    grok_api_key: '',
    gemini_api_key: '',
    anthropic_api_key: '',
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    grok: false,
    gemini: false,
    anthropic: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && open) {
      setApiKeys({
        openai_api_key: user.openai_api_key || '',
        grok_api_key: user.grok_api_key || '',
        gemini_api_key: user.gemini_api_key || '',
        anthropic_api_key: user.anthropic_api_key || '',
      });
    }
  }, [user, open]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await base44.auth.updateMe(apiKeys);
      toast.success('API keys saved successfully!');
      onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast.error('Failed to save API keys');
    } finally {
      setIsSaving(false);
    }
  };

  const apiProviders = [
    {
      key: 'openai',
      field: 'openai_api_key',
      name: 'OpenAI (ChatGPT)',
      icon: '🤖',
      description: 'Get your API key from OpenAI Platform',
      link: 'https://platform.openai.com/api-keys',
    },
    {
      key: 'grok',
      field: 'grok_api_key',
      name: 'Grok (X.AI)',
      icon: '🚀',
      description: 'Get your API key from X.AI Console',
      link: 'https://console.x.ai/',
    },
    {
      key: 'gemini',
      field: 'gemini_api_key',
      name: 'Google Gemini',
      icon: '💎',
      description: 'Get your API key from Google AI Studio',
      link: 'https://makersuite.google.com/app/apikey',
    },
    {
      key: 'anthropic',
      field: 'anthropic_api_key',
      name: 'Anthropic (Claude)',
      icon: '🧠',
      description: 'Get your API key from Anthropic Console',
      link: 'https://console.anthropic.com/',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Configure Premium AI Models</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add your API keys to use premium AI models. Your keys are stored securely and only used for your translations.
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-blue-900/20 border-blue-700">
          <AlertCircle className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200 text-sm">
            API keys are stored encrypted and never shared. You'll be charged directly by each provider based on your usage.
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
                  value={apiKeys[provider.field]}
                  onChange={(e) => setApiKeys({ ...apiKeys, [provider.field]: e.target.value })}
                  placeholder={`Enter your ${provider.name} API key`}
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

        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}