// src/utils/date-mapping.ts
import { accessSync, readFileSync } from "fs";
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
  // In production, use the public directory
  return path.join(process.cwd(), "public", filename);
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
