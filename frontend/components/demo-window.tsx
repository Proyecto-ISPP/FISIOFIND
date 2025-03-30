"use client";
import { video } from "framer-motion/client";
import React from "react";

export function DemoWindow() {

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
        <video 
          className="w-full h-full object-cover"
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
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
          <source src="/static/demo_1.mp4" type="video/mp4" />
          <source src="/static/demo_1.webm" type="video/webm" />
          Tu navegador no soporta la etiqueta de video.
        </video>
      </div>
    </div>
  );
}