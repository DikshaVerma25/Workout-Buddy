import React from 'react';
import { format, isToday } from 'date-fns';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { getWorkoutIcon } from './WorkoutIcons';
import './WorkoutList.css';

function WorkoutList({ workouts, onDelete }) {
  if (workouts.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">
            <HiOutlineClipboardDocumentList />
          </div>
          <p>No workouts logged yet. Start by logging your first workout!</p>
        </div>
      </div>
    );
  }

  // Group workouts by date
  // workout.date is already a YYYY-MM-DD string, so use it directly
  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const date = typeof workout.date === 'string' ? workout.date : format(new Date(workout.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(workout);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedWorkouts).sort((a, b) => new Date(b) - new Date(a));

  const getWorkoutTypeIcon = (type) => {
    return getWorkoutIcon(type, 32, false);
  };

  const getWorkoutTypeLabel = (type) => {
    const labels = {
      'strength training': 'Strength Training',
      'cardio': 'Cardio',
      'biking': 'Biking',
      'yoga': 'Yoga',
      'pilates': 'Pilates',
      'zumba': 'Zumba',
      'hiit': 'HIIT',
      'crossfit': 'CrossFit',
      'light walk': 'Light Walk',
      'sports and activities': 'Sports & Activities',
      'breath work': 'Breath Work',
      'other': 'Other'
    };
    return labels[type] || type || 'Workout';
  };

  return (
    <div>
      {sortedDates.map(date => {
        // Parse YYYY-MM-DD string directly to avoid timezone issues
        // date is already a YYYY-MM-DD string, parse it as local date
        const [year, month, day] = date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const isTodayDate = isToday(dateObj);
        
        return (
          <div key={date} className="workout-day">
            <h3 className="workout-date">
              {isTodayDate && <span className="today-badge">Today</span>}
              {format(dateObj, 'EEEE, MMMM d, yyyy')}
            </h3>
            <div className="workouts-grid">
              {groupedWorkouts[date].map(workout => {
                const strengthBasedTypes = ['strength training', 'crossfit', 'hiit'];
                const isStrength = strengthBasedTypes.includes(workout.type) || (!workout.type && workout.sets);
                const durationRequiredTypes = ['cardio', 'biking', 'yoga', 'pilates', 'zumba', 'light walk', 'sports and activities', 'breath work', 'other'];
                const isDurationBased = workout.duration || (!isStrength && durationRequiredTypes.includes(workout.type));
                
                return (
                    <div key={workout.id} className="workout-card">
                    <div className="workout-header">
                      <div className="workout-title-group">
                        <span className="workout-type-icon">
                          {getWorkoutTypeIcon(workout.type || 'strength')}
                        </span>
                        <div>
                          <h4>{workout.exercise}</h4>
                          <span className="workout-type-label">{getWorkoutTypeLabel(workout.type || 'strength')}</span>
                        </div>
                      </div>
                      <button
                        className="btn-delete"
                        onClick={() => onDelete(workout.id)}
                        title="Delete workout"
                      >
                        ×
                      </button>
                    </div>
                    
                    {isStrength ? (
                      <div className="workout-details">
                        <div className="workout-stat">
                          <span className="stat-label">Sets</span>
                          <span className="stat-value">{workout.sets || 0}</span>
                        </div>
                        <div className="workout-stat">
                          <span className="stat-label">Reps</span>
                          <span className="stat-value">{workout.reps || 0}</span>
                        </div>
                        {workout.weight && (
                          <div className="workout-stat">
                            <span className="stat-label">Weight</span>
                            <span className="stat-value">{workout.weight} lbs</span>
                          </div>
                        )}
                        {workout.duration && (
                          <div className="workout-stat workout-stat-duration">
                            <span className="stat-label">Duration</span>
                            <span className="stat-value">
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
                    ) : (
                      <div className="workout-details">
                        <div className="workout-stat workout-stat-duration">
                          <span className="stat-label">Duration</span>
                          <span className="stat-value">
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
                      </div>
                    )}
                    
                    {workout.notes && (
                      <div className="workout-notes">
                        <strong>Notes:</strong> {workout.notes}
                      </div>
                    )}
                    
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WorkoutList;
