import { useEffect, useState, useRef } from "react";

export function useIntersectionObserver(options = {}, onceOnly = false) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  const { root = null, rootMargin = "0px", threshold = 0 } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);

        // Unobserve after first intersection if onceOnly is true
        if (entry.isIntersecting && onceOnly && ref.current) {
          observer.unobserve(ref.current);
        }
      },
      { root, rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [root, rootMargin, threshold, onceOnly]);

  return [ref, isIntersecting];
}