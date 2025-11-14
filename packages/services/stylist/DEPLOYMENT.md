# Deployment Guide - Stylist Service

This guide explains how to deploy the Stylist service to various serverless platforms.

## Prerequisites

Before deploying, you'll need:
1. A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
2. An account on your chosen deployment platform
3. The Vercel CLI, Netlify CLI, or platform-specific tools

## Option 1: Vercel (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Navigate to the stylist service
```bash
cd packages/services/stylist
```

### Step 3: Create vercel.json
Create a `vercel.json` file in the stylist directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/translate.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/translate",
      "dest": "api/translate.js"
    }
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

### Step 4: Deploy
```bash
vercel
```

### Step 5: Set environment variables
```bash
vercel env add GEMINI_API_KEY
```

When prompted, paste your Gemini API key.

### Step 6: Test your deployment
```bash
curl -X POST https://your-deployment.vercel.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","modeId":"pirate"}'
```

## Option 2: Netlify

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Create netlify.toml
Create a `netlify.toml` file in the stylist directory:

```toml
[build]
  functions = "api"

[[redirects]]
  from = "/api/translate"
  to = "/.netlify/functions/translate"
  status = 200
```

### Step 3: Deploy
```bash
netlify deploy --prod
```

### Step 4: Set environment variables
```bash
netlify env:set GEMINI_API_KEY "your-api-key"
```

## Option 3: AWS Lambda

### Step 1: Install AWS CLI and SAM
```bash
pip install awscli aws-sam-cli
```

### Step 2: Create template.yaml
Create a `template.yaml` file:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  TranslateFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: api/translate.handler
      Runtime: nodejs18.x
      Environment:
        Variables:
          GEMINI_API_KEY: !Ref GeminiApiKey
      Events:
        Translate:
          Type: Api
          Properties:
            Path: /api/translate
            Method: post

Parameters:
  GeminiApiKey:
    Type: String
    NoEcho: true
```

### Step 3: Deploy
```bash
sam build
sam deploy --guided
```

## Option 4: Google Cloud Functions

### Step 1: Install gcloud CLI
Follow: https://cloud.google.com/sdk/docs/install

### Step 2: Deploy
```bash
gcloud functions deploy stylist-translate \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point handler \
  --set-env-vars GEMINI_API_KEY=your-api-key
```

## Testing Your Deployment

Once deployed, test with curl:

```bash
# Test successful translation
curl -X POST https://your-deployment-url/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "modeId": "pirate"
  }'

# Expected response:
# {"translatedText":"Ahoy there, matey! Welcome to the seven seas!"}

# Test error handling - invalid mode
curl -X POST https://your-deployment-url/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello",
    "modeId": "invalid"
  }'

# Expected response:
# {"error":"Translation mode \"invalid\" not found"}
```

## Environment Variables

All platforms require the `GEMINI_API_KEY` environment variable:

| Platform | How to Set |
|----------|-----------|
| Vercel | `vercel env add GEMINI_API_KEY` |
| Netlify | `netlify env:set GEMINI_API_KEY "key"` |
| AWS Lambda | Set in template.yaml or AWS Console |
| Google Cloud | `--set-env-vars GEMINI_API_KEY=key` |

## Security Best Practices

1. **Never commit API keys** - Always use environment variables
2. **Use secrets management** - Platform-specific secrets (AWS Secrets Manager, etc.)
3. **Enable CORS carefully** - Only allow your frontend domains
4. **Add rate limiting** - Prevent abuse (use platform features)
5. **Monitor usage** - Set up alerts for unexpected traffic

## CORS Configuration

If you need to access the API from a web browser, add CORS headers:

```javascript
// In translate.js, update the handler:
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://your-frontend.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // ... rest of the code
}
```

## Monitoring

### Vercel
- View logs: `vercel logs your-deployment-url`
- Dashboard: https://vercel.com/dashboard

### Netlify
- View logs: `netlify functions:log translate`
- Dashboard: https://app.netlify.com

### AWS Lambda
- CloudWatch Logs: https://console.aws.amazon.com/cloudwatch
- X-Ray for tracing

### Google Cloud Functions
- Logs: `gcloud functions logs read stylist-translate`
- Cloud Console: https://console.cloud.google.com

## Troubleshooting

### "GEMINI_API_KEY not configured"
- Verify environment variable is set
- Redeploy after setting the variable
- Check variable name spelling

### "Translation mode not found"
- Verify modeId matches available modes
- Check that @iris-translator/common is installed
- Run `npm install` in the stylist directory

### Timeout errors
- Increase function timeout (default 10s, try 30s)
- Check Gemini API rate limits
- Consider switching to gemini-pro for better reliability

## Cost Estimation

### Gemini API
- Free tier: 60 requests/minute
- Pricing: https://ai.google.dev/pricing

### Hosting Platforms
- **Vercel**: Free tier includes 100GB bandwidth, 100 serverless function invocations/day
- **Netlify**: Free tier includes 125k function invocations/month
- **AWS Lambda**: Free tier includes 1M requests/month
- **Google Cloud Functions**: Free tier includes 2M invocations/month

## Next Steps

1. Deploy to your chosen platform
2. Test the endpoint
3. Integrate with your frontend app
4. Set up monitoring and alerts
5. Configure rate limiting
6. Consider adding a CDN

## Support

For issues or questions:
- Check the README.md for API documentation
- Review ARCHITECTURE.md for design details
- Run `npm test` to validate the service locally
