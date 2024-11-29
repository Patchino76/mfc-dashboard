import AnimatedGif from "@/app/components/AnimatedGif";
import React from "react";

const MillsOverviewPage = () => {
  return (
    <div>
      <h1>My Animated GIF</h1>
      <AnimatedGif
        gifSrc="/images/mill_running.gif"
        jpgSrc="/images/mill_stopped.jpg"
      />
    </div>
  );
};

export default MillsOverviewPage;
