'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface LenisContextValue {
  stop: () => void;
  start: () => void;
}

const LenisContext = createContext<LenisContextValue>({ stop: () => {}, start: () => {} });

export function useLenis() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const ctx: LenisContextValue = {
    stop:  () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  };

  return (
    <LenisContext.Provider value={ctx}>
      {children}
    </LenisContext.Provider>
  );
}
