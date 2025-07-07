# Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## Quick Setup

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd Backend
npm install
cd ..
```

### 2. Configure Environment Variables
Create a `.env.local` file in the `Backend` directory:

```bash
# Backend/.env.local
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
NODE_ENV=development
```

**To get an OpenAI API key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key and paste it in the `.env.local` file

### 3. Start the Backend Server
```bash
cd Backend
npm run dev
```

The server will start on `http://localhost:3001`

### 4. Start the Frontend
In a new terminal:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Troubleshooting

### Common Issues

**1. "Backend server is not running"**
- Make sure you're in the Backend directory when running `npm run dev`
- Check that port 3001 is not already in use
- Verify the server started without errors

**2. "OpenAI API key not found"**
- Ensure the `.env.local` file exists in the Backend directory
- Check that the API key is correctly formatted
- Restart the backend server after adding the API key

**3. "Failed to generate technotype"**
- Verify your OpenAI API key is valid and has credits
- Check the browser console for detailed error messages
- Ensure both frontend and backend are running

**4. CORS errors**
- The backend is configured with CORS enabled
- If you're still getting CORS errors, check that the frontend is running on the correct port

### Health Check
You can test if the backend is working by visiting:
`http://localhost:3001/api/health`

This should return: `{"status":"ok"}`

## Development

### Project Structure
```
├── src/                    # Frontend React code
├── Backend/               # Backend Express server
│   ├── src/
│   │   └── server.js      # Main server file
│   └── package.json
├── package.json           # Frontend dependencies
└── setup.md              # This file
```

### Available Scripts
- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `cd Backend && npm run dev` - Start backend development server
- `cd Backend && npm start` - Start backend production server 