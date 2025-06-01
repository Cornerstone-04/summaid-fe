import { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return (
    <div
      className="fixed z-[9999] top-0 left-0 pointer-events-none"
      style={{
        transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`,
      }}
    >
      <div className="w-4 h-4 bg-sa-primary rounded-full relative z-10" />
      <div className="absolute -top-3 -left-3 w-10 h-10 border-2 border-sa-primary border-foreground/40 rounded-full animate-pulse" />
    </div>
  );
};
