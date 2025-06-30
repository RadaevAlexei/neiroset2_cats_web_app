import { useRef, useCallback } from 'react';

export const useTimerAudio = () => {
  const audioContextRef = useRef(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

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
        break;
    }

    o.frequency.value = freq;
    g.gain.setValueAtTime(0, context.currentTime);
    g.gain.linearRampToValueAtTime(vol, context.currentTime + 0.01);
    o.start(context.currentTime);
    g.gain.linearRampToValueAtTime(0, context.currentTime + dur);
    o.stop(context.currentTime + dur);
  }, []);

  return { initAudio, playSound };
}; 