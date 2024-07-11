// useFPS.js
import { useRef } from 'react';

const useFPS = () => {
  const lastCalledTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const fpsRef = useRef(0);

  const tick = () => {
    frameCountRef.current++;
    const delta = (performance.now() - lastCalledTimeRef.current) / 1000;
    if (delta > 1) {
      fpsRef.current = frameCountRef.current / delta;
      frameCountRef.current = 0;
      lastCalledTimeRef.current = performance.now();
    }
    return fpsRef.current;
  };

  return tick;
};

export default useFPS;
