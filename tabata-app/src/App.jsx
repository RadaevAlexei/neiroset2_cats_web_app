import { useState, useEffect, useCallback } from 'react'
import './index.css'
import { useTimerAudio } from './hooks/useTimerAudio'
import SettingsSection from './components/SettingsSection'
import TimerSection from './components/TimerSection'
import { themes } from './themes'

function App() {
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(10);
  const [roundRestTime, setRoundRestTime] = useState(60);

  const [rounds, setRounds] = useState([
    { exercises: ['Отжимания', 'Приседания'] }
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
  const { initAudio, playSound } = useTimerAudio();

  const handleTimeChange = (setter, value, delta) => {
    const newValue = value + delta;
    setter(newValue >= 0 ? newValue : 0);
    setPhaseDuration(newValue >= 0 ? newValue : 0);
  };

  const changeTheme = useCallback(() => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const root = document.documentElement;
    Object.keys(randomTheme).forEach(key => {
      root.style.setProperty(key, randomTheme[key]);
    });
  }, []);

  useEffect(() => {
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
    if (time > 0 || !isActive) return;
    if (isResting) {
        playSound('work');
        setIsResting(false);
        if (currentExercise + 1 < rounds[currentRound].exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setTime(workTime);
          setPhaseDuration(workTime);
        } else {
          playSound('rest');
          setIsRoundResting(true);
          setTime(roundRestTime);
          setPhaseDuration(roundRestTime);
        }
    } else if (isRoundResting) {
      playSound('work');
      setIsRoundResting(false);
      if (currentRound + 1 < rounds.length) {
            setCurrentRound(currentRound + 1);
            setCurrentExercise(0);
            setTime(workTime);
            setPhaseDuration(workTime);
        } else {
            setIsActive(false);
        }
    } else {
      if (restTime > 0) {
          playSound('rest');
          setIsResting(true);
          setTime(restTime);
          setPhaseDuration(restTime);
      } else {
           if (currentExercise + 1 < rounds[currentRound].exercises.length) {
              playSound('work');
              setCurrentExercise(currentExercise + 1);
              setTime(workTime);
              setPhaseDuration(workTime);
          } else {
              playSound('rest');
              setIsRoundResting(true);
              setTime(roundRestTime);
              setPhaseDuration(roundRestTime);
          }
      }
    }
  }, [time, isActive, rounds, currentRound, currentExercise, isResting, isRoundResting, playSound, workTime, restTime, roundRestTime]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen) {
        setIsSettingsVisible(true);
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Не удалось включить полноэкранный режим: ${err.message}`);
      });
    }
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

  const requestFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Не удалось включить полноэкранный режим: ${err.message}`);
      });
    }
  }, []);

  const toggleTimer = () => {
    initAudio();

    if (!isActive) {
      enterFullscreen();
      setIsSettingsVisible(false);
    }
    if (!isActive && time === 0 && currentRound >= rounds.length -1 && currentExercise >= rounds[currentRound].exercises.length - 1) {
        resetTimer();
    }
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
  const currentExerciseName = isRoundResting ? "Отдых" : (rounds[currentRound]?.exercises[currentExercise] || "Готово");

  return (
    <div className="app">
      <SettingsSection
        isSettingsVisible={isSettingsVisible}
        isActive={isActive}
        workTime={workTime}
        setWorkTime={setWorkTime}
        restTime={restTime}
        setRestTime={setRestTime}
        roundRestTime={roundRestTime}
        setRoundRestTime={setRoundRestTime}
        rounds={rounds}
        handleRoundChange={handleRoundChange}
        removeRound={removeRound}
        addRound={addRound}
        handleTimeChange={handleTimeChange}
        maxRounds={maxRounds}
      />
      <TimerSection
        setIsSettingsVisible={setIsSettingsVisible}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        changeTheme={changeTheme}
        currentRound={currentRound}
        rounds={rounds}
        currentExerciseName={currentExerciseName}
        time={time}
        isResting={isResting}
        isRoundResting={isRoundResting}
        progress={progress}
        progressColor={progressColor}
        isActive={isActive}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
      />
    </div>
  );
}

export default App
