import { useEffect, useRef, useState } from 'react';

interface StorefrontIntroProps {
  ready: boolean;
  onComplete: () => void;
}

const MIN_VISIBLE_MS = 1900;
const EXIT_MS = 720;
const REDUCED_MIN_VISIBLE_MS = 850;

type IntroPhase = 'visible' | 'leaving' | 'hidden';

export function StorefrontIntro({ ready, onComplete }: StorefrontIntroProps) {
  const [phase, setPhase] = useState<IntroPhase>('visible');
  const startedAt = useRef(performance.now());
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    document.body.classList.toggle('intro-active', phase !== 'hidden');
    return () => document.body.classList.remove('intro-active');
  }, [phase]);

  useEffect(() => {
    if (!ready || phase !== 'visible') return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minimum = reduced ? REDUCED_MIN_VISIBLE_MS : MIN_VISIBLE_MS;
    const elapsed = performance.now() - startedAt.current;
    const hold = Math.max(0, minimum - elapsed);

    const timer = window.setTimeout(() => setPhase('leaving'), hold);
    return () => window.clearTimeout(timer);
  }, [phase, ready]);

  useEffect(() => {
    if (phase !== 'leaving') return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => {
      setPhase('hidden');
      completeRef.current();
    }, reduced ? 0 : EXIT_MS);

    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`storefront-intro${phase === 'leaving' ? ' is-leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Preparando BRAIMARÚ"
    >
      <div className="storefront-intro-inner">
        <img
          className="storefront-intro-logo"
          src="/brand/braimaru-logo-premium.png"
          alt="BRAIMARÚ"
          width="720"
          height="569"
        />
        <p className="storefront-intro-kicker">Belleza natural · bienestar real</p>
        <h1>Preparando tu ritual.</h1>
        <div className="storefront-intro-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
