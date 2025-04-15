import { BaziCalculator } from "@/lib/bazi-calculator-by-alvamind/src/bazi-calculator";

// Initialize calculator
const calculator = new BaziCalculator(
  1990, // Year
  5, // Month
  10, // Day
  12, // Hour (24-hour format)
  "male" // Gender
);

// Get complete analysis
const analysis = calculator.getCompleteAnalysis();

// Display Chinese characters
console.log(calculator.toString()); // 庚午年辛巳月乙酉日壬午時
console.log(analysis);
