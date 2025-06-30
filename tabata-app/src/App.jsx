import { useState, useEffect, useRef, useCallback } from 'react'
import './index.css'

const themes = [
  { // Default Dark
    '--background-color': '#1a1a1a',
    '--surface-color': '#2c2c2c',
    '--primary-color': '#00aaff',
    '--text-color': '#ffffff',
    '--text-secondary-color': '#b3b3b3',
    '--red': '#ff4d4d',
    '--green': '#4dff88',
  },
  { // Oceanic Deep
    '--background-color': '#0B132B',
    '--surface-color': '#1C2541',
    '--primary-color': '#3A506B',
    '--text-color': '#FFFFFF',
    '--text-secondary-color': '#5BC0BE',
    '--red': '#F06543',
    '--green': '#6FFFE9',
  },
  { // Forest Whisper
    '--background-color': '#1E2A22',
    '--surface-color': '#2A3C2F',
    '--primary-color': '#A2C29B',
    '--text-color': '#F0F2EF',
    '--text-secondary-color': '#C9D8C5',
    '--red': '#D96C75',
    '--green': '#84A98C',
  },
  { // Crimson Night
    '--background-color': '#121212',
    '--surface-color': '#1E1E1E',
    '--primary-color': '#CF6679',
    '--text-color': '#E1E1E1',
    '--text-secondary-color': '#A8A8A8',
    '--red': '#E57373',
    '--green': '#03DAC6',
  }
];

const ProgressBar = ({ progress, size, strokeWidth, color }) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg className="progress-bar-svg" width={size} height={size}>
      <circle className="progress-bar-bg" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} />
      <circle
        className="progress-bar-fg"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
};

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const FullscreenIcon = ({ isFullscreen }) => {
  if (isFullscreen) {
    // Exit fullscreen icon
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
      </svg>
    );
  }
  // Enter fullscreen icon
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    </svg>
  );
};

const ThemeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 0-14H7a2 2 0 0 0-2 2v2.5a2.5 2.5 0 0 0 2.5 2.5z"></path>
        <path d="M12 22a7 7 0 0 1 0-14H7a2 2 0 0 1 2-2h3"></path>
        <path d="M18 16a2 2 0 0 0 2-2v-2"></path>
    </svg>
);

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(true);
  const [phaseDuration, setPhaseDuration] = useState(workTime);

  const maxRounds = 8;
  const audioContextRef = useRef(null);

  const handleTimeChange = (setter, value, delta) => {
    const newValue = value + delta;
    setter(newValue >= 0 ? newValue : 0);
  };

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

  const changeTheme = useCallback(() => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const root = document.documentElement;
    Object.keys(randomTheme).forEach(key => {
      root.style.setProperty(key, randomTheme[key]);
    });
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
        setPhaseDuration(workTime);
      } else { // End of round, start round rest
        playSound('rest');
        setIsRoundResting(true);
        setTime(roundRestTime);
        setPhaseDuration(roundRestTime);
      }
    } else if (isRoundResting) { // End of rest between rounds
      playSound('work');
      setIsRoundResting(false);
      if (currentRound + 1 < rounds.length) {
        setCurrentRound(currentRound + 1);
        setCurrentExercise(0);
        setTime(workTime);
        setPhaseDuration(workTime);
      } else { // End of workout
        setIsActive(false);
      }
    } else { // End of a work interval, start exercise rest
      if (restTime > 0) {
        playSound('rest');
        setIsResting(true);
        setTime(restTime);
        setPhaseDuration(restTime);
      } else { // No rest, go to next exercise or round rest
        if (currentExercise + 1 < rounds[currentRound].exercises.length) {
          playSound('work');
          setCurrentExercise(currentExercise + 1);
          setTime(workTime);
          setPhaseDuration(workTime);
        } else { // End of round, start round rest
          playSound('rest');
          setIsRoundResting(true);
          setTime(roundRestTime);
          setPhaseDuration(roundRestTime);
        }
      }
    }
  }, [time, isActive, rounds, currentRound, currentExercise, isResting, isRoundResting, playSound, workTime, restTime, roundRestTime]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
    setPhaseDuration(workTime);
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

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        alert(`Не удалось включить полноэкранный режим: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  const progress = phaseDuration > 0 ? (time / phaseDuration) * 100 : 0;
  const progressColor = isResting || isRoundResting ? 'var(--red)' : 'var(--green)';
  const currentExerciseName = isRoundResting ? "Отдых между раундами" : (rounds[currentRound]?.exercises[currentExercise] || "Готово");

  return (
    <div className="app">
      <div className={`settings-section ${!isSettingsVisible ? 'collapsed' : ''}`}>
        <div className="settings">
            <h2>Настройки</h2>
            <div className="global-settings">
              <div className="form-group-inline">
                <div className="form-group">
                  <label>Работа (сек):</label>
                  <div className="number-input-container">
                    <input
                      type="number"
                      value={workTime}
                      onChange={(e) => setWorkTime(parseInt(e.target.value, 10) || 0)}
                      disabled={isActive}
                    />
                    <div className="spinner-controls">
                        <button className="spinner-btn" onClick={() => handleTimeChange(setWorkTime, workTime, 1)} disabled={isActive}>▲</button>
                        <button className="spinner-btn" onClick={() => handleTimeChange(setWorkTime, workTime, -1)} disabled={isActive}>▼</button>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Отдых (сек):</label>
                  <div className="number-input-container">
                    <input
                      type="number"
                      value={restTime}
                      onChange={(e) => setRestTime(parseInt(e.target.value, 10) || 0)}
                      disabled={isActive}
                    />
                    <div className="spinner-controls">
                        <button className="spinner-btn" onClick={() => handleTimeChange(setRestTime, restTime, 1)} disabled={isActive}>▲</button>
                        <button className="spinner-btn" onClick={() => handleTimeChange(setRestTime, restTime, -1)} disabled={isActive}>▼</button>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Отдых между раундами (сек):</label>
                  <div className="number-input-container">
                    <input
                      type="number"
                      value={roundRestTime}
                      onChange={(e) => setRoundRestTime(parseInt(e.target.value, 10) || 0)}
                      disabled={isActive}
                    />
                    <div className="spinner-controls">
                        <button className="spinner-btn" onClick={() => handleTimeChange(setRoundRestTime, roundRestTime, 1)} disabled={isActive}>▲</button>
                        <button className="spinner-btn" onClick={() => handleTimeChange(setRoundRestTime, roundRestTime, -1)} disabled={isActive}>▼</button>
                    </div>
                  </div>
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
      </div>

      <div className="timer-section">
        <button onClick={() => setIsSettingsVisible(!isSettingsVisible)} className="menu-btn" title="Меню">
          <MenuIcon />
        </button>
        <button onClick={toggleFullscreen} className="fullscreen-btn" title="Полноэкранный режим">
          <FullscreenIcon isFullscreen={isFullscreen} />
        </button>
        <button onClick={changeTheme} className="theme-btn" title="Сменить тему">
            <ThemeIcon />
        </button>
        <header>
          <h1>Табата Таймер</h1>
        </header>
        <main className="timer-main">
          <div className="workout-info">
            <h2>Раунд: {currentRound + 1} / {rounds.length}</h2>
            <h3>Упражнение: {currentExerciseName}</h3>
          </div>
          <div className="timer-display">
            <ProgressBar progress={progress} size={350} strokeWidth={30} color={progressColor} />
            <div className="timer-content">
              <div className="main-timer">{time}</div>
              <p
                className={
                  (isResting || isRoundResting ? 'resting ' : '') +
                  (isRoundResting ? 'round-rest' : '')
                }
              >
                {isResting
                  ? "ОТДЫХ"
                  : isRoundResting
                  ? <>
                      МЕЖРАУНДОВЫЙ<br />ОТДЫХ
                    </>
                  : "РАБОТА"}
              </p>
            </div>
          </div>

          <div className="controls">
            <button onClick={toggleTimer}>
              {isActive ? 'Пауза' : 'Старт'}
            </button>
            <button onClick={resetTimer}>
              Сброс
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App
