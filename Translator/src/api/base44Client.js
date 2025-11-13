// LLM Client with Google Gemini as primary provider and local fallback
class LLMClient {
  constructor() {
    // Google Gemini API configuration (primary provider)
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.geminiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    // Fallback providers if Gemini is unavailable
    this.fallbackProviders = [
      {
        name: 'Hugging Face',
        baseUrl: 'https://api-inference.huggingface.co/models',
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
      },
      {
        name: 'Together AI',
        baseUrl: 'https://api.together.xyz/v1',
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
      }
    ];
    this.currentFallbackIndex = 0;
    this.useLocalFallback = false;
  }

  // Try Google Gemini API first
  async tryGemini(prompt) {
    if (!this.geminiApiKey) {
      console.warn('Gemini API key not configured. Set VITE_GEMINI_API_KEY in your .env file.');
      return null;
    }

    try {
      const response = await fetch(`${this.geminiBaseUrl}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', response.status, errorText);
        return null;
      }

      const data = await response.json();
      
      // Extract text from Gemini response format
      if (data.candidates && data.candidates.length > 0) {
        const content = data.candidates[0].content;
        if (content && content.parts && content.parts.length > 0) {
          return content.parts[0].text;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Gemini API error:', error);
      return null;
    }
  }

  // Try fallback API providers
  async tryFallbackProviders(prompt) {
    for (let i = 0; i < this.fallbackProviders.length; i++) {
      const provider = this.fallbackProviders[this.currentFallbackIndex];
      
      try {
        const response = await fetch(`${provider.baseUrl}/${provider.model}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            inputs: prompt,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
              return_full_text: false
            }
          }),
        });

        if (!response.ok) {
          console.error(`${provider.name} API error:`, response.status);
          this.currentFallbackIndex = (this.currentFallbackIndex + 1) % this.fallbackProviders.length;
          continue;
        }

        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          return data[0].generated_text || String(data[0]);
        }
        
        return data.generated_text || data.result || data.text || String(data);
      } catch (error) {
        console.error(`${provider.name} error:`, error);
        this.currentFallbackIndex = (this.currentFallbackIndex + 1) % this.fallbackProviders.length;
        continue;
      }
    }
    
    return null;
  }

  // Local demo translation for when all APIs are unavailable
  localTranslate(prompt) {
    const input = prompt.split('\n\n').pop() || prompt;
    
    // Simple rule-based transformations for demo purposes
    if (prompt.toLowerCase().includes('pirate')) {
      return input
        .replace(/hello/gi, "Ahoy")
        .replace(/hi/gi, "Ahoy")
        .replace(/you/gi, "ye")
        .replace(/your/gi, "yer")
        .replace(/my/gi, "me")
        .replace(/is/gi, "be")
        .replace(/are/gi, "be")
        .replace(/\./g, ", matey!")
        + " Yarrr!";
    } else if (prompt.toLowerCase().includes('cowboy')) {
      return input
        .replace(/hello/gi, "Howdy")
        .replace(/hi/gi, "Howdy")
        .replace(/you/gi, "ya")
        .replace(/going to/gi, "gonna")
        .replace(/want to/gi, "wanna")
        + ", partner.";
    } else if (prompt.toLowerCase().includes('shakespeare')) {
      return "Hark! " + input
        .replace(/you/gi, "thou")
        .replace(/your/gi, "thy")
        .replace(/are/gi, "art")
        + ", forsooth!";
    } else if (prompt.toLowerCase().includes('haiku')) {
      const words = input.trim().split(/\s+/);
      const essence = words.slice(0, 3).join(' ');
      return `${essence} flows\nThrough digital pathways bright\nMeaning crystallized`;
    } else if (prompt.toLowerCase().includes('redneck')) {
      return input.toUpperCase()
        .replace(/YOU/g, "YA")
        .replace(/GOING TO/g, "GONNA")
        .replace(/WANT TO/g, "WANNA")
        .replace(/\./g, "")
        + " YEE HAW";
    } else if (prompt.toLowerCase().includes('iambic pentameter')) {
      return "The text you gave shall flow in measured beat,\nWith ten syllables to make complete,\nEach line in rhythm, unstressed then stressed,\nA modern verse, but metrically blessed.";
    } else if (prompt.toLowerCase().includes('decipher') || prompt.toLowerCase().includes('translate')) {
      // For the universal decipher, try to decode if it's base64
      try {
        const decoded = atob(input.trim());
        return `Decoded: "${decoded}" - This appears to be base64 encoded text.`;
      } catch {
        return `This text appears to be in plain English already: "${input}"`;
      }
    }
    
    return `[Demo Mode] Transformed: ${input}`;
  }

  integrations = {
    Core: {
      InvokeLLM: async ({ prompt }) => {
        // If already using local fallback, use it directly
        if (this.useLocalFallback) {
          console.log('Using local demo translation (all APIs unavailable)');
          return this.localTranslate(prompt);
        }

        // 1. Try Google Gemini first (primary provider)
        const geminiResult = await this.tryGemini(prompt);
        if (geminiResult) {
          console.log('Using Google Gemini API');
          return geminiResult;
        }

        // 2. Try fallback providers
        const fallbackResult = await this.tryFallbackProviders(prompt);
        if (fallbackResult) {
          console.log('Using fallback API provider');
          return fallbackResult;
        }
        
        // 3. All providers failed, switch to local fallback
        console.log('All API providers failed, switching to local demo mode');
        this.useLocalFallback = true;
        return this.localTranslate(prompt);
      },
    },
  };
}

export const base44 = new LLMClient();
