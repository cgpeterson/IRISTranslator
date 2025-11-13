import React, { useState } from 'react';
import { Copy, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const colorMap = {
  red: 'border-red-500 focus:border-red-500 focus:ring-red-500',
  blue: 'border-blue-500 focus:border-blue-500 focus:ring-blue-500',
  teal: 'border-teal-500 focus:border-teal-500 focus:ring-teal-500',
  cyan: 'border-cyan-500 focus:border-cyan-500 focus:ring-cyan-500',
  slate: 'border-slate-500 focus:border-slate-500 focus:ring-slate-500',
  yellow: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500',
  green: 'border-green-500 focus:border-green-500 focus:ring-green-500',
  purple: 'border-purple-500 focus:border-purple-500 focus:ring-purple-500',
};

const buttonColorMap = {
  red: 'bg-red-600 hover:bg-red-700',
  blue: 'bg-blue-600 hover:bg-blue-700',
  teal: 'bg-teal-600 hover:bg-teal-700',
  cyan: 'bg-cyan-600 hover:bg-cyan-700',
  slate: 'bg-slate-600 hover:bg-slate-700',
  yellow: 'bg-yellow-600 hover:bg-yellow-700',
  green: 'bg-green-600 hover:bg-green-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
};

export default function AITranslatorPanel({ mode }) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to translate');
      return;
    }

    setIsLoading(true);
    setOutputText('');

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `${mode.prompt}\n\n${inputText}`,
      });

      setOutputText(result);
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Failed to translate. Please try again.');
      setOutputText('Error: Could not connect to translation service.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    });
  };

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