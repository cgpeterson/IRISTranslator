import { useState } from 'react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useModel } from '@/contexts/ModelContext';
import { SPORTS_PERSONAS } from '@/data/sportsPrompts';

/**
 * Custom hook for AI translation functionality
 * @param {Object} mode - Translation mode configuration
 * @param {string} personaKey - Selected persona key for sports mode
 * @returns {Object} - State and handlers for translation
 */
export function useTranslation(mode, personaKey = null) {
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
      let promptText;
      
      // Check if this is sports mode with persona
      if (mode.mode === 'sports' && personaKey) {
        const persona = SPORTS_PERSONAS[personaKey];
        if (persona) {
          promptText = `${persona.systemPrompt}\n\nTranslate this:\n${inputText}`;
        } else {
          promptText = `${mode.prompt}\n\n${inputText}`;
        }
      } else {
        promptText = `${mode.prompt}\n\n${inputText}`;
      }

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: promptText,
        modelId: currentModel.id,
        sentenceLimit: sentenceLimit,
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
