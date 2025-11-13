import React, { useState, useEffect } from 'react';
import { Copy, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { StringEncoder } from '@/utils/StringEncoder';

const colorMap = {
  blue: 'border-blue-500 focus:border-blue-500 focus:ring-blue-500',
  indigo: 'border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500',
  violet: 'border-violet-500 focus:border-violet-500 focus:ring-violet-500',
  sky: 'border-sky-500 focus:border-sky-500 focus:ring-sky-500',
  emerald: 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500',
};

export default function EncodingPanel({ encodingType, color, name }) {
  const [mode, setMode] = useState('encode');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  // Handle input text changes
  useEffect(() => {
    const result = StringEncoder.process(inputText, encodingType, mode);
    setOutputText(result);
  }, [inputText, encodingType, mode]);

  // Handle output text changes (for bidirectional editing)
  const handleOutputChange = (newOutput) => {
    setOutputText(newOutput);
    const reverseMode = mode === 'encode' ? 'decode' : 'encode';
    const result = StringEncoder.process(newOutput, encodingType, reverseMode);
    setInputText(result);
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

  const borderColor = colorMap[color] || colorMap.blue;
  const inputLabel = mode === 'encode' ? 'Plain Text' : `${name} Encoded`;
  const outputLabel = mode === 'encode' ? `${name} Encoded` : 'Plain Text';

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">{name}</h2>
        <p className="text-slate-400 text-sm mt-1">Real-time encoding and decoding</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-lg bg-slate-700/50 p-1">
          <button
            onClick={() => setMode('encode')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'encode'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'decode'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 relative">
        {/* Input Text */}
        <div className="space-y-3">
          <Label htmlFor="input-text" className="text-slate-300 font-medium">
            {inputLabel}
          </Label>
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
            className={`bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 resize-none ${borderColor}`}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter text to decode...'}
          />
          <Button
            onClick={() => copyToClipboard(inputText)}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            disabled={!inputText.trim()}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Input
          </Button>
        </div>

        {/* Arrow indicator */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className={`bg-blue-600 p-3 rounded-full shadow-lg`}>
            <ArrowDownUp className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Output Text */}
        <div className="space-y-3">
          <Label htmlFor="output-text" className="text-slate-300 font-medium">
            {outputLabel}
          </Label>
          <Textarea
            id="output-text"
            value={outputText}
            onChange={(e) => handleOutputChange(e.target.value)}
            rows={8}
            className={`bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 resize-none font-mono text-sm ${borderColor}`}
            placeholder={mode === 'encode' ? 'Encoded text appears here...' : 'Decoded text appears here...'}
          />
          <Button
            onClick={() => copyToClipboard(outputText)}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            disabled={!outputText.trim()}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Output
          </Button>
        </div>
      </div>

      <div className="text-center text-slate-500 text-sm">
        <p>Edit either field to update the other • All conversions happen instantly</p>
      </div>
    </div>
  );
}