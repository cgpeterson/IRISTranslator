import { useState } from 'react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useModel } from '@/contexts/ModelContext';

/**
 * Custom hook for AI translation functionality
 * @param {Object} mode - Translation mode configuration
 * @returns {Object} - State and handlers for translation
 */
export function useTranslation(mode) {
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
      // Check if mode uses systemInstruction (fantasy personas) or traditional prompt
      const invocationParams = {
        modelId: currentModel.id,
        sentenceLimit: sentenceLimit,
      };

      if (mode.systemInstruction) {
        // For fantasy personas and modes with system instructions
        invocationParams.prompt = inputText;
        invocationParams.systemInstruction = mode.systemInstruction;
      } else {
        // For traditional modes with prompts
        invocationParams.prompt = `${mode.prompt}\n\n${inputText}`;
      }

      const result = await base44.integrations.Core.InvokeLLM(invocationParams);

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
