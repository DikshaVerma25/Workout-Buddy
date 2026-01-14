import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiAward, FiActivity } from 'react-icons/fi';
import { MdEmojiEvents } from 'react-icons/md';
import Navbar from '../Layout/Navbar';
import './Leaderboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/leaderboard`, {
        params: { period }
      });
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) return <MdEmojiEvents style={{ color: '#ffd700' }} />;
    if (index === 1) return <MdEmojiEvents style={{ color: '#c0c0c0' }} />;
    if (index === 2) return <MdEmojiEvents style={{ color: '#cd7f32' }} />;
    return <span className="rank-number-text">{index + 1}.</span>;
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-subtitle">Compete with your friends and see who's on top!</p>

        <div className="card">
          <div className="period-selector">
            <button
              className={`period-btn ${period === 'week' ? 'active' : ''}`}
              onClick={() => setPeriod('week')}
            >
              This Week
            </button>
            <button
              className={`period-btn ${period === 'month' ? 'active' : ''}`}
              onClick={() => setPeriod('month')}
            >
              This Month
            </button>
            <button
              className={`period-btn ${period === 'all' ? 'active' : ''}`}
              onClick={() => setPeriod('all')}
            >
              All Time
            </button>
          </div>
        </div>

        {loading ? (
          <div className="card">
            <div className="loading">Loading leaderboard...</div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <p>No data available. Add friends and log workouts to see the leaderboard!</p>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="leaderboard">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`leaderboard-item ${entry.isCurrentUser ? 'current-user' : ''}`}
                >
                  <div className="leaderboard-rank">
                    <span className="rank-number">{getRankIcon(index)}</span>
                  </div>
                  <div className="leaderboard-avatar">
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="leaderboard-info">
                    <div className="leaderboard-name">
                      {entry.username}
                      {entry.isCurrentUser && <span className="you-badge">You</span>}
                    </div>
                    <div className="leaderboard-stats">
                      <div className="stat-item">
                        <FiActivity style={{ marginRight: '0.5rem', opacity: 0.7 }} />
                        <span className="stat-label">Workouts</span>
                        <span className="stat-value">{entry.totalWorkouts}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;

