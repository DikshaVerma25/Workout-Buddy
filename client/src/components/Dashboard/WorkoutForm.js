import React, { useState, useEffect } from 'react';
import { format, startOfToday } from 'date-fns';
import { FiCalendar, FiClock, FiEdit3 } from 'react-icons/fi';
import {
  StrengthTrainingIcon,
  CardioIcon,
  BikingIcon,
  YogaIcon,
  PilatesIcon,
  ZumbaIcon,
  HIITIcon,
  CrossFitIcon,
  LightWalkIcon,
  SportsIcon,
  BreathWorkIcon,
  OtherIcon
} from './WorkoutIcons';
import { YogaBackground } from './YogaBackground';
import './WorkoutForm.css';

function WorkoutForm({ onSubmit, initialDate, onClose }) {
  const [type, setType] = useState('');
  const [otherExercise, setOtherExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [date, setDate] = useState(initialDate || format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Update date when initialDate prop changes
  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  // Yoga background image path (place your image in public/images/yoga-background.jpg)
  // In React, public folder images are referenced from root path
  const yogaBgImage = '/images/yoga-background.jpg';

  const workoutTypes = [
    { value: 'strength training', label: 'Strength Training', icon: StrengthTrainingIcon },
    { value: 'cardio', label: 'Cardio', icon: CardioIcon },
    { value: 'biking', label: 'Biking', icon: BikingIcon },
    { value: 'yoga', label: 'Yoga', icon: YogaIcon, bgImage: yogaBgImage },
    { value: 'pilates', label: 'Pilates', icon: PilatesIcon },
    { value: 'zumba', label: 'Zumba', icon: ZumbaIcon },
    { value: 'hiit', label: 'HIIT', icon: HIITIcon },
    { value: 'crossfit', label: 'CrossFit', icon: CrossFitIcon },
    { value: 'light walk', label: 'Light Walk', icon: LightWalkIcon },
    { value: 'sports and activities', label: 'Sports and Activities', icon: SportsIcon },
    { value: 'breath work', label: 'Breath Work', icon: BreathWorkIcon },
    { value: 'other', label: 'Other', icon: OtherIcon }
  ];

  // Duration is optional for all workout types

  // Parse date string to avoid timezone issues
  const getDateObject = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const selectedDateObj = getDateObject(date);
  const today = startOfToday();
  
  // Compare dates without time
  const selectedDateOnly = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), selectedDateObj.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const isTodaySelected = selectedDateOnly.getTime() === todayOnly.getTime();
  const isPastDate = selectedDateOnly.getTime() < todayOnly.getTime();

  const handleSubmit = async (e) => {
    console.log('handleSubmit called', { type, date, durationHours, durationMinutes });
    
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (e && e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    }
    
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!type) {
        setError('Please select what you did');
        setLoading(false);
        return;
      }

      if (type === 'other' && (!otherExercise || !otherExercise.trim())) {
        setError('Please specify what workout you did');
        setLoading(false);
        return;
      }

      if (!date) {
        setError('Please select a date');
        setLoading(false);
        return;
      }

      // Determine exercise name based on type
      const exercise = type === 'other' 
        ? otherExercise.trim() 
        : workoutTypes.find(t => t.value === type)?.label || type;

      // Double-check that we have all required data
      if (!exercise || !exercise.trim()) {
        setError('Please select a workout type');
        setLoading(false);
        return;
      }

      // Convert hours and minutes to total minutes for submission
      // Duration is optional - only calculate if provided
      const hours = parseInt(durationHours) || 0;
      const minutes = parseInt(durationMinutes) || 0;
      const totalMinutes = hours * 60 + minutes;


      const workoutData = {
        exercise: exercise.trim(),
        type,
        sets: null,
        reps: null,
        weight: null,
        duration: totalMinutes > 0 ? totalMinutes : null,
        durationUnit: totalMinutes > 0 ? 'minutes' : null,
        date,
        notes: notes || ''
      };
      
      console.log('=== SUBMITTING WORKOUT DATA ===');
      console.log('Workout data:', JSON.stringify(workoutData, null, 2));
      console.log('Exercise:', workoutData.exercise);
      console.log('Type:', workoutData.type);
      console.log('Date:', workoutData.date);
      console.log('Duration:', workoutData.duration);
      
      // Validate data before submitting
      if (!workoutData.exercise || !workoutData.type || !workoutData.date) {
        const missing = [];
        if (!workoutData.exercise) missing.push('exercise');
        if (!workoutData.type) missing.push('type');
        if (!workoutData.date) missing.push('date');
        setError(`Missing required fields: ${missing.join(', ')}`);
        setLoading(false);
        return;
      }
      
      await onSubmit(workoutData);

      // Reset form
      setType('');
      setOtherExercise('');
      setWeight('');
      setDurationHours('');
      setDurationMinutes('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setNotes('');
      setShowCalendar(false);
      
      // Call onClose callback if provided
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('=== WORKOUT FORM ERROR ===');
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      // Get the actual error message
      let errorMessage = 'Failed to add workout';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        console.log('Error from backend:', errorMessage);
      } else if (error.message) {
        errorMessage = error.message;
        console.log('Error from exception:', errorMessage);
      }
      
      // Filter out old error messages about sets/reps
      if (errorMessage.includes('sets, reps') || errorMessage.includes('sets and reps') || errorMessage.includes('Exercise, sets, reps')) {
        console.log('⚠️ Detected old error message format, checking what is actually missing...');
        console.log('Current form state:', { 
          type, 
          date, 
          durationHours, 
          durationMinutes, 
          otherExercise,
          hasType: !!type,
          hasDate: !!date,
          hasDuration: (parseInt(durationHours) || 0) > 0 || (parseInt(durationMinutes) || 0) > 0
        });
        
        // Check what's actually missing - be very explicit
        const hours = parseInt(durationHours) || 0;
        const minutes = parseInt(durationMinutes) || 0;
        const totalMinutesCalc = hours * 60 + minutes;
        
        if (!type || type.trim() === '') {
          errorMessage = 'Please select a workout type';
          console.log('Missing: workout type');
        } else if (type === 'other' && (!otherExercise || !otherExercise.trim())) {
          errorMessage = 'Please specify what workout you did';
          console.log('Missing: other exercise name');
        } else if (!date || date.trim() === '') {
          errorMessage = 'Please select a date';
          console.log('Missing: date');
        } else {
          // All checks passed but still got error - this is strange
          console.log('All validation passed but still got error. Original error:', errorMessage);
          errorMessage = `Server error: ${errorMessage}. Please try again or check the console for details.`;
        }
      }
      
      console.log('Setting error message to:', errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowCalendar(false);
  };

  const getDateDisplay = () => {
    if (isTodaySelected) {
      return 'Today';
    }
    // Format without ordinal numbers - explicitly use day number without suffix
    const selectedDateObj = getDateObject(date);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = selectedDateObj.getDate();
    const month = monthNames[selectedDateObj.getMonth()];
    const year = selectedDateObj.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const handleFormSubmit = (e) => {
    console.log('=== FORM SUBMIT TRIGGERED ===');
    console.log('Event:', e);
    console.log('Form state:', { type, date, durationHours, durationMinutes, otherExercise });
    
    // Aggressively prevent any browser validation
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
    
    // Clear all validation on all inputs - do this IMMEDIATELY
    const allInputs = document.querySelectorAll('.workout-form input, .workout-form textarea, .workout-form select');
    console.log('Found inputs:', allInputs.length);
    allInputs.forEach(input => {
      input.setCustomValidity('');
      input.removeAttribute('required');
      input.removeAttribute('min');
      input.removeAttribute('max');
      input.removeAttribute('pattern');
      // Override validation methods
      if (input.checkValidity) {
        try {
          Object.defineProperty(input, 'checkValidity', {
            value: () => true,
            writable: false
          });
        } catch (err) {
          // Can't override, that's okay
        }
      }
    });
    
    console.log('Calling handleSubmit...');
    handleSubmit(e || { preventDefault: () => {}, stopPropagation: () => {} });
  };

  return (
    <div className="workout-form" role="none">
      <YogaBackground />
      <div className="form-header">
        <h2>Log Your Workout</h2>
        <p className="form-subtitle">Track your progress and stay motivated!</p>
      </div>

      {/* What did you do? - Combined Exercise and Type */}
      <div className="form-group">
        <label className="form-label">
          <span className="label-icon">
            <StrengthTrainingIcon size={20} />
          </span>
          What did you do? *
        </label>
        <div className="type-selector">
          {workoutTypes.map((workoutType) => {
            const IconComponent = workoutType.icon;
            const isActive = type === workoutType.value;
            return (
              <button
                key={workoutType.value}
                type="button"
                className={`type-button ${isActive ? 'active' : ''} ${workoutType.value === 'yoga' ? 'yoga-button' : ''}`}
                style={
                  workoutType.value === 'yoga'
                    ? {
                        backgroundImage: `url(${yogaBgImage}), linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(99, 102, 241, 0.08) 100%)`,
                        backgroundSize: 'cover, cover',
                        backgroundPosition: 'center, center',
                        backgroundBlendMode: 'normal, overlay',
                        backgroundRepeat: 'no-repeat'
                      }
                    : undefined
                }
                onClick={() => {
                  setType(workoutType.value);
                  if (workoutType.value !== 'other') {
                    setOtherExercise('');
                  }
                }}
              >
                {workoutType.value !== 'yoga' && (
                  <span className="type-icon">
                    <IconComponent size={40} isActive={isActive} />
                  </span>
                )}
                <span className="type-label">{workoutType.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* Show text input if "Other" is selected */}
        {type === 'other' && (
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">
              Please specify what workout you did *
            </label>
            <input
              type="text"
              value={otherExercise}
              onChange={(e) => setOtherExercise(e.target.value)}
              placeholder="e.g., Pilates, Swimming, CrossFit..."
              className="form-input"
              autoFocus
              formNoValidate
            />
          </div>
        )}
      </div>

      {/* Date Selection */}
      <div className="form-group">
        <label className="form-label">
          <span className="label-icon">
            <FiCalendar />
          </span>
          When did you do this?
        </label>
        <div className="date-selector">
          <button
            type="button"
            className="date-button"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <span className="date-text">{getDateDisplay()}</span>
            {isPastDate && <span className="past-badge">Past</span>}
          </button>
          {showCalendar && (
            <div className="calendar-popup">
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="calendar-input"
                formNoValidate
              />
              <button
                type="button"
                className="quick-date-btn"
                onClick={() => handleDateChange(format(new Date(), 'yyyy-MM-dd'))}
              >
                Today
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Duration fields - shown for all workout types (optional) */}
      {type && (
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">
                <FiClock />
              </span>
              Hours (Optional)
            </label>
            <input
              type="number"
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              step="1"
              placeholder="0"
              className="form-input"
              formNoValidate
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">
                <FiClock />
              </span>
              Minutes (Optional)
            </label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              step="1"
              placeholder="e.g., 30"
              className="form-input"
              formNoValidate
            />
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="form-group">
        <label className="form-label">
          <span className="label-icon">
            <FiEdit3 />
          </span>
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          placeholder="How did it feel? Any observations?"
          className="form-textarea"
        />
      </div>

      {error && (
        <div className="error-message" style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginTop: '1rem',
          border: '2px solid #c33'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <button 
        type="button" 
        className="submit-button" 
        disabled={loading}
        onClick={handleFormSubmit}
      >
        {loading ? (
          <>
            <span className="spinner">⏳</span> Adding...
          </>
        ) : (
          <>
            <span>✅</span> Add Workout
          </>
        )}
      </button>
    </div>
  );
}

export default WorkoutForm;
