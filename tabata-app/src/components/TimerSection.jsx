import React from 'react';
import ProgressBar from './ProgressBar';
import { MenuIcon, FullscreenIcon, ThemeIcon } from './Icons';

const TimerSection = ({
  setIsSettingsVisible,
  toggleFullscreen,
  isFullscreen,
  changeTheme,
  currentRound,
  rounds,
  currentExerciseName,
  time,
  isResting,
  isRoundResting,
  progress,
  progressColor,
  isActive,
  toggleTimer,
  resetTimer
}) => {
  return (
    <div className="timer-section">
      <button onClick={() => setIsSettingsVisible(prev => !prev)} className="menu-btn" title="Меню">
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
                ? <><p>МЕЖРАУНДОВЫЙ</p><p>ОТДЫХ</p></>
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
  );
};

export default TimerSection; 