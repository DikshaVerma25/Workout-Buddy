import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Layout/Navbar';
import { format } from 'date-fns';
import './Feed.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Feed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await axios.get(`${API_URL}/feed`);
      setFeed(response.data);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="loading">Loading feed...</div>
        </div>
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <h1 className="page-title">Friends' Workouts</h1>
          <div className="card">
            <div className="empty-state">
              <p>No workouts from friends yet. Add some friends to see their workouts here!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group by date
  const groupedFeed = feed.reduce((acc, workout) => {
    const date = format(new Date(workout.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(workout);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedFeed).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="page-title">Friends' Workouts</h1>
        <p className="page-subtitle">See what your friends have been up to! 💪</p>

        {sortedDates.map(date => (
          <div key={date} className="feed-day">
            <h2 className="feed-date">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h2>
            <div className="feed-workouts">
              {groupedFeed[date].map(workout => (
                <div key={workout.id} className="feed-workout-card">
                  <div className="feed-workout-header">
                    <div className="feed-user">
                      <div className="feed-avatar">
                        {workout.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{workout.username}</strong>
                        <div className="feed-exercise">{workout.exercise}</div>
                      </div>
                    </div>
                  </div>
                  <div className="feed-workout-details">
                    {(() => {
                      const strengthBasedTypes = ['strength training', 'crossfit', 'hiit'];
                      return strengthBasedTypes.includes(workout.type) || (!workout.type && workout.sets);
                    })() ? (
                      <>
                        <div className="feed-stat">
                          <span className="feed-stat-label">Sets</span>
                          <span className="feed-stat-value">{workout.sets || 0}</span>
                        </div>
                        <div className="feed-stat">
                          <span className="feed-stat-label">Reps</span>
                          <span className="feed-stat-value">{workout.reps || 0}</span>
                        </div>
                        {workout.weight && (
                          <div className="feed-stat">
                            <span className="feed-stat-label">Weight</span>
                            <span className="feed-stat-value">{workout.weight} lbs</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="feed-stat feed-stat-duration">
                        <span className="feed-stat-label">Duration</span>
                        <span className="feed-stat-value">
                          {(() => {
                            const totalMinutes = workout.duration || 0;
                            const hours = Math.floor(totalMinutes / 60);
                            const minutes = totalMinutes % 60;
                            if (hours > 0 && minutes > 0) {
                              return `${hours}h ${minutes}m`;
                            } else if (hours > 0) {
                              return `${hours}h`;
                            } else {
                              return `${minutes}m`;
                            }
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                  {workout.notes && (
                    <div className="feed-notes">
                      <em>"{workout.notes}"</em>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;

