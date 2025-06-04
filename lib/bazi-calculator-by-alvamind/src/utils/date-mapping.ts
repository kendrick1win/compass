// src/utils/date-mapping.ts
import { readFileSync, accessSync } from "fs";
import path from "path";
import type { DateMappings } from "../types";

// Helper function to get data file path
function getDataPath(filename: string): string {
  if (process.env.NODE_ENV !== "production") {
    return path.join(
      process.cwd(),
      "lib/bazi-calculator-by-alvamind/src",
      filename
    );
  }

  // Try different possible production locations
  const possiblePaths = [
    path.join(process.cwd(), "public", filename),
    path.join(process.cwd(), "lib/bazi-calculator-by-alvamind/src", filename),
    path.join(
      process.cwd(),
      ".next/server/app/api/lib/bazi-calculator-by-alvamind/src",
      filename
    ),
    path.join(
      process.cwd(),
      ".next/server/chunks/lib/bazi-calculator-by-alvamind/src",
      filename
    ),
    path.join(process.cwd(), ".next/server/app/api", filename),
    path.join(process.cwd(), ".next/server/chunks", filename),
  ];

  for (const possiblePath of possiblePaths) {
    try {
      accessSync(possiblePath);
      return possiblePath;
    } catch (e) {
      continue;
    }
  }

  return path.join(
    process.cwd(),
    "lib/bazi-calculator-by-alvamind/src",
    filename
  );
}

export class DateMappingLoader {
  // Cache loaded JSON data and lookup results
  private dateMappings: DateMappings | null = null;
  private cache = new Map<string, any>();

  constructor(
    private mappingsPath: string = getDataPath("dates_mapping.json")
  ) {}

  // Lazy load: only read file when first needed
  private loadDateMappings(): DateMappings {
    if (!this.dateMappings) {
      console.log("first mappings.");
      this.dateMappings = JSON.parse(readFileSync(this.mappingsPath, "utf-8"));
    }
    console.log("return mappings");
    return this.dateMappings!;
  }

  public getMapping(year: number, month: number, day: number) {
    const cacheKey = `${year}-${month}-${day}`;

    // Return cached result if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const mappings = this.loadDateMappings();

    if (!mappings[year]?.[month]?.[day]) {
      throw new Error(`No date mapping found for ${year}-${month}-${day}`);
    }

    const result = mappings[year][month][day];
    this.cache.set(cacheKey, result);
    return result;
  }

  // Provides cache performance insights
  public getOptimizationStats() {
    return {
      cacheSize: this.cache.size,
      isLoaded: this.dateMappings !== null,
      memoryUsage: process.memoryUsage(),
    };
  }
}

// Singleton pattern: share instance across requests
let globalDateMappingLoader: DateMappingLoader | null = null;

export function getDateMappingLoader(): DateMappingLoader {
  if (!globalDateMappingLoader) {
    globalDateMappingLoader = new DateMappingLoader();
  }
  return globalDateMappingLoader;
}
