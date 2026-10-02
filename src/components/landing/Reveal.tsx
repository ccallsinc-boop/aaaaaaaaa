import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Fades a section up as the page loads.
 *
 * This used to be a framer-motion `whileInView` wrapper, which meant two things
 * that cost conversions. The server HTML carried `style="opacity:0"` on every
 * section, so the whole page below the hero was invisible until the bundle
 * hydrated; and because the trigger was the viewport, a bundle that failed to load
 * left those sections invisible for good — offer, guarantee, FAQ and all.
 *
 * The fade now runs from `.rise` in styles.css. It starts at first paint instead of
 * at hydration, so the content is readable as soon as the HTML arrives, with or
 * without JavaScript. The trade is that sections no longer wait for the scroll to
 * reach them: by the time the visitor scrolls down, they are already in place.
 * A section the visitor can read beats a section that animates nicely.
 *
 * `y` is gone from the props because the distance now lives in the keyframes.
 */
export function Reveal({ children, delay = 0, className }: Props) {
  return (
    <div
      className={className ? `rise ${className}` : "rise"}
      style={delay ? ({ "--rise-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
