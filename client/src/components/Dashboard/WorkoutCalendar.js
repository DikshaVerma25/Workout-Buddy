import React from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import './WorkoutCalendar.css';

// Color mapping for different workout types
export const getWorkoutTypeColor = (type) => {
  const colors = {
    'strength training': '#667eea', // Purple
    'cardio': '#f093fb', // Pink
    'biking': '#4facfe', // Blue
    'yoga': '#43e97b', // Green
    'pilates': '#fa709a', // Rose
    'zumba': '#fee140', // Yellow
    'hiit': '#ff6b6b', // Red
    'crossfit': '#feca57', // Orange
    'light walk': '#a8edea', // Cyan
    'sports and activities': '#ff9a9e', // Coral
    'breath work': '#c471f5', // Lavender
    'other': '#96fbc4' // Mint
  };
  return colors[type] || '#667eea';
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
          
          // Get primary workout type color (use first workout's type, or blend colors if multiple)
          let dayColor = null;
          if (hasWorkout) {
            if (dayWorkouts.length === 1) {
              dayColor = getWorkoutTypeColor(dayWorkouts[0].type);
            } else {
              // Multiple workouts - use gradient or first workout's color
              dayColor = getWorkoutTypeColor(dayWorkouts[0].type);
            }
          }
          
          const handleClick = () => {
            if (isCurrentMonthDay && onDateClick) {
              onDateClick(dayKey, dayWorkouts);
            }
          };

          return (
            <div
              key={index}
              className={`calendar-day ${hasWorkout ? 'has-workout' : ''} ${isTodayDate ? 'today' : ''} ${isSelected ? 'selected' : ''} ${!isCurrentMonthDay ? 'other-month' : ''} ${isCurrentMonthDay ? 'clickable' : ''}`}
              onClick={handleClick}
              style={dayColor ? { background: dayColor, color: 'white' } : {}}
            >
              <span className="day-number">{format(day, 'd')}</span>
              {hasWorkout && (
                <div className="workout-indicators">
                  {dayWorkouts.length > 1 && (
                    <span className="workout-count">{dayWorkouts.length}</span>
                  )}
                  {dayWorkouts.length === 1 && (
                    <span className="workout-type-badge">{dayWorkouts[0].type.charAt(0).toUpperCase()}</span>
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
          <span className="legend-dot" style={{ background: '#667eea' }}>●</span>
          <span>Strength</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#f093fb' }}>●</span>
          <span>Cardio</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#43e97b' }}>●</span>
          <span>Yoga</span>
        </div>
      </div>
    </div>
  );
}

export default WorkoutCalendar;

