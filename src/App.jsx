import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [rounds, setRounds] = useState([
    { exercises: ['Push-ups', 'Squats'], time: 30, rest: 10, roundRest: 60 },
    { exercises: ['Plank'], time: 45, rest: 10, roundRest: 60 },
  ]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [time, setTime] = useState(rounds[0].time);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [isRoundResting, setIsRoundResting] = useState(false);

  const maxRounds = 8;

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }

    if (time === 0) {
      if (isResting) { // End of rest between exercises
        setIsResting(false);
        if (currentExercise + 1 < rounds[currentRound].exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setTime(rounds[currentRound].time);
        } else { // End of round
            setIsRoundResting(true);
            setTime(rounds[currentRound].roundRest);
        }
      } else if(isRoundResting) { // End of rest between rounds
        setIsRoundResting(false);
        if (currentRound + 1 < rounds.length) {
            setCurrentRound(currentRound + 1);
            setCurrentExercise(0);
            setTime(rounds[currentRound + 1].time);
        } else { // End of workout
            setIsActive(false);
        }
      } else { // End of an exercise
        setIsResting(true);
        setTime(rounds[currentRound].rest);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, time, currentRound, currentExercise, isResting, isRoundResting, rounds]);

  const handleRoundChange = (index, field, value) => {
    const newRounds = [...rounds];
    if (field === 'exercises') {
      newRounds[index][field] = value.split(',').map(e => e.trim());
    } else {
      newRounds[index][field] = parseInt(value, 10);
    }
    setRounds(newRounds);
  };

  const addRound = () => {
    if (rounds.length < maxRounds) {
      setRounds([...rounds, { exercises: ['New Exercise'], time: 30, rest: 10, roundRest: 60 }]);
    }
  };

  const removeRound = (index) => {
    if (rounds.length > 1) {
      const newRounds = rounds.filter((_, i) => i !== index);
      setRounds(newRounds);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsResting(false);
    setIsRoundResting(false);
    setCurrentRound(0);
    setCurrentExercise(0);
    setTime(rounds[0].time);
  }

  const toggleTimer = () => {
    setIsActive(!isActive);
  }

  const currentExerciseName = isRoundResting ? "Round Rest" : rounds[currentRound].exercises[currentExercise];

  return (
    <div className="app">
      <header>
        <h1>Tabata Timer</h1>
      </header>
      <main>
        <div className="timer-display">
          <h2>Round: {currentRound + 1} / {rounds.length}</h2>
          <h3>Exercise: {currentExerciseName}</h3>
          <div className="main-timer">{time}s</div>
          <p className={isResting || isRoundResting ? 'resting' : ''}>
            {isResting ? "REST" : isRoundResting ? "ROUND REST" : "WORK"}
          </p>
        </div>

        <div className="controls">
          <button onClick={toggleTimer}>
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button onClick={resetTimer}>
            Reset
          </button>
        </div>

        <div className="settings">
          <h2>Settings</h2>
          {rounds.map((round, index) => (
            <div key={index} className="round-settings">
              <h4>Round {index + 1}</h4>
              <div className="form-group">
                <label>Exercises (comma-separated):</label>
                <input
                  type="text"
                  value={round.exercises.join(', ')}
                  onChange={(e) => handleRoundChange(index, 'exercises', e.target.value)}
                  disabled={isActive}
                />
              </div>
              <div className="form-group">
                <label>Work Time (s):</label>
                <input
                  type="number"
                  value={round.time}
                  onChange={(e) => handleRoundChange(index, 'time', e.target.value)}
                  disabled={isActive}
                />
              </div>
              <div className="form-group">
                <label>Rest Time (s):</label>
                <input
                  type="number"
                  value={round.rest}
                  onChange={(e) => handleRoundChange(index, 'rest', e.target.value)}
                  disabled={isActive}
                />
              </div>
              <div className="form-group">
                <label>Rest Between Rounds (s):</label>
                <input
                  type="number"
                  value={round.roundRest}
                  onChange={(e) => handleRoundChange(index, 'roundRest', e.target.value)}
                  disabled={isActive}
                />
              </div>
              <button onClick={() => removeRound(index)} disabled={isActive || rounds.length <= 1}>Remove Round</button>
            </div>
          ))}
          <button onClick={addRound} disabled={isActive || rounds.length >= maxRounds}>Add Round</button>
        </div>
      </main>
    </div>
  );
}

export default App; 