# How to Start the Server

## Option 1: Start Both Server and Client Together (Recommended)

From the root directory (`/Users/dushyantverma/Workout-Buddy`), run:

```bash
npm run dev
```

This will start:
- **Backend server** on `http://localhost:5000`
- **Frontend React app** on `http://localhost:3000`

## Option 2: Start Server Only

If you only want to start the backend server:

```bash
cd server
npm run dev
```

Or:

```bash
cd server
node index.js
```

## Option 3: Start Server and Client Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## Verify Server is Running

1. Open your browser and go to: `http://localhost:5000/api/health`
2. You should see: `{"status":"ok","message":"Server is running"}`

## Troubleshooting

### Port 5000 Already in Use

If you get an error that port 5000 is already in use:

```bash
# Find and kill the process using port 5000
lsof -ti:5000 | xargs kill -9
```

### Server Not Starting

1. Make sure you've installed dependencies:
   ```bash
   npm run install-all
   ```

2. Check for errors in the terminal output

3. Make sure the `server/data` directory exists (it will be created automatically)

## Quick Start Command

```bash
# From the root directory
npm run dev
```

Then open `http://localhost:3000` in your browser!

