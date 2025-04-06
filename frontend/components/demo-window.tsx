"use client";
import React, { useState, useEffect } from "react";

export function DemoWindow() {
  // State to store the randomly selected video source
  const [videoSource, setVideoSource] = useState<string | null>(null);

  // Effect to randomly select one video source on component mount
  useEffect(() => {
    const videos = [
      "/static/small_demo_appointment.mp4",
      "/static/small_demo_videocall.mp4"
    ];
    const randomIndex = Math.floor(Math.random() * videos.length);
    setVideoSource(videos[randomIndex]);
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-xl overflow-hidden relative shadow-xl transition-transform duration-300 hover:scale-105 bg-gray-100'}`}>
      {/* Header con botones de ventana */}
      <div className="h-8 flex items-center px-4 bg-opacity-90" style={{ backgroundColor: '#E9E9E9' }}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
      </div>

      {/* Contenedor del video con tamaño fijo */}
      <div className="aspect-video relative z-20">
        {videoSource && (
          <video 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline 
            loading="lazy"
            preload="none"
            ref={(videoElement) => {
              if (videoElement) {
                // Set a random start time between 0 and 70% of the video duration
                videoElement.addEventListener('loadedmetadata', () => {
                  const randomStartTime = Math.random() * (videoElement.duration * 0.7);
                  videoElement.currentTime = randomStartTime;
                });
              }
            }}
          >
            <source src={videoSource} type="video/mp4" />
            Tu navegador no soporta la etiqueta de video.
          </video>
        )}
      </div>
    </div>
  );
}