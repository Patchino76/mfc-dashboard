"use client";
import React, { useEffect, useState } from "react";

const AnimatedGif = ({
  gifSrc,
  jpgSrc,
  state,
}: {
  gifSrc: string;
  jpgSrc: string;
  state: boolean;
}) => {
  const [isPlaying, setIsPlaying] = useState(state);

  const toggleAnimation = () => {
    setIsPlaying((prev) => !prev);
  };
  useEffect(() => {
    setIsPlaying(state);
  }, [state]);

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        key={isPlaying ? "animated" : "static"} // Force re-render when switching
        src={isPlaying ? gifSrc : jpgSrc}
        alt="Animated GIF"
        style={{
          width: "200px",
          height: "auto",
          opacity: isPlaying ? 1 : 0.5,
          transition: "opacity 0.3s ease-in-out",
        }}
        onClick={toggleAnimation}
      />
    </div>
  );
};

export default AnimatedGif;
