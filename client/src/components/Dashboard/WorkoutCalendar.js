import React from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import './WorkoutCalendar.css';

// Color mapping for different workout types - Subtle pastel colors
export const getWorkoutTypeColor = (type) => {
  const colors = {
    'strength training': '#7c7cff', // Soft purple
    'cardio': '#ff7c9f', // Soft pink
    'biking': '#5eb3ff', // Soft blue
    'yoga': '#4dd4a0', // Soft green
    'pilates': '#ff8fb3', // Soft rose
    'zumba': '#ffb84d', // Soft yellow
    'hiit': '#ff6b6b', // Soft red
    'crossfit': '#ffa366', // Soft orange
    'light walk': '#5ee0d0', // Soft cyan
    'sports and activities': '#ff9e9e', // Soft coral
    'breath work': '#b380ff', // Soft lavender
    'other': '#7dd3b8' // Soft mint
  };
  return colors[type] || '#7c7cff';
};

function WorkoutCalendar({ workouts, onDateClick, selectedDate }) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start from Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Group workouts by date
  const workoutsByDate = {};
  workouts.forEach(w => {
    const dateKey = typeof w.date === 'string' && w.date.match(/^\d{4}-\d{2}-\d{2}$/)
      ? w.date
      : format(new Date(w.date), 'yyyy-MM-dd');
    
    if (!workoutsByDate[dateKey]) {
      workoutsByDate[dateKey] = [];
    }
    workoutsByDate[dateKey].push(w);
  });
  
  const monthName = format(today, 'MMMM yyyy');
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < daysInMonth.length; i += 7) {
    weeks.push(daysInMonth.slice(i, i + 7));
  }
  
  const isCurrentMonth = (date) => {
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };
  
  return (
    <div className="workout-calendar-card">
      <div className="calendar-header">
        <h3>{monthName}</h3>
      </div>
      <div className="calendar-grid">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {daysInMonth.map((day, index) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayWorkouts = workoutsByDate[dayKey] || [];
          const hasWorkout = dayWorkouts.length > 0;
          const isTodayDate = isToday(day);
          const isCurrentMonthDay = isCurrentMonth(day);
          const isSelected = selectedDate === dayKey;
          
          const handleClick = () => {
            if (isCurrentMonthDay && onDateClick) {
              onDateClick(dayKey, dayWorkouts);
            }
          };

          // Get workout type label
          const getWorkoutLabel = (type) => {
            const labels = {
              'strength training': 'Strength',
              'cardio': 'Cardio',
              'biking': 'Bike',
              'yoga': 'Yoga',
              'pilates': 'Pilates',
              'zumba': 'Zumba',
              'hiit': 'HIIT',
              'crossfit': 'CrossFit',
              'light walk': 'Walk',
              'sports and activities': 'Sports',
              'breath work': 'Breath',
              'other': 'Other'
            };
            return labels[type] || type;
          };

          return (
            <div
              key={index}
              className={`calendar-day ${hasWorkout ? 'has-workout' : ''} ${isTodayDate ? 'today' : ''} ${isSelected ? 'selected' : ''} ${!isCurrentMonthDay ? 'other-month' : ''} ${isCurrentMonthDay ? 'clickable' : ''}`}
              onClick={handleClick}
            >
              <span className="day-number">{format(day, 'd')}</span>
              {hasWorkout && (
                <div className="workout-strips">
                  {dayWorkouts.slice(0, 3).map((workout, idx) => (
                    <div
                      key={idx}
                      className="workout-strip"
                      style={{ backgroundColor: getWorkoutTypeColor(workout.type) }}
                      title={workout.exercise}
                    >
                      {getWorkoutLabel(workout.type)}
                    </div>
                  ))}
                  {dayWorkouts.length > 3 && (
                    <div className="workout-strip workout-strip-more">
                      +{dayWorkouts.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot today">●</span>
          <span>Today</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: getWorkoutTypeColor('strength training') }}>●</span>
          <span>Strength</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: getWorkoutTypeColor('cardio') }}>●</span>
          <span>Cardio</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: getWorkoutTypeColor('yoga') }}>●</span>
          <span>Yoga</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: getWorkoutTypeColor('biking') }}>●</span>
          <span>Bike</span>
        </div>
      </div>
    </div>
  );
}

export default WorkoutCalendar;

