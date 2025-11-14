# Quick Start Guide - Stylist Service

Get started with the Stylist service in 5 minutes.

## For Developers

### 1. Install Dependencies
```bash
# From repository root
npm install
```

This installs all dependencies and links workspace packages.

### 2. Run Tests
```bash
# Test the stylist service
cd packages/services/stylist
npm test
```

All validation tests should pass ✅

### 3. Test Locally (Optional)
If you have a Gemini API key:

```bash
export GEMINI_API_KEY="your-api-key"
node api/translate.js
```

This will run a test translation with the pirate mode.

### 4. Build the App
```bash
# From repository root
npm run build
```

The app should build successfully using the shared common package.

## For Deployers

### Quick Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to stylist service
cd packages/services/stylist

# 3. Deploy
vercel

# 4. Set API key
vercel env add GEMINI_API_KEY
# (paste your key when prompted)

# 5. Test it
curl -X POST https://your-deployment.vercel.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","modeId":"pirate"}'
```

See `DEPLOYMENT.md` for other platforms.

## API Usage

### Example Request
```bash
curl -X POST https://your-api-url/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "modeId": "pirate"
  }'
```

### Example Response
```json
{
  "translatedText": "Ahoy there, matey! Welcome aboard the seven seas!"
}
```

### Available Mode IDs

**Literary:** shakespeare, haiku, iambic

**Dialects:** pirate, cowboy, redneck

**Fantasy:** elven, dwarven, draconic, wizard, monk, rogue, orc, bard

**Sports:** hype_man, play_by_play, gritty_coach, golf_whisperer, moneyball_analyst, the_goon

**Decode:** decipher

## Troubleshooting

### Build Fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Common Package Not Found
```bash
# Reinstall from root
cd /path/to/repo
npm install
```

### API Key Issues
```bash
# Verify it's set
echo $GEMINI_API_KEY

# Set it for current session
export GEMINI_API_KEY="your-key"
```

## File Structure

```
IRISTranslator/
├── packages/
│   ├── common/                    # Shared package
│   │   └── src/
│   │       ├── index.js          # Exports
│   │       └── translationModes.js
│   ├── app/                       # Frontend (React)
│   │   └── src/
│   │       └── pages/
│   │           └── Translator.jsx # Uses @iris-translator/common
│   └── services/
│       └── stylist/              # Translation service
│           ├── api/
│           │   └── translate.js  # Main API endpoint
│           ├── README.md         # Documentation
│           ├── test.js           # Tests
│           └── .env.example      # Config template
└── STYLIST_SERVICE_SUMMARY.md    # This implementation
```

## Getting Help

1. Check `packages/services/stylist/README.md` for API docs
2. Read `packages/services/stylist/ARCHITECTURE.md` for design details
3. See `packages/services/stylist/DEPLOYMENT.md` for deployment guides
4. Review `STYLIST_SERVICE_SUMMARY.md` for full implementation details

## Next Steps

1. ✅ Deploy the stylist service to Vercel/Netlify
2. ✅ Get a Gemini API key and configure it
3. ✅ Test the endpoint with curl
4. ✅ Integrate the API endpoint into your frontend app
5. ✅ Set up monitoring and alerts

---

**Pro Tip:** Start with Vercel's free tier - it's the easiest deployment option and includes generous limits for testing.
