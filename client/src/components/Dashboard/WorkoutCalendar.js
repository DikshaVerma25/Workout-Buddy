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
  const workoutDates = new Set(
    workouts.map(w => {
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

