# Vercel Deployment Instructions

## Setup Complete! ✅

Your project is now configured for Vercel deployment with both frontend and backend functionality.

## What was configured:

1. **API Functions**: Created serverless functions in `/api/` directory
   - `/api/health.js` - Health check endpoint
   - `/api/generate-next-question.js` - Conversation question generation
   - `/api/generate-technotype-quiz.js` - Quiz-based technotype generation
   - `/api/generate-technotype-conversation.js` - Conversation-based technotype generation

2. **Frontend Updates**: Modified `src/lib/openai.ts` to work with both local development and production

3. **Vercel Configuration**: Added `vercel.json` with proper settings

## How to Deploy:

### Option 1: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts and set your environment variables
```

### Option 2: Deploy via Vercel Dashboard
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the following environment variable in Vercel dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key

## Build Command for Vercel:
```bash
npm run build:vercel
```

## Local Development:
```bash
# Start both frontend and backend
npm run dev:full

# Or start them separately
npm run dev          # Frontend only
npm run dev:backend  # Backend only
```

## How it works:

- **Development**: Frontend calls `http://localhost:3001/api/*` endpoints
- **Production**: Frontend calls `/api/*` endpoints (Vercel serverless functions)

The API base URL automatically switches based on the hostname, so no code changes are needed between environments.

## Environment Variables:
Make sure to set `OPENAI_API_KEY` in your Vercel project settings. 