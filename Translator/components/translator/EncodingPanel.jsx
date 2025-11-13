import React, { useState, useEffect } from 'react';
import { Copy, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const colorMap = {
  blue: 'border-blue-500 focus:border-blue-500 focus:ring-blue-500',
  indigo: 'border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500',
  violet: 'border-violet-500 focus:border-violet-500 focus:ring-violet-500',
  sky: 'border-sky-500 focus:border-sky-500 focus:ring-sky-500',
  emerald: 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500',
};

export default function EncodingPanel({ encodingType, color, name }) {
  const [plainText, setPlainText] = useState('');
  const [encodedText, setEncodedText] = useState('');

  const encodeText = (text, type) => {
    try {
      if (text.trim() === '') return '';

      switch (type) {
        case 'base64':
          return btoa(unescape(encodeURIComponent(text)));
        
        case 'url':
          return encodeURIComponent(text);
        
        case 'html':
          return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        
        case 'hex':
          return Array.from(text)
            .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
            .join(' ');
        
        case 'binary':
          return Array.from(text)
            .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
            .join(' ');
        
        default:
          return text;
      }
    } catch (error) {
      console.error('Encoding error:', error);
      return 'Error: Invalid input for encoding.';
    }
  };

  const decodeText = (text, type) => {
    try {
      if (text.trim() === '') return '';

      switch (type) {
        case 'base64':
          return decodeURIComponent(escape(atob(text)));
        
        case 'url':
          return decodeURIComponent(text);
        
        case 'html':
          const textarea = document.createElement('textarea');
          textarea.innerHTML = text;
          return textarea.value;
        
        case 'hex':
          const hexValues = text.replace(/\s+/g, '').match(/.{1,2}/g) || [];
          return hexValues
            .map(hex => String.fromCharCode(parseInt(hex, 16)))
            .join('');
        
        case 'binary':
          const binaryValues = text.split(/\s+/).filter(b => b);
          return binaryValues
            .map(bin => String.fromCharCode(parseInt(bin, 2)))
            .join('');
        
        default:
          return text;
      }
    } catch (error) {
      console.error('Decoding error:', error);
      return 'Error: Invalid encoded string.';
    }
  };

  useEffect(() => {
    setEncodedText(encodeText(plainText, encodingType));
  }, [plainText, encodingType]);

  const handleEncodedChange = (newEncoded) => {
    setEncodedText(newEncoded);
    setPlainText(decodeText(newEncoded, encodingType));
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">{name}</h2>
        <p className="text-gray-400 text-sm mt-1">Real-time encoding and decoding</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 relative">
        {/* Plain Text */}
        <div className="space-y-3">
          <Label htmlFor="plain-text" className="text-gray-300 font-medium">
            Plain Text
          </Label>
          <Textarea
            id="plain-text"
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
            rows={8}
            className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none ${borderColor}`}
            placeholder="Enter text to encode..."
          />
          <Button
            onClick={() => copyToClipboard(plainText)}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            disabled={!plainText.trim()}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Plain Text
          </Button>
        </div>

        {/* Arrow indicator */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className={`bg-${color}-600 p-3 rounded-full shadow-lg`}>
            <ArrowDownUp className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Encoded Text */}
        <div className="space-y-3">
          <Label htmlFor="encoded-text" className="text-gray-300 font-medium">
            {name} Encoded
          </Label>
          <Textarea
            id="encoded-text"
            value={encodedText}
            onChange={(e) => handleEncodedChange(e.target.value)}
            rows={8}
            className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none font-mono text-sm ${borderColor}`}
            placeholder="Encoded text appears here..."
          />
          <Button
            onClick={() => copyToClipboard(encodedText)}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            disabled={!encodedText.trim()}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Encoded
          </Button>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm">
        <p>Edit either field to update the other • All conversions happen instantly</p>
      </div>
    </div>
  );
}