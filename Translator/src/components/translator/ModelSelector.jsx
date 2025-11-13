import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useModel } from '@/contexts/ModelContext';
import { MODEL_TIERS, getModelsByTier } from '@/config/llmModels';

export default function ModelSelector({ onNeedCredentials }) {
  const { currentModel, selectModel, getConnectionStatus } = useModel();
  const [isOpen, setIsOpen] = useState(false);

  const standardModels = getModelsByTier(MODEL_TIERS.STANDARD);
  const premiumModels = getModelsByTier(MODEL_TIERS.PREMIUM);

  const handleModelSelect = (modelId) => {
    const success = selectModel(modelId);
    if (!success) {
      // Model requires credentials that don't exist
      onNeedCredentials();
    }
    setIsOpen(false);
  };

  const getStatusIndicator = (model) => {
    if (!model.requiresApiKey) {
      return <span className="w-2 h-2 bg-green-500 rounded-full" />;
    }
    const hasCredentials = getConnectionStatus(model.provider);
    return (
      <span 
        className={`w-2 h-2 rounded-full ${
          hasCredentials ? 'bg-green-500' : 'bg-red-500'
        }`} 
      />
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800/70 hover:bg-slate-700/70 text-white rounded-lg transition-colors"
      >
        <span className="text-lg">{currentModel.icon}</span>
        <span className="font-medium text-sm hidden md:inline">
          {currentModel.name}
        </span>
        {getStatusIndicator(currentModel)}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full mt-2 right-0 bg-slate-800 border border-slate-700 rounded-lg shadow-xl min-w-[280px] overflow-hidden z-50">
            {/* Standard Models Section */}
            <div className="p-2 bg-slate-900/50 border-b border-slate-700">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Standard Models
              </span>
            </div>
            {standardModels.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className={`w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex items-center justify-between ${
                  currentModel.id === model.id ? 'bg-slate-700' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{model.icon}</span>
                  <div>
                    <div className="font-medium text-sm text-white">
                      {model.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {model.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIndicator(model)}
                  {currentModel.id === model.id && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </button>
            ))}

            {/* Premium Models Section */}
            <div className="p-2 bg-slate-900/50 border-t border-b border-slate-700">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Premium Models
              </span>
            </div>
            {premiumModels.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className={`w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex items-center justify-between ${
                  currentModel.id === model.id ? 'bg-slate-700' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{model.icon}</span>
                  <div>
                    <div className="font-medium text-sm text-white">
                      {model.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {model.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIndicator(model)}
                  {currentModel.id === model.id && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
