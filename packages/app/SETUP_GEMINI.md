# Setup Instructions for Google Gemini API

## Secure API Key Configuration

This application uses Google Gemini as the primary LLM provider. To configure it securely:

### 1. Get Your API Key
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key for Gemini

### 2. Configure Locally (Development)
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **IMPORTANT**: Never commit the `.env` file! It's already in `.gitignore` for security.

### 3. Configure for Production
For production deployments, set the environment variable through your hosting platform:
- **Vercel**: Add `VITE_GEMINI_API_KEY` in Project Settings → Environment Variables
- **Netlify**: Add in Site Settings → Environment Variables
- **GitHub Pages**: Use GitHub Secrets and build-time injection
- **Docker**: Pass via `-e` flag or docker-compose environment section

## Fallback Behavior

The application will gracefully handle missing or invalid API keys:

1. **Primary**: Google Gemini API (if configured)
2. **Fallback 1**: Hugging Face Inference API (free, no key needed)
3. **Fallback 2**: Together AI (free, no key needed)
4. **Fallback 3**: Local demo translations (offline mode)

This ensures the application works even without API configuration!

## Security Best Practices

✅ **DO:**
- Store API keys in `.env` files (gitignored)
- Use environment variables for production
- Rotate API keys periodically
- Use different keys for dev/staging/production

❌ **DON'T:**
- Commit API keys to version control
- Share API keys in public channels
- Hardcode API keys in source code
- Use production keys in development

## Testing Without API Key

The application works perfectly without any API configuration - it will automatically use the local demo translation mode. This is great for:
- Development without API costs
- Offline demonstrations
- Testing the UI/UX
