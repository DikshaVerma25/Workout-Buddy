# 💪 Workout Buddy

A social workout tracking web application where you can log your workouts, connect with friends, and compete on leaderboards to stay motivated!

## Features

- **Workout Logging**: Track your exercises with sets, reps, weight, and notes
- **Friends System**: Add friends and see their workout activities
- **Social Feed**: View your friends' recent workouts in a feed
- **Leaderboard**: Compete with friends with weekly, monthly, and all-time rankings
- **User Authentication**: Secure login and registration system
- **Beautiful UI**: Modern, responsive design with gradient backgrounds

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- CSS3 with modern styling

### Backend
- Node.js with Express
- JWT for authentication
- bcryptjs for password hashing
- JSON file storage (easily upgradeable to a database)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install all dependencies** (root, server, and client):
   ```bash
   npm run install-all
   ```

   Or manually:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

2. **Start the development servers**:
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5001`
   - Frontend React app on `http://localhost:3000`

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

### Usage

1. Open your browser and navigate to `http://localhost:3000`
2. The backend API is available at `http://localhost:5001`
2. Register a new account or login
3. Start logging your workouts on the Dashboard
4. Add friends by searching for their username or email
5. View your friends' workouts in the Feed
6. Check the Leaderboard to see who's on top!

## Project Structure

```
Workout-Buddy/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Auth/       # Login/Register
│   │   │   ├── Dashboard/  # Workout logging
│   │   │   ├── Friends/    # Friends management
│   │   │   ├── Feed/       # Social feed
│   │   │   ├── Leaderboard/# Competition
│   │   │   └── Layout/     # Navbar
│   │   ├── context/        # Auth context
│   │   └── App.js
│   └── package.json
├── server/                 # Express backend
│   ├── data/              # JSON data storage (auto-created)
│   ├── index.js           # Main server file
│   └── package.json
└── package.json           # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Workouts
- `GET /api/workouts` - Get user's workouts
- `POST /api/workouts` - Create new workout
- `DELETE /api/workouts/:id` - Delete workout

### Friends
- `GET /api/friends` - Get user's friends list
- `GET /api/users/search?query=...` - Search for users
- `POST /api/friends` - Add friend
- `DELETE /api/friends/:friendshipId` - Remove friend

### Social
- `GET /api/feed` - Get friends' workouts feed
- `GET /api/leaderboard?period=week|month|all` - Get leaderboard

## Data Storage

Currently uses JSON files for data storage (in `server/data/`):
- `users.json` - User accounts
- `workouts.json` - All workouts
- `friendships.json` - Friend relationships

**Note**: For production, consider upgrading to a proper database like MongoDB, PostgreSQL, or MySQL.

## Environment Variables

Create a `.env` file in the `server/` directory for production:

```
PORT=5000
JWT_SECRET=your-secret-key-here
```

## Future Enhancements

- [ ] Real database integration (MongoDB/PostgreSQL)
- [ ] Workout templates and programs
- [ ] Progress charts and analytics
- [ ] Push notifications
- [ ] Workout challenges
- [ ] Photo uploads
- [ ] Mobile app version

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ for fitness enthusiasts who want to stay motivated together!

