import React, { useState, useEffect } from "react";

export default function Loading() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fadeState, setFadeState] = useState("in");
  const [scaleState, setScaleState] = useState(1);

  const headers = [
    "Calculating your BaZi destiny...",
    "Reading the cosmic energies...",
    "Decoding your elemental balance...",
    "Interpreting your life pillars...",
  ];

  const descriptions = [
    "Aligning the stars and elements for your personalized reading.",
    "Discovering how the five elements influence your destiny.",
    "Analyzing the patterns in your birth chart for insights.",
    "Connecting ancient wisdom to your modern journey.",
  ];

  const emojis = ["🧭", "✨", "🔮", "⚡"];

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setScaleState((prev) => (prev === 1 ? 1.2 : 1));
    }, 1500);

    return () => clearInterval(pulseInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("out");

      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % headers.length);
        setFadeState("in");
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 transition-all duration-500">
      <div className="mb-6 relative">
        <span
          className="text-6xl inline-block transition-transform duration-1000"
          style={{
            transform: `scale(${scaleState}) translateY(${
              scaleState === 1 ? "0px" : "-8px"
            })`,
          }}
        >
          {emojis[currentTextIndex]}
        </span>

        <div className="absolute -top-3 -right-3">
          <span className="text-2xl animate-ping inline-block opacity-75">
            ✨
          </span>
        </div>
      </div>

      <h2
        className={`text-2xl font-semibold mb-3 text-slate-800 transition-opacity duration-500 ${
          fadeState === "in" ? "opacity-100" : "opacity-0"
        }`}
      >
        {headers[currentTextIndex]}
      </h2>

      <p
        className={`text-slate-600 text-lg text-center px-4 max-w-md transition-opacity duration-500 ${
          fadeState === "in" ? "opacity-100" : "opacity-0"
        }`}
      >
        {descriptions[currentTextIndex]}
      </p>

      <div className="flex mt-8 space-x-2">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full bg-slate-400 animate-pulse`}
            style={{
              animationDelay: `${index * 0.2}s`,
              opacity: currentTextIndex === index ? 1 : 0.4,
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <p className="text-slate-500 text-sm animate-pulse">
          This may take a moment...
        </p>
      </div>
    </div>
  );
}
