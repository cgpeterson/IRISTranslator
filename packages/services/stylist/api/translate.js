/**
 * Stylist Service - LLM-based Translation API
 * 
 * This service handles generative (LLM-based) translations using translation modes
 * from the shared @iris-translator/common package.
 * 
 * API Endpoint: POST /api/translate
 * 
 * Request Body:
 * {
 *   "text": "string",     // The text to translate
 *   "modeId": "string"    // The translation mode ID (e.g., "pirate", "dwarven")
 * }
 * 
 * Response:
 * {
 *   "translatedText": "string"  // The LLM's translation
 * }
 * 
 * Error Response:
 * {
 *   "error": "string"     // Error message
 * }
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { translationModes } from '@iris-translator/common';

/**
 * Find a translation mode by its ID across all categories
 * @param {string} modeId - The mode ID to search for
 * @returns {Object|null} The translation mode object or null if not found
 */
function findModeById(modeId) {
  // Search through all categories to find the mode
  for (const [category, modes] of Object.entries(translationModes)) {
    const mode = modes.find(m => m.id === modeId);
    if (mode) {
      return mode;
    }
  }
  return null;
}

/**
 * Main translation handler
 * @param {Object} req - Request object containing body with text and modeId
 * @returns {Promise<Object>} Response object with translatedText or error
 */
export async function translateText(req) {
  try {
    // Parse request body
    const { text, modeId } = req.body || req;
    
    // Validate input
    if (!text || typeof text !== 'string') {
      return {
        status: 400,
        body: { error: 'Missing or invalid "text" parameter' }
      };
    }
    
    if (!modeId || typeof modeId !== 'string') {
      return {
        status: 400,
        body: { error: 'Missing or invalid "modeId" parameter' }
      };
    }
    
    // Find the translation mode
    const mode = findModeById(modeId);
    if (!mode) {
      return {
        status: 404,
        body: { error: `Translation mode "${modeId}" not found` }
      };
    }
    
    // Check if this mode requires LLM (has prompt or systemInstruction)
    if (!mode.prompt && !mode.systemInstruction) {
      return {
        status: 400,
        body: { error: `Translation mode "${modeId}" does not support LLM translation` }
      };
    }
    
    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        status: 500,
        body: { error: 'GEMINI_API_KEY not configured' }
      };
    }
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Prepare the prompt
    let fullPrompt;
    if (mode.systemInstruction) {
      // For modes with systemInstruction, use it as context and append the text
      fullPrompt = `${mode.systemInstruction}\n\n${text}`;
    } else {
      // For modes with prompt, append the text to the prompt
      fullPrompt = `${mode.prompt}\n\n${text}`;
    }
    
    // Call Gemini API
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const translatedText = response.text();
    
    // Return success response
    return {
      status: 200,
      body: { translatedText }
    };
    
  } catch (error) {
    console.error('Translation error:', error);
    return {
      status: 500,
      body: { error: `Translation failed: ${error.message}` }
    };
  }
}

/**
 * Serverless function handler (Vercel/Netlify compatible)
 */
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  // Process translation
  const result = await translateText(req);
  res.status(result.status).json(result.body);
}

// For local testing
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Stylist Service - Translation API');
  console.log('Available modes:', Object.keys(translationModes).flatMap(cat => 
    translationModes[cat].map(m => m.id)
  ).join(', '));
  
  // Example usage
  if (process.env.GEMINI_API_KEY) {
    console.log('\nTesting translation...');
    const testResult = await translateText({
      text: 'Hello, world!',
      modeId: 'pirate'
    });
    console.log('Result:', testResult);
  } else {
    console.log('\nSet GEMINI_API_KEY environment variable to test translation');
  }
}
