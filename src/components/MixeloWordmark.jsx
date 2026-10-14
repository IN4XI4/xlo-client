import { useLayoutEffect, useRef, useState } from 'react';

const SESSION_KEY = 'mixelo-wordmark-animated';
const DURATION = 1800;

function shouldAnimate() {
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return false;
  } catch {
    return false;
  }
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

// "mixelo." wordmark. On the first render of each browser session the blue dot
// starts as the tittle of the "i", rolls over "xe", hops over the "l" and drops
// into place at the end of the word.
export function MixeloWordmark() {
  const [animate] = useState(shouldAnimate);
  const refs = useRef({});
  const setRef = (key) => (el) => { refs.current[key] = el; };

  useLayoutEffect(() => {
    if (!animate) return;
    const { i, x, e, l, o, dot, tittle } = refs.current;
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // storage unavailable: animation just plays again next time
    }

    const fs = parseFloat(getComputedStyle(dot).fontSize);
    const dotRect = dot.getBoundingClientRect();
    const dotCenter = dotRect.left + dotRect.width / 2;
    const dxOver = (el) => {
      const r = el.getBoundingClientRect();
      return r.left + r.width / 2 - dotCenter;
    };
    // y is in em: how far above the baseline the bottom of the dot sits
    const pos = (dx, y, sx = 1, sy = 1) => `translate(${dx}px, ${-y * fs}px) scale(${sx}, ${sy})`;

    const dxI = dxOver(i);
    const dxO = dxOver(o);
    const dotAnim = dot.animate(
      [
        { offset: 0, transform: pos(dxI, 0.6) },
        { offset: 0.16, transform: pos(dxI, 0.6), easing: 'ease-in' },
        { offset: 0.34, transform: pos(dxOver(x), 0.55) },
        { offset: 0.46, transform: pos(dxOver(e), 0.55), easing: 'ease-out' },
        { offset: 0.56, transform: pos(dxOver(l), 0.95), easing: 'ease-in' },
        { offset: 0.66, transform: pos(dxO, 0.56, 1.15, 0.85), easing: 'ease-out' },
        { offset: 0.72, transform: pos(dxO * 0.5, 0.58), easing: 'ease-in' },
        { offset: 0.84, transform: pos(0, 0, 1.3, 0.7), easing: 'ease-out' },
        { offset: 0.92, transform: pos(0, 0.14), easing: 'ease-in' },
        { offset: 1, transform: pos(0, 0) },
      ],
      { duration: DURATION, fill: 'both' },
    );
    // the dark dot of the "i" fades in once the blue dot has left it
    const tittleAnim = tittle.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 300, delay: DURATION * 0.3, fill: 'both' },
    );

    return () => {
      dotAnim.cancel();
      tittleAnim.cancel();
    };
  }, [animate]);

  return (
    <span
      role="img"
      aria-label="Mixelo"
      className="inline-block whitespace-nowrap text-2xl font-bold leading-none tracking-tight text-[#132A43]"
    >
      <span aria-hidden="true">
        m
        {animate ? (
          <span ref={setRef('i')} className="inline-grid">
            <span className="[grid-area:1/1]">ı</span>
            <span ref={setRef('tittle')} className="[grid-area:1/1]">i</span>
          </span>
        ) : (
          'i'
        )}
        <span ref={setRef('x')} className="text-[#3DB1FF]">x</span>
        <span ref={setRef('e')}>e</span>
        <span ref={setRef('l')}>l</span>
        <span ref={setRef('o')}>o</span>
        <span
          ref={setRef('dot')}
          className="ms-[0.06em] inline-block h-[0.2em] w-[0.2em] origin-bottom rounded-full bg-[#3DB1FF]"
        />
      </span>
    </span>
  );
}
