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
  private dateMappings: DateMappings;

  constructor(
    private mappingsPath: string = getDataPath("dates_mapping.json")
  ) {
    this.dateMappings = {} as DateMappings;
    this.initializeMappings();
  }

  private async initializeMappings() {
    this.dateMappings = await this.loadDateMappings();
  }

  private async loadDateMappings(): Promise<DateMappings> {
    try {
      // Use the mappingsPath that was found during initialization
      // Rather than using fetch which doesn't work in this context
      const data = readFileSync(this.mappingsPath, "utf8");
      return JSON.parse(data);
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
