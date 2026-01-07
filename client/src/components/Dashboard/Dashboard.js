import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Layout/Navbar';
import WorkoutForm from './WorkoutForm';
import WorkoutList from './WorkoutList';
import WorkoutCalendar from './WorkoutCalendar';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showWorkoutList, setShowWorkoutList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/workouts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkout = async (workoutData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Adding workout with data:', workoutData);
      console.log('Using token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.post(`${API_URL}/workouts`, workoutData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Workout added successfully:', response.data);
      setWorkouts([response.data, ...workouts]);
      setShowForm(false);
    } catch (error) {
      console.error('=== ERROR ADDING WORKOUT ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error message:', error.message);
      
      if (error.response) {
        console.error('Full error details:', JSON.stringify(error.response.data, null, 2));
      }
      
      throw error;
    }
  };

  const handleDeleteWorkout = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/workouts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const todayWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date).toDateString();
    const today = new Date().toDateString();
    return workoutDate === today;
  });

  const totalWorkouts = workouts.length;
  
  // Calculate streak (consecutive days with workouts)
  const calculateStreak = () => {
    if (workouts.length === 0) return 0;

    // Get unique dates that have workouts, normalized to midnight
    const workoutDates = [...new Set(workouts.map(w => {
      const date = new Date(w.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }))].sort((a, b) => b - a); // Sort descending (most recent first)

    if (workoutDates.length === 0) return 0;

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    // If most recent workout is not today or yesterday, streak is 0
    const mostRecent = workoutDates[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (mostRecent < yesterday.getTime()) {
      return 0; // Streak broken (most recent workout is more than 1 day ago)
    }

    // Count consecutive days
    let streak = 1;
    let expectedDate = mostRecent === todayTime ? todayTime : yesterday.getTime();
    
    for (let i = 1; i < workoutDates.length; i++) {
      const prevDay = new Date(expectedDate);
      prevDay.setDate(prevDay.getDate() - 1);
      const expectedPrevDay = prevDay.getTime();
      
      if (workoutDates[i] === expectedPrevDay) {
        streak++;
        expectedDate = expectedPrevDay;
      } else {
        break; // Streak broken
      }
    }

    return streak;
  };

  const streak = calculateStreak();
  
  const totalDuration = workouts.reduce((sum, w) => {
    if (w.duration) {
      const minutes = w.durationUnit === 'hours' ? w.duration * 60 : w.duration;
      return sum + minutes;
    }
    return sum;
  }, 0);

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>My Workouts</h1>
            <p className="slogan">Because workouts are better together</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Cancel' : '✨ Log Workout'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <WorkoutForm 
              onSubmit={handleAddWorkout} 
              initialDate={selectedDate}
              onClose={() => {
                setShowForm(false);
                setSelectedDate(null);
              }}
            />
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-value">{totalWorkouts}</div>
            <div className="stat-label">Total Workouts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">{todayWorkouts.length}</div>
            <div className="stat-label">Today's Workouts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-value">{streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
          {totalDuration > 0 && (
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">
                {totalDuration >= 60 
                  ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`
                  : `${totalDuration}m`
                }
              </div>
              <div className="stat-label">Total Duration</div>
            </div>
          )}
        </div>

        {/* Workout Calendar */}
        {!loading && (
          <WorkoutCalendar 
            workouts={workouts} 
            onDateClick={(date) => {
              setSelectedDate(date);
              setShowForm(true);
            }}
          />
        )}

        {/* Workout Logs Toggle */}
        {!loading && workouts.length > 0 && (
          <div className="workout-logs-section">
            <button
              className="workout-logs-toggle"
              onClick={() => setShowWorkoutList(!showWorkoutList)}
            >
              <span className="toggle-icon">{showWorkoutList ? '▼' : '▶'}</span>
              <span className="toggle-text">Workout Logs ({workouts.length})</span>
            </button>
            {showWorkoutList && (
              <div className="workout-logs-content">
                <WorkoutList workouts={workouts} onDelete={handleDeleteWorkout} />
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="loading">Loading workouts...</div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

