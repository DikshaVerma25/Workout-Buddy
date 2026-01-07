import React from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import './WorkoutCalendar.css';

function WorkoutCalendar({ workouts, onDateClick }) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start from Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Create a set of dates that have workouts
  // workout.date is already a YYYY-MM-DD string
  const workoutDates = new Set(
    workouts.map(w => {
      // If date is already a string in YYYY-MM-DD format, use it directly
      if (typeof w.date === 'string' && w.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return w.date;
      }
      // Otherwise, parse it as a Date and format it
      const date = new Date(w.date);
      return format(date, 'yyyy-MM-dd');
    })
  );
  
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
          const hasWorkout = workoutDates.has(dayKey);
          const isTodayDate = isToday(day);
          const isCurrentMonthDay = isCurrentMonth(day);
          
          const handleClick = () => {
            if (isCurrentMonthDay && onDateClick) {
              onDateClick(format(day, 'yyyy-MM-dd'));
            }
          };

          return (
            <div
              key={index}
              className={`calendar-day ${hasWorkout ? 'has-workout' : ''} ${isTodayDate ? 'today' : ''} ${!isCurrentMonthDay ? 'other-month' : ''} ${isCurrentMonthDay ? 'clickable' : ''}`}
              onClick={handleClick}
            >
              <span className="day-number">{format(day, 'd')}</span>
              {hasWorkout && <span className="workout-dot">●</span>}
            </div>
          );
        })}
      </div>
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot has-workout">●</span>
          <span>Workout logged</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot today">●</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

export default WorkoutCalendar;

