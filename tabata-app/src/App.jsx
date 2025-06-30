import { useState, useEffect, useRef, useCallback } from 'react'
import './index.css'

function App() {
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(10);
  const [roundRestTime, setRoundRestTime] = useState(60);

  const [rounds, setRounds] = useState([
    { exercises: ['Отжимания', 'Приседания'] },
    { exercises: ['Планка'] },
  ]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [time, setTime] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [isRoundResting, setIsRoundResting] = useState(false);

  const maxRounds = 8;
  const audioContextRef = useRef(null);

  const playSound = useCallback((type) => {
    if (!audioContextRef.current) return;
    const context = audioContextRef.current;
    const o = context.createOscillator();
    const g = context.createGain();
    o.connect(g);
    g.connect(context.destination);

    let freq = 1000, vol = 0.1, dur = 0.1;

    switch (type) {
      case 'work':
        freq = 600; vol = 0.2; dur = 0.2;
        break;
      case 'rest':
        freq = 400; vol = 0.2; dur = 0.5;
        break;
      case 'tick':
        // Use default values for tick
        break;
    }

    o.frequency.value = freq;
    g.gain.setValueAtTime(0, context.currentTime);
    g.gain.linearRampToValueAtTime(vol, context.currentTime + 0.01);
    o.start(context.currentTime);
    g.gain.linearRampToValueAtTime(0, context.currentTime + dur);
    o.stop(context.currentTime + dur);
  }, []);

  useEffect(() => {
    // When settings change, reset the timer to the new values if it's not running
    if (!isActive) {
      resetTimer();
    }
  }, [rounds, workTime, restTime, roundRestTime]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTime(t => {
        if (t > 1) {
          playSound('tick');
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, playSound]);

  useEffect(() => {
    if (time > 0 || !isActive) {
      return;
    }
    
    // Logic for transitioning between states
    if (isResting) { // End of rest between exercises
      playSound('work');
      setIsResting(false);
      if (currentExercise + 1 < rounds[currentRound].exercises.length) {
        setCurrentExercise(currentExercise + 1);
        setTime(workTime);
      } else { // End of round, start round rest
        playSound('rest');
        setIsRoundResting(true);
        setTime(roundRestTime);
      }
    } else if (isRoundResting) { // End of rest between rounds
      playSound('work');
      setIsRoundResting(false);
      if (currentRound + 1 < rounds.length) {
        setCurrentRound(currentRound + 1);
        setCurrentExercise(0);
        setTime(workTime);
      } else { // End of workout
        setIsActive(false);
      }
    } else { // End of a work interval, start exercise rest
      if (restTime > 0) {
        playSound('rest');
        setIsResting(true);
        setTime(restTime);
      } else { // No rest, go to next exercise or round rest
        if (currentExercise + 1 < rounds[currentRound].exercises.length) {
          playSound('work');
          setCurrentExercise(currentExercise + 1);
          setTime(workTime);
        } else { // End of round, start round rest
          playSound('rest');
          setIsRoundResting(true);
          setTime(roundRestTime);
        }
      }
    }
  }, [time, isActive, rounds, currentRound, currentExercise, isResting, isRoundResting, playSound, workTime, restTime, roundRestTime]);

  const handleRoundChange = (index, value) => {
    const newRounds = [...rounds];
    newRounds[index].exercises = value.split(',').map(e => e.trim());
    setRounds(newRounds);
  };

  const addRound = () => {
    if (rounds.length < maxRounds) {
      setRounds([...rounds, { exercises: ['Новое упражнение'] }]);
    }
  };

  const removeRound = (index) => {
    if (rounds.length > 1) {
      const newRounds = rounds.filter((_, i) => i !== index);
      // Adjust current round if we remove the one we are on or before
      if (currentRound >= index && currentRound > 0) {
        setCurrentRound(currentRound - 1);
      }
      setRounds(newRounds);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsResting(false);
    setIsRoundResting(false);
    setCurrentRound(0);
    setCurrentExercise(0);
    setTime(workTime);
  }

  const toggleTimer = () => {
    if (!isActive && time === 0 && currentRound >= rounds.length -1 && currentExercise >= rounds[currentRound].exercises.length - 1) {
        resetTimer();
    }
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    audioContextRef.current.resume();

    // Play start sound only when initiating the very first work period
    if (!isActive && currentRound === 0 && currentExercise === 0 && time === workTime) {
      playSound('work');
    }

    setIsActive(!isActive);
  }

  const currentExerciseName = isRoundResting ? "Отдых между раундами" : (rounds[currentRound]?.exercises[currentExercise] || "Готово");

  return (
    <div className="app">
      <header>
        <h1>Табата Таймер</h1>
      </header>
      <main>
        <div className="timer-display">
          <h2>Раунд: {currentRound + 1} / {rounds.length}</h2>
          <h3>Упражнение: {currentExerciseName}</h3>
          <div className="main-timer">{time}с</div>
          <p className={isResting || isRoundResting ? 'resting' : ''}>
            {isResting ? "ОТДЫХ" : isRoundResting ? "МЕЖРАУНДОВЫЙ ОТДЫХ" : "РАБОТА"}
          </p>
        </div>

        <div className="controls">
          <button onClick={toggleTimer}>
            {isActive ? 'Пауза' : 'Старт'}
          </button>
          <button onClick={resetTimer}>
            Сброс
          </button>
        </div>

        <div className="settings">
          <h2>Настройки</h2>
          <div className="global-settings">
            <div className="form-group-inline">
              <div className="form-group">
                <label>Работа (сек):</label>
                <input
                  type="number"
                  value={workTime}
                  onChange={(e) => setWorkTime(parseInt(e.target.value, 10) || 0)}
                  disabled={isActive}
                />
              </div>
              <div className="form-group">
                <label>Отдых (сек):</label>
                <input
                  type="number"
                  value={restTime}
                  onChange={(e) => setRestTime(parseInt(e.target.value, 10) || 0)}
                  disabled={isActive}
                />
              </div>
              <div className="form-group">
                <label>Отдых между раундами (сек):</label>
                <input
                  type="number"
                  value={roundRestTime}
                  onChange={(e) => setRoundRestTime(parseInt(e.target.value, 10) || 0)}
                  disabled={isActive}
                />
              </div>
            </div>
          </div>

          {rounds.map((round, index) => (
            <div key={index} className="round-settings">
              <h4>Раунд {index + 1}</h4>
              <button className="remove-round-btn" onClick={() => removeRound(index)} disabled={isActive || rounds.length <= 1}>&times;</button>
              <div className="form-group">
                <label>Упражнения (через запятую):</label>
                <input
                  type="text"
                  value={round.exercises.join(', ')}
                  onChange={(e) => handleRoundChange(index, e.target.value)}
                  disabled={isActive}
                />
              </div>
            </div>
          ))}
          <button onClick={addRound} disabled={isActive || rounds.length >= maxRounds}>Добавить раунд</button>
        </div>
      </main>
    </div>
  );
}

export default App
