import React from 'react';
import { Copy, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { copyToClipboard } from '@/utils/clipboard';
import { colorMap, buttonColorMap } from '@/config/colorMaps';

export default function AITranslatorPanel({ mode }) {
  const { inputText, setInputText, outputText, isLoading, handleTranslate } = useTranslation(mode);

  const borderColor = colorMap[mode.color] || colorMap.blue;
  const buttonColor = buttonColorMap[mode.color] || buttonColorMap.blue;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className={`w-5 h-5 text-${mode.color}-500`} />
        <h3 className="text-xl font-semibold text-white">{mode.name}</h3>
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