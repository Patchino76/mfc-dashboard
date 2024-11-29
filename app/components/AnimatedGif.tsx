"use client";
import React, { useState } from "react";

const AnimatedGif = ({
  gifSrc,
  jpgSrc,
}: {
  gifSrc: string;
  jpgSrc: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleAnimation = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        key={isPlaying ? "animated" : "static"} // Force re-render when switching
        src={isPlaying ? gifSrc : jpgSrc}
        alt="Animated GIF"
        style={{
          width: "300px",
          height: "auto",
          opacity: isPlaying ? 1 : 0.5,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
      <button
        onClick={toggleAnimation}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isPlaying ? "Pause Animation" : "Play Animation"}
      </button>
    </div>
  );
};

export default AnimatedGif;
