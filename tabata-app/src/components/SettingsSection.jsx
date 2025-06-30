import React from 'react';

const SettingsSection = ({
  isSettingsVisible,
  isActive,
  workTime,
  setWorkTime,
  restTime,
  setRestTime,
  roundRestTime,
  setRoundRestTime,
  rounds,
  handleRoundChange,
  removeRound,
  addRound,
  handleTimeChange,
  maxRounds,
}) => {
  return (
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
  );
};

export default SettingsSection; 