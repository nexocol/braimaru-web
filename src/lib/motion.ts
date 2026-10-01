import { useLayoutEffect, useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Scroll-driven scenes declared with data attributes inside `scope`:
 *  - [data-lines]   headline reveal, line by line, through a mask
 *  - [data-fade]    soft rise + fade (optional data-delay in seconds)
 *  - [data-stagger] same, applied to the direct children
 *  - [data-mask]    clip-path reveal for figures (+ data-parallax="n" on the figure for the inner image)
 * Content stays fully visible when motion is reduced or JS fails: nothing is hidden by CSS alone
 * except [data-lines] before it is split (guarded by the .motion-ready class).
 */
export function useScrollScenes(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;

    document.documentElement.classList.add('motion-ready');

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-lines]').forEach((element) => {
        SplitText.create(element, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          linesClass: 'split-line',
          onSplit(self) {
            element.classList.add('is-split');
            return gsap.from(self.lines, {
              yPercent: 112,
              duration: 1.05,
              ease: 'power4.out',
              stagger: 0.09,
              scrollTrigger: { trigger: element, start: 'top 90%', once: true },
            });
          },
        });
      });

      root.querySelectorAll<HTMLElement>('[data-fade]').forEach((element) => {
        gsap.from(element, {
          y: 28,
          opacity: 0,
          duration: 0.95,
          ease: 'power3.out',
          delay: Number(element.dataset.delay ?? 0),
          scrollTrigger: { trigger: element, start: 'top 91%', once: true },
        });
      });

      root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((element) => {
        gsap.from(Array.from(element.children), {
          y: 26,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });

      root.querySelectorAll<HTMLElement>('[data-mask]').forEach((element) => {
        gsap.from(element, {
          clipPath: 'inset(9% 7% 9% 7% round 48px)',
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });

        const amount = Number(element.dataset.parallax ?? 0);
        const image = element.querySelector<HTMLElement>('img');
        if (amount && image) {
          gsap.fromTo(
            image,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: 'none',
              scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            },
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, [scope]);
}

/**
 * Depth from the pointer: writes --px / --py in [-1, 1] on `scope` (eased).
 * Layers read them with `translate: calc(var(--px) * var(--depth) * 1px) ...` (see .depth in CSS).
 */
export function usePointerDepth(scope: RefObject<HTMLElement | null>, ease = 0.085) {
  useEffect(() => {
    const element = scope.current;
    if (!element || prefersReducedMotion() || !hasFinePointer()) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const tick = () => {
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      element.style.setProperty('--px', x.toFixed(4));
      element.style.setProperty('--py', y.toFixed(4));
      const settled = Math.abs(targetX - x) < 0.001 && Math.abs(targetY - y) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      kick();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      kick();
    };

    element.addEventListener('pointermove', onMove, { passive: true });
    element.addEventListener('pointerleave', onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', onLeave);
    };
  }, [scope, ease]);
}

/** Very subtle magnetic pull (max ~7px) on [data-magnetic] elements inside scope. */
export function useMagnetic(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion() || !hasFinePointer()) return;

    const cleanups: Array<() => void> = [];
    root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((element) => {
      const toX = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' });
      const toY = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' });
      const onMove = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        toX(Math.max(-7, Math.min(7, dx * 0.16)));
        toY(Math.max(-5, Math.min(5, dy * 0.2)));
      };
      const onLeave = () => {
        toX(0);
        toY(0);
      };
      element.addEventListener('pointermove', onMove, { passive: true });
      element.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        element.removeEventListener('pointermove', onMove);
        element.removeEventListener('pointerleave', onLeave);
        gsap.set(element, { clearProps: 'x,y' });
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [scope]);
}

export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
