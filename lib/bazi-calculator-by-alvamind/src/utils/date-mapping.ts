// src/utils/date-mapping.ts
import { accessSync, readFileSync } from "fs";
import path from "path";
import type { DateMappings } from "../types";

// Helper function to get data file path
function getDataPath(filename: string): string {
  // In development, use the project root
  if (process.env.NODE_ENV !== "production") {
    console.log("development mode");
    return path.join(
      process.cwd(),
      "lib/bazi-calculator-by-alvamind/src",
      filename
    );
  }

  // In production (Vercel), try different possible locations
  const possiblePaths = [
    // Add more production paths at the beginning
    path.join(process.cwd(), "app/api", filename),
    path.join(process.cwd(), "app", filename),
    path.join(process.cwd(), filename),
    // Keep existing paths
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
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Current working directory:", process.cwd());
  console.log("Trying to find data file in paths:", possiblePaths);

  // Return the first path that exists
  for (const possiblePath of possiblePaths) {
    try {
      accessSync(possiblePath);
      console.log("Found data file at:", possiblePath);
      return possiblePath;
    } catch (e) {
      console.log(`Failed to access ${possiblePath}:`, (e as Error).message);
      continue;
    }
  }

  // If no path exists, try loading from a different location in production
  if (process.env.NODE_ENV === "production") {
    try {
      // In production, try to load from the build directory
      const buildPath = path.join(process.cwd(), ".next/static/data", filename);
      accessSync(buildPath);
      console.log("Found data file in build directory:", buildPath);
      return buildPath;
    } catch (e: unknown) {
      console.log("Failed to load from build directory:", (e as Error).message);
    }
  }

  // If still not found, throw a more descriptive error
  throw new Error(
    `Could not find ${filename} in any location. ` +
      `Environment: ${process.env.NODE_ENV}, ` +
      `Working directory: ${process.cwd()}`
  );
}

export class DateMappingLoader {
  private dateMappings: DateMappings;

  constructor(
    private mappingsPath: string = getDataPath("dates_mapping.json")
  ) {
    this.dateMappings = this.loadDateMappings();
  }

  private loadDateMappings(): DateMappings {
    try {
      return JSON.parse(readFileSync(this.mappingsPath, "utf-8"));
    } catch (error) {
      console.error("Failed to load date mappings:", error);
      throw error;
    }
  }

  public getMapping(year: number, month: number, day: number) {
    if (
      !this.dateMappings[year] ||
      !this.dateMappings[year][month] ||
      !this.dateMappings[year][month][day]
    ) {
      throw new Error(`No date mapping found for ${year}-${month}-${day}`);
    }
    return this.dateMappings[year][month][day];
  }
}
