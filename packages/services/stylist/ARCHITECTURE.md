# Stylist Service Architecture

## Overview

The Stylist Service is a microservice that handles all LLM-based translations for IRIS Translator. This document describes the architecture and design decisions.

## Architecture Components

### 1. Shared Common Package (`@iris-translator/common`)

**Location:** `packages/common/`

**Purpose:** Provides shared configuration and utilities that both the frontend app and backend services need to access.

**Contents:**
- `translationModes.js` - Complete configuration of all translation modes organized by category
- Exports via `index.js` for clean imports

**Why it exists:** 
- Eliminates code duplication
- Ensures frontend and backend use the exact same mode definitions
- Single source of truth for translation configurations
- Easy to maintain and update

### 2. Frontend App (`@iris-translator/app`)

**Location:** `packages/app/`

**Changes:**
- Added dependency on `@iris-translator/common`
- Updated import from local file to shared package
- No functional changes - still renders the same UI

**Import:**
```javascript
import { translationModes } from '@iris-translator/common';
```

### 3. Stylist Service (`@iris-translator/stylist`)

**Location:** `packages/services/stylist/`

**Purpose:** Provides an API endpoint for LLM-based translations using Google's Gemini API.

**Key Files:**
- `api/translate.js` - Main API endpoint and translation logic
- `package.json` - Dependencies and scripts
- `README.md` - Complete documentation
- `test.js` - Validation test suite
- `.env.example` - Configuration template

## API Design

### Endpoint: POST /api/translate

**Request:**
```json
{
  "text": "Hello, world!",
  "modeId": "pirate"
}
```

**Success Response (200):**
```json
{
  "translatedText": "Ahoy there, matey! Yarrr, welcome to the seven seas!"
}
```

**Error Response (4xx/5xx):**
```json
{
  "error": "Translation mode \"invalid\" not found"
}
```

## Translation Flow

```
1. Client sends POST request with text and modeId
2. Service validates input parameters
3. Service searches translationModes for matching modeId
4. Service extracts prompt or systemInstruction from mode
5. Service constructs full prompt with user text
6. Service calls Google Gemini API
7. Service returns translated text to client
```

## Error Handling

The service handles multiple error scenarios:

| Error | Status | Description |
|-------|--------|-------------|
| Missing text | 400 | Text parameter is required |
| Missing modeId | 400 | ModeId parameter is required |
| Invalid modeId | 404 | Translation mode not found |
| Encoding mode | 400 | Mode doesn't support LLM translation |
| Missing API key | 500 | GEMINI_API_KEY not configured |
| LLM error | 500 | API call failed |

## Mode Detection Logic

The service uses a helper function to search for modes:

```javascript
function findModeById(modeId) {
  for (const [category, modes] of Object.entries(translationModes)) {
    const mode = modes.find(m => m.id === modeId);
    if (mode) {
      return mode;
    }
  }
  return null;
}
```

This searches through ALL categories (encoding, literary, dialects, fantasy, sports, decode) to find the matching mode ID.

## Prompt Construction

The service handles two types of modes:

1. **Modes with `prompt`:** 
   - Used for literary and dialect translations
   - Appends user text to the prompt

2. **Modes with `systemInstruction`:**
   - Used for fantasy character translations
   - Uses systemInstruction as context
   - Appends user text

Example:
```javascript
let fullPrompt;
if (mode.systemInstruction) {
  fullPrompt = `${mode.systemInstruction}\n\n${text}`;
} else {
  fullPrompt = `${mode.prompt}\n\n${text}`;
}
```

## Supported Modes

The service supports all LLM-based modes from translationModes:

- **Literary:** shakespeare, haiku, iambic
- **Dialects:** pirate, cowboy, redneck
- **Fantasy:** elven, dwarven, draconic, wizard, monk, rogue, orc, bard
- **Sports:** hype_man, play_by_play, gritty_coach, golf_whisperer, moneyball_analyst, the_goon
- **Decode:** decipher

It **does not** support encoding modes (base64, hex, binary) as these don't require LLM processing.

## Deployment Options

The service is designed to be deployed as a serverless function:

- **Vercel** - Set GEMINI_API_KEY in environment variables
- **Netlify** - Configure as Netlify Function
- **AWS Lambda** - Deploy via API Gateway
- **Google Cloud Functions** - Native deployment

The default export is a standard serverless handler:
```javascript
export default async function handler(req, res) {
  // Handle request
}
```

## Testing

Run the test suite:
```bash
cd packages/services/stylist
npm test
```

This validates:
- Missing parameter handling
- Invalid mode ID detection
- Encoding mode rejection
- API key validation

## Configuration

Required environment variable:
```bash
GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

## Workspace Configuration

The monorepo uses npm workspaces to link packages:

**Root `package.json`:**
```json
{
  "workspaces": [
    "packages/*",
    "packages/services/*"
  ]
}
```

This allows:
- Local package linking (no publishing needed)
- Shared dependency management
- Single `npm install` at root
- Workspace-scoped commands

## Future Enhancements

Potential improvements:
1. Add caching for repeated translations
2. Support multiple LLM providers
3. Add rate limiting
4. Implement streaming responses
5. Add translation history/logging
6. Support batch translations
7. Add model selection (e.g., gemini-pro vs gemini-flash)

## Security Considerations

- API key stored as environment variable (never committed)
- Input validation on all parameters
- No code injection vulnerabilities
- Safe string concatenation
- Error messages don't expose sensitive info

## Performance

- Uses Gemini 1.5 Flash for fast responses
- Async/await for non-blocking I/O
- Minimal dependencies
- Stateless design (scales horizontally)
