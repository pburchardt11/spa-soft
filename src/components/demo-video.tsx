"use client";

import { useState, useRef } from "react";
import { Play, Pause, Maximize2 } from "lucide-react";

export default function DemoVideo() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  function handleEnded() {
    setPlaying(false);
  }

  function fullscreen() {
    videoRef.current?.requestFullscreen();
  }

  return (
    <div className="relative group cursor-pointer" onClick={toggle}>
      <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gradient-to-br from-violet-600 to-purple-700">
        <video
          ref={videoRef}
          src="/video/demo.mp4"
          poster="/video/demo-thumb.png"
          onEnded={handleEnded}
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Play / Pause overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        >
          {!playing && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          )}
          <div className="relative h-20 w-20 md:h-24 md:w-24 bg-white/95 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            {playing ? (
              <Pause className="h-8 w-8 md:h-10 md:w-10 text-violet-600" fill="currentColor" />
            ) : (
              <Play className="h-8 w-8 md:h-10 md:w-10 text-violet-600 ml-1" fill="currentColor" />
            )}
          </div>
        </div>

        {/* Caption (only when not playing) */}
        {!playing && (
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-left">
            <p className="text-white font-semibold text-lg md:text-xl">Full Product Tour</p>
            <p className="text-white/80 text-sm mt-1">Bookings · CRM · Payments · Analytics</p>
          </div>
        )}

        {/* Fullscreen button */}
        {playing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              fullscreen();
            }}
            className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
