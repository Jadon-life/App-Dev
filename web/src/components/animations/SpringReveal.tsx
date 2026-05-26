"use client";

/**
 * SpringReveal — Wraps children in React Spring sequential reveal animation.
 * Elements fade + slide up one after another with spring physics.
 */

import { useSpring, animated, useTrail } from "@react-spring/web";
import { useEffect, useState, Children } from "react";

interface SpringRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export function SpringFadeIn({ children, delay = 0 }: SpringRevealProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const spring = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0px)" : "translateY(30px)",
    config: { mass: 1, tension: 200, friction: 26 },
  });

  return <animated.div style={spring}>{children}</animated.div>;
}

interface TrailRevealProps {
  children: React.ReactNode[];
  delay?: number;
}

export function SpringTrail({ children, delay = 0 }: TrailRevealProps) {
  const [show, setShow] = useState(false);
  const items = Children.toArray(children);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const trail = useTrail(items.length, {
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0px) scale(1)" : "translateY(40px) scale(0.95)",
    config: { mass: 1, tension: 180, friction: 24 },
  });

  return (
    <>
      {trail.map((style, i) => (
        <animated.div key={i} style={style}>
          {items[i]}
        </animated.div>
      ))}
    </>
  );
}
