import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Base64Panel from '../components/translator/Base64Panel';
import EncodingPanel from '../components/translator/EncodingPanel';
import AITranslatorPanel from '../components/translator/AITranslatorPanel';
import ModelSelector from '../components/translator/ModelSelector';
import LLMSettingsDialog from '../components/translator/LLMSettingsDialog';
import RetrySettings from '../components/translator/RetrySettings';
import { translationModes } from '@iris-translator/common';
import { categoryInfo } from '@/config/categoryInfo';
import { useDropdown } from '@/hooks/useDropdown';
import { useModel } from '@/contexts/ModelContext';

export default function Translator() {
  const [selectedCategory, setSelectedCategory] = useState('encoding');
  const [selectedMode, setSelectedMode] = useState('base64');
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const { openDropdown, dropdownRef, toggleDropdown, closeDropdown } = useDropdown();
  const { refreshCredentialStatus } = useModel();

  const handleCategorySelect = (category, modeId) => {
    setSelectedCategory(category);
    setSelectedMode(modeId);
    closeDropdown();
  };

  const handleNeedCredentials = () => {
    setShowCredentialsDialog(true);
  };

  const handleCredentialsSaved = () => {
    refreshCredentialStatus();
  };

  const currentMode = translationModes[selectedCategory]?.find(
    (mode) => mode.id === selectedMode
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header with Menu Bar */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 md:px-6">
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Chat Translator
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">
              Transform your text with encoding, literary styles, and regional dialects
            </p>
          </div>

          {/* Menu Bar with Model Selector */}
          <div className="flex justify-between items-center gap-4">
            {/* Left side: Retry Settings */}
            <div className="flex items-center gap-2">
              <RetrySettings />
            </div>

            {/* Center: Navigation */}
            <nav ref={dropdownRef} className="flex justify-center gap-2 flex-wrap flex-1">
              {Object.entries(translationModes).map(([category, modes]) => (
                <div key={category} className="relative">
                  <button
                    onClick={() => toggleDropdown(category)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/70 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{categoryInfo[category].icon}</span>
                    <span className="font-medium text-sm md:text-base">
                      {categoryInfo[category].title}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openDropdown === category ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === category && (
                    <div className="absolute top-full mt-2 left-0 bg-slate-800 border border-slate-700 rounded-lg shadow-xl min-w-[200px] overflow-hidden z-50">
                      {modes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => handleCategorySelect(category, mode.id)}
                          className={`w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors ${
                            selectedMode === mode.id && selectedCategory === category
                              ? 'bg-slate-700 text-white'
                              : 'text-slate-300'
                          }`}
                        >
                          <div className="font-medium text-sm">{mode.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Model Selector */}
            <ModelSelector onNeedCredentials={handleNeedCredentials} />
          </div>
        </div>
      </div>

      {/* Main Content - Single Panel */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:px-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          {currentMode?.isEncoding ? (
            <EncodingPanel 
              encodingType={currentMode.encodingType}
              color={currentMode.color}
              name={currentMode.name}
            />
          ) : (
            currentMode && <AITranslatorPanel mode={currentMode} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>All translations happen in real-time. No data is stored.</p>
        </div>
      </div>

      {/* Credentials Dialog */}
      <LLMSettingsDialog
        open={showCredentialsDialog}
        onOpenChange={setShowCredentialsDialog}
        onSaved={handleCredentialsSaved}
      />
    </div>
  );
}