import { useState } from 'react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useModel } from '@/contexts/ModelContext';

/**
 * Custom hook for Fantasy persona-based translation
 * @param {string} systemInstruction - The persona's system instruction
 * @returns {Object} - State and handlers for translation
 */
export function useFantasyTranslation(systemInstruction) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentModel, sentenceLimit } = useModel();

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to translate');
      return;
    }

    setIsLoading(true);
    setOutputText('');

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: inputText,
        modelId: currentModel.id,
        sentenceLimit: sentenceLimit,
        systemInstruction: systemInstruction,
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

  return {
    inputText,
    setInputText,
    outputText,
    isLoading,
    handleTranslate,
  };
}
