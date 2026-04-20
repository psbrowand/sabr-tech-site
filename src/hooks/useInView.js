import { useEffect, useRef, useState } from 'react';

/**
 * useInView — lightweight Intersection Observer hook for scroll-reveal animations.
 *
 * @param {IntersectionObserverInit} options - Standard IntersectionObserver options.
 * @returns {[React.RefObject, boolean]} [ref, inView]
 *
 * Usage:
 *   const [ref, inView] = useInView({ threshold: 0.15 });
 *   <div ref={ref} className={inView ? 'visible' : 'hidden'}>…</div>
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // Once visible, stop observing — no re-animation on scroll back
          observer.disconnect();
        }
      },
      { threshold: 0.12, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, inView];
}
