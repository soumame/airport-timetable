import * as React from "react";
import { ReactNode, FC, useEffect, useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";

export const Marquee: FC<{ children: ReactNode; limitWidth: number }> = ({
  children,
  limitWidth,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const { translateX } = useSpring({
    config: {
      duration: 10000,
    },
    from: {
      translateX: "0%",
    },
    to: {
      translateX: "-100%",
    },
    delay: 2000,
    onRest: () => {
      setStartAnimation(false);
    },
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const { width } = containerRef.current.getBoundingClientRect();
    if (width >= limitWidth) setStartAnimation(true);
  }, [limitWidth]);

  return (
    <div className="Marquee">
      {!startAnimation && (
        <span ref={containerRef} className="MarqueeWidthExtract">
          {children}
        </span>
      )}
      {!startAnimation && <span className="MarqueeText">{children}</span>}
      {startAnimation && (
        <animated.div
          style={{
            translateX: translateX,
          }}
        >
          <span className="MarqueeText">{children}</span>
        </animated.div>
      )}
    </div>
  );
};
