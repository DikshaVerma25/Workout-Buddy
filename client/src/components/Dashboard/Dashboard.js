import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, isToday } from 'date-fns';
import Navbar from '../Layout/Navbar';
import WorkoutForm from './WorkoutForm';
import WorkoutList from './WorkoutList';
import WorkoutCalendar, { getWorkoutTypeColor } from './WorkoutCalendar';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateWorkouts, setSelectedDateWorkouts] = useState([]);

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
      
      // Update workouts list
      const updatedWorkouts = [response.data, ...workouts];
      setWorkouts(updatedWorkouts);
      
      // Update selected date workouts if the new workout is for the selected date
      if (selectedDate && response.data.date === selectedDate) {
        setSelectedDateWorkouts([response.data, ...selectedDateWorkouts]);
      }
      
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
      
      // Update workouts list
      const updatedWorkouts = workouts.filter(w => w.id !== id);
      setWorkouts(updatedWorkouts);
      
      // Update selected date workouts if workout was deleted from selected date
      if (selectedDate) {
        const deletedWorkout = workouts.find(w => w.id === id);
        if (deletedWorkout && deletedWorkout.date === selectedDate) {
          const updatedSelectedWorkouts = selectedDateWorkouts.filter(w => w.id !== id);
          setSelectedDateWorkouts(updatedSelectedWorkouts);
          
          // If no more workouts on this date, clear selection
          if (updatedSelectedWorkouts.length === 0) {
            setSelectedDate(null);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const todayWorkouts = workouts.filter(w => {
    // workout.date is already a YYYY-MM-DD string
    const today = new Date().toISOString().split('T')[0];
    const workoutDate = typeof w.date === 'string' ? w.date : new Date(w.date).toISOString().split('T')[0];
    return workoutDate === today;
  });

  const totalWorkouts = workouts.length;
  
  // Calculate streak (consecutive days with workouts)
  const calculateStreak = () => {
    if (workouts.length === 0) return 0;

    // Get unique dates that have workouts
    // workout.date is already a YYYY-MM-DD string
    const workoutDates = [...new Set(workouts.map(w => {
      const dateStr = typeof w.date === 'string' ? w.date : new Date(w.date).toISOString().split('T')[0];
      // Convert YYYY-MM-DD to timestamp for comparison
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
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
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setSelectedDate(null);
                setSelectedDateWorkouts([]);
              } else {
                setShowForm(true);
                setSelectedDate(null);
                setSelectedDateWorkouts([]);
              }
            }}
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
            selectedDate={selectedDate}
            onDateClick={(date, dayWorkouts) => {
              setSelectedDate(date);
              setSelectedDateWorkouts(dayWorkouts || []);
              // Close form if clicking on a date with workouts
              if (dayWorkouts.length > 0) {
                setShowForm(false);
              } else {
                // No workouts on this date, open form to add one
                setShowForm(true);
              }
            }}
          />
        )}

        {/* Selected Date Details */}
        {!loading && selectedDate && selectedDateWorkouts.length > 0 && (
          <div className="card selected-date-details">
            <div className="selected-date-header">
              <h3>
                {(() => {
                  const [year, month, day] = selectedDate.split('-').map(Number);
                  const dateObj = new Date(year, month - 1, day);
                  const isTodayDate = isToday(dateObj);
                  return (
                    <>
                      {isTodayDate && <span className="today-badge">Today</span>}
                      {format(dateObj, 'EEEE, MMMM d, yyyy')}
                    </>
                  );
                })()}
              </h3>
              <button
                className="btn-icon"
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedDateWorkouts([]);
                }}
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="selected-date-workouts">
              {selectedDateWorkouts.map(workout => (
                <div key={workout.id} className="workout-detail-card">
                  <div className="workout-detail-header">
                    <h4>{workout.exercise}</h4>
                    <button
                      className="btn-delete-small"
                      onClick={() => {
                        handleDeleteWorkout(workout.id);
                        setSelectedDateWorkouts(selectedDateWorkouts.filter(w => w.id !== workout.id));
                      }}
                      title="Delete workout"
                    >
                      ×
                    </button>
                  </div>
                  <div className="workout-detail-type" style={{ color: getWorkoutTypeColor(workout.type) }}>
                    {workout.type}
                  </div>
                  {workout.duration && (
                    <div className="workout-detail-info">
                      <span>Duration: </span>
                      {workout.duration >= 60
                        ? `${Math.floor(workout.duration / 60)}h ${workout.duration % 60}m`
                        : `${workout.duration}m`
                      }
                    </div>
                  )}
                  {workout.notes && (
                    <div className="workout-detail-notes">
                      <strong>Notes:</strong> {workout.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={() => {
                setShowForm(true);
              }}
            >
              + Add Another Workout to {(() => {
                const [year, month, day] = selectedDate.split('-').map(Number);
                const dateObj = new Date(year, month - 1, day);
                return format(dateObj, 'MMM d');
              })()}
            </button>
          </div>
        )}

        {/* Show form when adding workout (either via button or clicking empty date) */}
        {!loading && showForm && (
          <div className="card">
            <WorkoutForm 
              onSubmit={handleAddWorkout} 
              initialDate={selectedDate}
              onClose={() => {
                setShowForm(false);
                // Don't clear selectedDate if there are workouts on that date
                if (selectedDateWorkouts.length === 0) {
                  setSelectedDate(null);
                }
              }}
            />
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

