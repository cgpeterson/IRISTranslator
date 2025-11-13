import React from 'react';
import { Copy, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { copyToClipboard } from '@/utils/clipboard';
import { colorMap, buttonColorMap } from '@/config/colorMaps';
import { useModel } from '@/contexts/ModelContext';

export default function AITranslatorPanel({ mode }) {
  const { inputText, setInputText, outputText, isLoading, handleTranslate } = useTranslation(mode);
  const { sentenceLimit, updateSentenceLimit } = useModel();

  const borderColor = colorMap[mode.color] || colorMap.blue;
  const buttonColor = buttonColorMap[mode.color] || buttonColorMap.blue;

  const handleSentenceLimitChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      updateSentenceLimit(null);
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        updateSentenceLimit(numValue);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className={`w-5 h-5 text-${mode.color}-500`} />
        <h3 className="text-xl font-semibold text-white">{mode.name}</h3>
      </div>

      {/* Max Sentences Control */}
      <div className="space-y-2">
        <Label htmlFor="max-sentences" className="text-slate-300 font-medium text-sm">
          Max Sentences (optional)
        </Label>
        <Input
          id="max-sentences"
          type="number"
          min="1"
          max="99"
          value={sentenceLimit || ''}
          onChange={handleSentenceLimitChange}
          placeholder="No limit"
          className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 w-32"
        />
        <p className="text-xs text-slate-500">
          Limit AI response to a specific number of sentences (1-99)
        </p>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <Label htmlFor={`${mode.id}-input`} className="text-slate-300 font-medium">
          {mode.inputLabel}
        </Label>
        <Textarea
          id={`${mode.id}-input`}
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
            Translate to {mode.name} ↓
          </>
        )}
      </Button>

      {/* Output */}
      <div className="space-y-3">
        <Label htmlFor={`${mode.id}-output`} className="text-slate-300 font-medium">
          {mode.outputLabel}
        </Label>
        <Textarea
          id={`${mode.id}-output`}
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