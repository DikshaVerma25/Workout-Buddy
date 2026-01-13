import React, { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import './WorkoutCalendar.css';

// Color mapping for different workout types - Bright colors for dark theme
export const getWorkoutTypeColor = (type) => {
  const colors = {
    'strength training': '#9d9dff', // Bright purple
    'cardio': '#ff9dc0', // Bright pink
    'biking': '#7ec3ff', // Bright blue
    'yoga': '#6dd5b0', // Bright green
    'pilates': '#ffafd3', // Bright rose
    'zumba': '#ffc96d', // Bright yellow
    'hiit': '#ff8b8b', // Bright red
    'crossfit': '#ffb886', // Bright orange
    'light walk': '#7ef0e0', // Bright cyan
    'sports and activities': '#ffbebe', // Bright coral
    'breath work': '#d3a0ff', // Bright lavender
    'other': '#9de3c8' // Bright mint
  };
  return colors[type] || '#9d9dff';
};

function WorkoutCalendar({ workouts, onDateClick, selectedDate }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [showFunMessage, setShowFunMessage] = useState(false);
  
  // Calculate max month (1 year from today) - allows viewing current month + 11 more months (12 total)
  // So if today is January 2024, max is December 2024 (11 months ahead)
  const maxMonth = addMonths(startOfMonth(today), 11);
  
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

  // Navigation handlers
  const goToPreviousMonth = () => {
    setShowFunMessage(false);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    // Check if next month would exceed 1 year limit (compare year and month)
    const nextMonthYear = nextMonth.getFullYear();
    const nextMonthMonth = nextMonth.getMonth();
    const maxYear = maxMonth.getFullYear();
    const maxMonthNum = maxMonth.getMonth();
    
    if (nextMonthYear > maxYear || (nextMonthYear === maxYear && nextMonthMonth > maxMonthNum)) {
      setShowFunMessage(true);
      // Auto-hide message after 4 seconds
      setTimeout(() => {
        setShowFunMessage(false);
      }, 4000);
    } else {
      setShowFunMessage(false);
      setCurrentMonth(nextMonth);
    }
  };

  const goToToday = () => {
    setShowFunMessage(false);
    setCurrentMonth(startOfMonth(today));
  };

  // Check if current month is today's month
  const isCurrentMonthDisplayed = 
    currentMonth.getMonth() === today.getMonth() && 
    currentMonth.getFullYear() === today.getFullYear();
  
  // Check if next button should be disabled
  const nextMonthCheck = addMonths(currentMonth, 1);
  const nextYear = nextMonthCheck.getFullYear();
  const nextMonthNum = nextMonthCheck.getMonth();
  const maxYear = maxMonth.getFullYear();
  const maxMonthNum = maxMonth.getMonth();
  const isNextDisabled = nextYear > maxYear || (nextYear === maxYear && nextMonthNum > maxMonthNum);

  // Render the calendar
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const monthName = format(currentMonth, 'MMMM yyyy');
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fun messages to show when trying to go beyond 1 year
  const funMessages = [
    "Whoa there, future planner! You're already a year ahead! Focus on today and crush your goals!",
    "Slow down, time traveler! One year at a time is plenty. Keep up the amazing work!",
    "You're planning ahead like a champ! But let's focus on the next 12 months first. You've got this!",
    "Planning ahead is great, but let's nail this year first! You're doing amazing!",
    "Look at you being so organized! One year of workouts is a huge commitment - let's make it count!"
  ];

  return (
    <div className="workout-calendar-card">
      {showFunMessage && (
        <div className="fun-message-banner">
          <div className="fun-message-content">
            {funMessages[Math.floor(Math.random() * funMessages.length)]}
          </div>
          <button 
            className="fun-message-close" 
            onClick={() => setShowFunMessage(false)}
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      )}
      <div className="calendar-header">
        <button 
          className="calendar-nav-button" 
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="calendar-title-container">
          <h3>{monthName}</h3>
          {!isCurrentMonthDisplayed && (
            <button 
              className="calendar-today-button" 
              onClick={goToToday}
              aria-label="Go to today"
            >
              Today
            </button>
          )}
        </div>
        <button 
          className={`calendar-nav-button ${isNextDisabled ? 'disabled' : ''}`}
          onClick={goToNextMonth}
          aria-label="Next month"
          disabled={isNextDisabled}
        >
          ›
        </button>
      </div>
      <div className="calendar-grid">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {daysInMonth.map((day, dayIndex) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayWorkouts = workoutsByDate[dayKey] || [];
          const hasWorkout = dayWorkouts.length > 0;
          const isTodayDate = isToday(day);
          const isCurrentMonthDay = day.getMonth() === currentMonth.getMonth() && day.getFullYear() === currentMonth.getFullYear();
          const isSelected = selectedDate === dayKey;
          
          // Future dates (beyond today) should be grayish and non-clickable
          const isFutureDate = day > today && !isTodayDate;
          const isClickable = !isFutureDate; // Only past dates and today are clickable
          
          const handleClick = () => {
            if (isClickable && onDateClick) {
              onDateClick(dayKey, dayWorkouts);
            }
          };

          return (
            <div
              key={dayIndex}
              className={`calendar-day ${hasWorkout ? 'has-workout' : ''} ${isTodayDate ? 'today' : ''} ${isSelected ? 'selected' : ''} ${!isCurrentMonthDay ? 'other-month' : ''} ${isClickable ? 'clickable' : 'disabled'} ${isFutureDate ? 'future' : ''}`}
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
    </div>
  );
}

export default WorkoutCalendar;

