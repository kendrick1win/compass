// src/utils/date-mapping.ts
import { readFileSync, accessSync } from "fs";
import path from "path";
import type { DateMappings } from "../types";

// Helper function to get data file path
function getDataPath(filename: string): string {
  // In development, use the project root
  if (process.env.NODE_ENV !== "production") {
    return path.join(
      process.cwd(),
      "lib/bazi-calculator-by-alvamind/src",
      filename
    );
  }

  // In production (Vercel), try different possible locations
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
  // Log the paths we're trying
  console.log("Trying to find data file in paths:", possiblePaths);

  // Return the first path that exists
  for (const possiblePath of possiblePaths) {
    try {
      accessSync(possiblePath);
      console.log("Found data file at:", possiblePath);
      return possiblePath;
    } catch (e) {
      continue;
    }
  }

  // If no path exists, return the most likely one
  const fallbackPath = path.join(
    process.cwd(),
    "lib/bazi-calculator-by-alvamind/src",
    filename
  );
  console.log("Using fallback path:", fallbackPath);
  return fallbackPath;
}

export class DateMappingLoader {
  // CACHING: Store loaded data in memory to avoid re-parsing JSON
  private dateMappings: DateMappings | null = null;
  // CACHING: Store individual lookup results to avoid repeated object traversal
  private cache = new Map<string, any>();

  constructor(
    private mappingsPath: string = getDataPath("dates_mapping.json")
  ) {}

  // LAZY LOADING: Only loads the JSON file when first accessed, not during instantiation
  private loadDateMappings(): DateMappings {
    // LAZY LOADING: Check if data is already loaded before reading from disk
    if (!this.dateMappings) {
      console.log("FIRST LOAD: Loading date mappings from disk");
      console.time("Date mappings load time");
      // LAZY LOADING: File is only read from disk on first access
      this.dateMappings = JSON.parse(readFileSync(this.mappingsPath, "utf-8"));
      console.timeEnd("Date mappings load time");
      console.log("Date mappings loaded and cached in memory");
    } else {
      console.log(
        "⚡ CACHE HIT: Using pre-loaded date mappings (no disk access)"
      );
    }
    // CACHING: Return the cached parsed data instead of re-reading file
    return this.dateMappings!; // Non-null assertion since we just loaded it
  }

  public getMapping(year: number, month: number, day: number) {
    // CACHING: Create unique key for this specific date lookup
    const cacheKey = `${year}-${month}-${day}`;

    // CACHING: Check if we've already looked up this exact date before
    if (this.cache.has(cacheKey)) {
      // CACHING: Return cached result instead of traversing the data structure again
      return this.cache.get(cacheKey);
    }

    // LAZY LOADING: Data is only loaded when we actually need to perform a lookup
    const mappings = this.loadDateMappings();

    if (!mappings[year]?.[month]?.[day]) {
      throw new Error(`No date mapping found for ${year}-${month}-${day}`);
    }

    const result = mappings[year][month][day];
    // CACHING: Store the lookup result for future requests of the same date
    this.cache.set(cacheKey, result);
    return result;
  }

  // Optimization Statistics.
  public getOptimizationStats() {
    return {
      cacheSize: this.cache.size,
      isLoaded: this.dateMappings !== null,
      memoryUsage: process.memoryUsage(),
    };
  }
}

// SINGLETON: Create a single shared instance across all API requests
let globalDateMappingLoader: DateMappingLoader | null = null;

export function getDateMappingLoader(): DateMappingLoader {
  if (!globalDateMappingLoader) {
    console.log(
      "CREATING SINGLETON: First time creating DateMappingLoader instance"
    );
    globalDateMappingLoader = new DateMappingLoader();
  } else {
    console.log("REUSING SINGLETON: Using existing DateMappingLoader instance");
  }
  return globalDateMappingLoader;
}
