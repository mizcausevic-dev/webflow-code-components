import { useEffect, useRef, useState } from 'react';

export const easeOutCubic = (t) => 1 - (1 - t) ** 3;

/** Value shown at time t (ms) of an animation of `duration` ms from 0 to `target`. */
export function valueAt(target, t, duration, decimals = 0) {
  const p = duration <= 0 ? 1 : Math.min(1, Math.max(0, t / duration));
  const f = 10 ** decimals;
  return Math.round(target * easeOutCubic(p) * f) / f;
}

/**
 * Animated statistic that counts up once when scrolled into view.
 * SSR renders the final value (no layout shift, correct for crawlers and no-JS);
 * honors prefers-reduced-motion; the accessible name is always the final value.
 */
export function StatCounter({ value = 0, decimals = 0, prefix = '', suffix = '', label = '', duration = 1600 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(Number(value));
  useEffect(() => {
    const node = ref.current;
    const target = Number(value);
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    setShown(0);
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        setShown(valueAt(target, now - start, duration, decimals));
        if (now - start < duration) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(node);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, decimals, duration]);

  const final = `${prefix}${Number(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  const now = `${prefix}${shown.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  return (
    <figure className="wcc-stat" ref={ref}>
      <span className="wcc-stat__value" aria-hidden="true">{now}</span>
      <span className="wcc-sr">{final}</span>
      {label ? <figcaption className="wcc-stat__label">{label}</figcaption> : null}
    </figure>
  );
}
