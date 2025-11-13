import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useLLM, LLM_PROVIDERS, LLM_PROVIDER_INFO } from '@/contexts/LLMContext';
import LLMSettingsDialog from './LLMSettingsDialog';

export default function LLMSelector() {
  const {
    selectedProvider,
    setSelectedProvider,
    isSettingsOpen,
    setIsSettingsOpen,
    hasApiKey,
  } = useLLM();

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    const providerInfo = LLM_PROVIDER_INFO[newProvider];
    
    // Check if the provider requires an API key and if we have one
    if (providerInfo.requiresApiKey && !hasApiKey(newProvider)) {
      // Open settings dialog to configure the API key
      setIsSettingsOpen(true);
      return;
    }
    
    setSelectedProvider(newProvider);
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">AI Model:</span>
          <Select
            value={selectedProvider}
            onChange={handleProviderChange}
            className="bg-slate-800 border-slate-600 text-white w-56"
          >
            {Object.entries(LLM_PROVIDER_INFO).map(([key, info]) => (
              <option key={key} value={key}>
                {info.icon} {info.name}
                {info.requiresApiKey && !hasApiKey(key) ? ' (Not configured)' : ''}
              </option>
            ))}
          </Select>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSettingsOpen(true)}
          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          title="Configure API Keys"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <LLMSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );
}
