# @iris-translator/stylist

LLM-based translation service for IRIS Translator. This service handles all generative (prompt-based) translations using Google's Gemini API.

## Overview

The Stylist service provides an API endpoint that accepts text and a translation mode ID, then uses the appropriate prompt or system instruction from `@iris-translator/common` to translate the text using an LLM.

## Setup

### Prerequisites

- Node.js >= 16.0.0
- A Google Gemini API key

### Installation

```bash
npm install
```

### Configuration

Set your Gemini API key as an environment variable:

```bash
export GEMINI_API_KEY="your-api-key-here"
```

## API Endpoint

### POST /api/translate

Translates text using a specified translation mode.

#### Request Body

```json
{
  "text": "Hello, world!",
  "modeId": "pirate"
}
```

- `text` (string, required): The text to translate
- `modeId` (string, required): The translation mode ID (e.g., "pirate", "dwarven", "shakespeare")

#### Response

**Success (200 OK):**
```json
{
  "translatedText": "Ahoy there, matey! Yarrr, welcome to the seven seas!"
}
```

**Error (4xx/5xx):**
```json
{
  "error": "Error message"
}
```

## Supported Translation Modes

The service supports all LLM-based modes from `@iris-translator/common`:

### Literary
- `shakespeare` - Shakespearian English
- `haiku` - Haiku poetry (5-7-5)
- `iambic` - Iambic Pentameter

### Dialects
- `pirate` - Pirate speak
- `cowboy` - Old-timey cowboy
- `redneck` - MRDUCKS style

### Fantasy
- `elven` - High Elven
- `dwarven` - Mountain Dwarf
- `draconic` - Ancient Dragon
- `wizard` - Arcane Scholar
- `monk` - Serene Monk
- `rogue` - Thieves' Cant
- `orc` - Orcish Grunt
- `bard` - Bardic Verse

### Sports
- `hype_man` - The Hype Man
- `play_by_play` - Play-by-Play Commentary
- `gritty_coach` - Gritty Coach
- `golf_whisperer` - Golf Whisperer
- `moneyball_analyst` - Moneyball Analyst
- `the_goon` - The Goon (Hockey)

### Decode
- `decipher` - Universal Decipher

## Local Testing

Run the service locally:

```bash
export GEMINI_API_KEY="your-api-key-here"
node api/translate.js
```

This will list available modes and perform a test translation if the API key is set.

## Deployment

This service is designed to be deployed as a serverless function on platforms like:

- Vercel
- Netlify
- AWS Lambda
- Google Cloud Functions

The `handler` export is compatible with these platforms.

## Architecture

The service follows a clean architecture:

1. Accepts JSON request with `text` and `modeId`
2. Validates input parameters
3. Finds the translation mode in `@iris-translator/common`
4. Extracts the appropriate `prompt` or `systemInstruction`
5. Calls Google Gemini API with the prepared prompt
6. Returns the translated text

## Error Handling

The service handles various error cases:

- Missing or invalid parameters (400)
- Mode not found (404)
- Mode doesn't support LLM translation (400)
- Missing API key (500)
- LLM API errors (500)

## Dependencies

- `@google/generative-ai` - Google Gemini API client
- `@iris-translator/common` - Shared translation modes configuration
