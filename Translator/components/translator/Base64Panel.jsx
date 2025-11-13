import React, { useState, useEffect } from 'react';
import { Copy, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Base64Panel() {
  const [plainText, setPlainText] = useState('');
  const [base64Text, setBase64Text] = useState('');

  const encodeText = (text) => {
    try {
      if (text.trim() === '') {
        return '';
      }
      return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      console.error('Encoding error:', error);
      return 'Error: Invalid input for encoding.';
    }
  };

  const decodeText = (text) => {
    try {
      if (text.trim() === '') {
        return '';
      }
      return decodeURIComponent(escape(atob(text)));
    } catch (error) {
      console.error('Decoding error:', error);
      return 'Error: Invalid Base64 string.';
    }
  };

  useEffect(() => {
    setBase64Text(encodeText(plainText));
  }, [plainText]);

  const handleBase64Change = (newBase64) => {
    setBase64Text(newBase64);
    setPlainText(decodeText(newBase64));
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

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Plain Text */}
        <div className="space-y-3">
          <Label htmlFor="plain-text" className="text-slate-300 font-medium">
            Plain Text
          </Label>
          <Textarea
            id="plain-text"
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
            rows={8}
            className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 resize-none"
            placeholder="Enter text to encode..."
          />
          <Button
            onClick={() => copyToClipboard(plainText)}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            disabled={!plainText.trim()}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Plain Text
          </Button>
        </div>

        {/* Arrow indicator */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-blue-600 p-3 rounded-full shadow-lg">
            <ArrowDownUp className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Base64 Text */}
        <div className="space-y-3">
          <Label htmlFor="base64-text" className="text-slate-300 font-medium">
            Base64 Encoded
          </Label>
          <Textarea
            id="base64-text"
            value={base64Text}
            onChange={(e) => handleBase64Change(e.target.value)}
            rows={8}
            className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 resize-none font-mono text-sm"
            placeholder="Base64 encoded text appears here..."
          />
          <Button
            onClick={() => copyToClipboard(base64Text)}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            disabled={!base64Text.trim()}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Base64
          </Button>
        </div>
      </div>

      <div className="text-center text-slate-500 text-sm">
        <p>Real-time encoding and decoding • Edit either field to update the other</p>
      </div>
    </div>
  );
}