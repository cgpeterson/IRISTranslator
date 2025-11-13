// Google Gemini LLM Client (Dynamic Version + Retry Logic)
class GeminiClient {
  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.cachedBaseUrl = null; // Store the URL here after we find it once
  }

  // Helper: Pauses execution for a set time
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper to find the best available model
  async resolveModelUrl() {
    // 1. Return cached URL if we already found it
    if (this.cachedBaseUrl) return this.cachedBaseUrl;

    try {
      // 2. Ask Google what models are available
      const listResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${this.geminiApiKey}`
      );
      
      if (!listResponse.ok) {
        throw new Error('Failed to list models');
      }

      const data = await listResponse.json();
      const models = data.models || [];

      // 3. Find the newest "Flash" model that supports content generation
      // We look for models containing "flash" and supporting "generateContent"
      const flashModels = models.filter(m => 
        m.name.toLowerCase().includes('flash') && 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent')
      );

      // Sort by version number (descending) so we get the highest number (e.g., 2.5 > 1.5)
      flashModels.sort((a, b) => {
        // Extract version numbers from model names like "models/gemini-1.5-flash"
        const versionRegex = /(\d+\.?\d*)/g;
        const versionsA = a.name.match(versionRegex);
        const versionsB = b.name.match(versionRegex);
        
        const versionA = versionsA ? parseFloat(versionsA[0]) : 0;
        const versionB = versionsB ? parseFloat(versionsB[0]) : 0;
        
        return versionB - versionA;
      });

      // Default fallback if no flash model is found
      let selectedModel = 'models/gemini-1.5-flash'; 
      
      if (flashModels.length > 0) {
        selectedModel = flashModels[0].name;
        console.log(`Dynamically selected model: ${selectedModel}`);
      } else {
        console.warn('No Flash model found, using default: gemini-1.5-flash');
      }

      // 4. Construct and cache the URL
      this.cachedBaseUrl = `https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent`;
      return this.cachedBaseUrl;

    } catch (error) {
      console.warn('Model resolution failed, falling back to hardcoded default.', error);
      // Fallback to a safe default if the List request fails
      this.cachedBaseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
      return this.cachedBaseUrl;
    }
  }

  integrations = {
    Core: {
      InvokeLLM: async ({ prompt }) => {
        // Check if API key is configured
        if (!this.geminiApiKey) {
          const errorMsg = `ERROR: Gemini API key not configured.

Please set VITE_GEMINI_API_KEY in your environment variables.

For Vercel deployment:
1. Go to Project Settings → Environment Variables
2. Add: VITE_GEMINI_API_KEY = your_api_key_here
3. Redeploy your application

For local development:
1. Create a .env file in the Translator directory
2. Add: VITE_GEMINI_API_KEY=your_api_key_here
3. Restart the dev server

See SETUP_GEMINI.md for detailed instructions.`;
          
          console.error('Gemini API key not configured');
          return errorMsg;
        }

        const maxRetries = 3;
        let attempt = 0;
        let lastError = null;

        // RETRY LOOP
        while (attempt < maxRetries) {
          try {
            // Await the dynamic URL resolution
            const currentUrl = await this.resolveModelUrl();

            const response = await fetch(`${currentUrl}?key=${this.geminiApiKey}`, {
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
                  maxOutputTokens: 8192, // Increased from 500 to prevent truncation errors
                }
              }),
            });

            // SPECIFIC HANDLING FOR 503 (OVERLOADED)
            if (response.status === 503) {
              attempt++;
              console.warn(`Gemini 503 Overloaded. Retrying attempt ${attempt}/${maxRetries}...`);
              // Wait 1 second * attempt number (Exponential Backoff)
              await this.delay(1000 * attempt);
              continue; // Jump back to start of loop
            }

            if (!response.ok) {
              // If it's a 4xx error (like 400 or 404), do not retry. It won't fix itself.
              const errorText = await response.text();
              let errorData;
              try {
                errorData = JSON.parse(errorText);
              } catch {
                errorData = { message: errorText };
              }

              const errorMsg = `ERROR: Gemini API request failed (HTTP ${response.status})

${errorData.error?.message || errorData.message || 'Unknown error'}

Troubleshooting:
- Verify your API key is correct in Vercel environment variables
- Check if the API key has the necessary permissions
- Ensure you haven't exceeded your API quota
- Visit https://makersuite.google.com/app/apikey to manage your API keys

Status: ${response.status}
Details: ${errorText.substring(0, 200)}`;

              console.error('Gemini API error:', response.status, errorText);
              return errorMsg;
            }

            const data = await response.json();
            
            // Extract text from Gemini response format
            if (data.candidates && data.candidates.length > 0) {
              const content = data.candidates[0].content;
              if (content && content.parts && content.parts.length > 0) {
                return content.parts[0].text;
              }
            }

            // Handle unexpected response format
            const errorMsg = `ERROR: Unexpected response format from Gemini API

Response received but could not extract text.

Response structure: ${JSON.stringify(data, null, 2).substring(0, 300)}

This might indicate:
- API response format changed
- Safety filters blocked the response
- Model returned empty response

Please check the console for full response details.`;
            
            console.error('Unexpected Gemini response format:', data);
            return errorMsg;
            
          } catch (error) {
            lastError = error;
            // If it's a fetch error (network down), we might want to retry
            if (attempt >= maxRetries - 1) break;
            
            // Optional: Retry on network failures too
            attempt++;
            console.warn(`Network error. Retrying attempt ${attempt}/${maxRetries}...`);
            await this.delay(1000 * attempt);
          }
        }

        // If we exit the loop, we failed
        const errorMsg = `ERROR: Request failed after ${maxRetries} attempts.

Last error: ${lastError?.message || 'Unknown error'}

Possible causes:
- Gemini servers are overloaded (503 errors)
- Network connectivity issues
- API quota exceeded
- CORS configuration problems

Please try again in a few moments or check your API configuration.`;

        console.error(errorMsg);
        return errorMsg;
      },
    },
  };
}

export const base44 = new GeminiClient();
