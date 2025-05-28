
import { useEffect, useRef } from 'react';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
}

export const useSound = () => {
  const soundsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Preload sounds
    const sounds = {
      typing: '/typing-beep.mp3',
      keyClick: '/key-click.mp3', 
      enterClick: '/enter-click.mp3'
    };

    Object.entries(sounds).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.3; // Default volume
      soundsRef.current[key] = audio;
    });

    return () => {
      // Cleanup
      Object.values(soundsRef.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const playSound = (soundKey: string, options?: SoundOptions) => {
    const audio = soundsRef.current[soundKey];
    if (!audio) return;

    try {
      audio.currentTime = 0;
      if (options?.volume !== undefined) {
        audio.volume = options.volume;
      }
      audio.loop = options?.loop || false;
      audio.play().catch(() => {
        // Silently handle play errors (user hasn't interacted yet)
      });
    } catch (error) {
      // Silently handle audio errors
    }
  };

  const stopSound = (soundKey: string) => {
    const audio = soundsRef.current[soundKey];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return { playSound, stopSound };
};
