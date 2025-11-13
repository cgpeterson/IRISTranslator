// Google Gemini LLM Client (No Fallbacks)
class GeminiClient {
  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.geminiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
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
          const errorMsg = `ERROR: Failed to connect to Gemini API

${error.message}

Possible causes:
- Network connectivity issues
- CORS configuration problems
- Invalid API endpoint
- Browser blocking the request

Error type: ${error.name}
Error details: ${error.message}

Check browser console for more details.`;
          
          console.error('Gemini API error:', error);
          return errorMsg;
        }
      },
    },
  };
}

export const base44 = new GeminiClient();
