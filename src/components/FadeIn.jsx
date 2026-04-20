import { useInView } from '../hooks/useInView';

/**
 * FadeIn — Scroll-reveal wrapper.
 * Wraps any content in a div that fades up when scrolled into view.
 *
 * Props:
 *   delay    {number}  ms delay before animation plays (for stagger effects)
 *   className {string} additional Tailwind classes
 *   as       {string}  HTML element to render (default: 'div')
 */
export default function FadeIn({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
