
import { useEffect, useRef } from 'react';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
}

export const useSound = () => {
  const soundsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    console.log("useSound: initializing sounds");
    // Preload sounds
    const sounds = {
      typing: '/typing-beep.mp3',
      keyClick: '/key-click.mp3', 
      enterClick: '/enter-click.mp3'
    };

    Object.entries(sounds).forEach(([key, src]) => {
      try {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = 0.3; // Default volume
        soundsRef.current[key] = audio;
        console.log(`useSound: loaded ${key} sound`);
      } catch (error) {
        console.log(`useSound: failed to load ${key} sound:`, error);
      }
    });

    return () => {
      // Cleanup
      Object.values(soundsRef.current).forEach(audio => {
        try {
          audio.pause();
          audio.src = '';
        } catch (error) {
          console.log("useSound: cleanup error:", error);
        }
      });
    };
  }, []);

  const playSound = (soundKey: string, options?: SoundOptions) => {
    const audio = soundsRef.current[soundKey];
    if (!audio) {
      console.log(`useSound: sound ${soundKey} not found`);
      return;
    }

    try {
      audio.currentTime = 0;
      if (options?.volume !== undefined) {
        audio.volume = options.volume;
      }
      audio.loop = options?.loop || false;
      audio.play().catch((error) => {
        console.log(`useSound: failed to play ${soundKey}:`, error);
      });
    } catch (error) {
      console.log(`useSound: error playing ${soundKey}:`, error);
    }
  };

  const stopSound = (soundKey: string) => {
    const audio = soundsRef.current[soundKey];
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (error) {
        console.log(`useSound: error stopping ${soundKey}:`, error);
      }
    }
  };

  return { playSound, stopSound };
};
