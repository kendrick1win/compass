"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const slides = [
  {
    title: "What Is Bazi? ☯️",
    content: `Bazi, also known as the Four Pillars of Destiny, is a traditional Chinese system 
    that uses your birth date and time to reveal patterns in your personality, relationships, 
    career, and life direction. It is based on eight characters (八字) derived from the year, 
    month, day, and hour you were born.`,
  },
  {
    title: "Why Is Bazi Useful?",
    content: "Bazi is not about prediction — it's about clarity.",
    bullets: [
      "Make more aligned personal and career decisions",
      "Build healthier relationships",
      "Manage stress and energy more effectively",
      "Recognize when to act — and when to wait",
    ],
  },
  {
    title: "The Five Elements",
    content: "Your eight characters are built from the Five Elements:",
    elements: [
      { emoji: "🌿", name: "Wood" },
      { emoji: "🔥", name: "Fire" },
      { emoji: "🪨", name: "Earth" },
      { emoji: "🪙", name: "Metal" },
      { emoji: "💧", name: "Water" },
    ],
  },
  {
    title: "The Four Pillars",
    content: "Each pillar represents different aspects of your life:",
    pillars: [
      {
        name: "Year Pillar (年柱)",
        description:
          "Relationship with older generations and early childhood environment",
      },
      {
        name: "Month Pillar (月柱)",
        description: "Social environment and interactions with peers",
      },
      {
        name: "Day Pillar (日柱)",
        description: "Your identity and personal relationships",
      },
      {
        name: "Hour Pillar (时柱)",
        description: "Career potential and future planning",
      },
    ],
  },
];

const WhatIsBaziSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className="h-full flex flex-col items-center justify-center text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                  {slides[currentSlide].title}
                </h2>
                <div className="max-w-3xl">
                  <p className="text-xl text-gray-600 mb-6">
                    {slides[currentSlide].content}
                  </p>

                  {slides[currentSlide].bullets && (
                    <ul className="space-y-4 text-left">
                      {slides[currentSlide].bullets.map((bullet, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-600"
                        >
                          <span className="mr-2">•</span> {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                  {slides[currentSlide].elements && (
                    <div className="grid grid-cols-5 gap-4 mt-8">
                      {slides[currentSlide].elements.map((element, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-white shadow-sm"
                        >
                          <span className="text-3xl">{element.emoji}</span>
                          <p className="mt-2">{element.name}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {slides[currentSlide].pillars && (
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      {slides[currentSlide].pillars.map((pillar, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-white shadow-sm"
                        >
                          <h3 className="font-semibold text-lg">
                            {pillar.name}
                          </h3>
                          <p className="text-gray-600">{pillar.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg
              hidden xs:flex sm:flex"
            style={{ zIndex: 10 }}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg
              hidden xs:flex sm:flex"
            style={{ zIndex: 10 }}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
          {/* Mobile arrows below content */}
          <div className="flex justify-center gap-8 mt-6 sm:hidden">
            <button
              onClick={prevSlide}
              className="p-2 bg-white rounded-full shadow-lg"
              style={{ zIndex: 10 }}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 bg-white rounded-full shadow-lg"
              style={{ zIndex: 10 }}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full ${
                  currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsBaziSection;
