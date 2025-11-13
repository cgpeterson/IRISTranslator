import React, { useState } from 'react';
import { Copy, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useFantasyTranslation } from '@/hooks/useFantasyTranslation';
import { copyToClipboard } from '@/utils/clipboard';
import { colorMap, buttonColorMap } from '@/config/colorMaps';
import { FANTASY_PERSONAS } from '@/data/fantasyPrompts';

export default function FantasyPanel({ mode }) {
  const [selectedPersona, setSelectedPersona] = useState('elven');
  
  const { inputText, setInputText, outputText, isLoading, handleTranslate } = 
    useFantasyTranslation(FANTASY_PERSONAS[selectedPersona].systemPrompt);

  const borderColor = colorMap[mode.color] || colorMap.purple;
  const buttonColor = buttonColorMap[mode.color] || buttonColorMap.purple;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className={`w-5 h-5 text-${mode.color}-500`} />
        <h3 className="text-xl font-semibold text-white">{mode.name}</h3>
      </div>

      {/* Persona Selector */}
      <div className="space-y-3">
        <Label className="text-slate-300 font-medium">Select Persona</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(FANTASY_PERSONAS).map(([key, persona]) => (
            <button
              key={key}
              onClick={() => setSelectedPersona(key)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedPersona === key
                  ? 'border-purple-500 bg-purple-900/30 text-white'
                  : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
              }`}
            >
              <div className="font-semibold text-sm mb-1">{persona.label}</div>
              <div className="text-xs text-slate-400">{persona.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <Label htmlFor="fantasy-input" className="text-slate-300 font-medium">
          {mode.inputLabel}
        </Label>
        <Textarea
          id="fantasy-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={6}
          className={`bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 resize-none ${borderColor}`}
          placeholder={mode.placeholder}
        />
      </div>

      {/* Translate Button */}
      <Button
        onClick={handleTranslate}
        disabled={isLoading || !inputText.trim()}
        className={`w-full ${buttonColor} text-white font-semibold shadow-lg transition-all`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Translating...
          </>
        ) : (
          <>
            Transform to {FANTASY_PERSONAS[selectedPersona].label} ↓
          </>
        )}
      </Button>

      {/* Output */}
      <div className="space-y-3">
        <Label htmlFor="fantasy-output" className="text-slate-300 font-medium">
          {mode.outputLabel}
        </Label>
        <Textarea
          id="fantasy-output"
          value={outputText}
          readOnly
          rows={6}
          className={`bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 resize-none ${borderColor}`}
          placeholder="Translation will appear here..."
        />
        <Button
          onClick={() => copyToClipboard(outputText)}
          variant="outline"
          className="w-full md:w-auto border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          disabled={!outputText.trim()}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Translation
        </Button>
      </div>
    </div>
  );
}
