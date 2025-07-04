import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { FfprobeOutputSchema } from "../src/schema/ffprobe";
import { describe, it, expect } from "vitest";

describe("FfprobeOutputSchema JSON parse test", () => {
  const dir = join(__dirname, "../testdata/FfprobeOutputSchema");
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    it(`parses ${file} without error and does not allow unknown keys`, () => {
      const json = JSON.parse(readFileSync(join(dir, file), "utf8"));
      const result = FfprobeOutputSchema.safeParse(json);
      if (!result.success) {
        console.error(result.error);
      }
      expect(result.data).toMatchObject(json);
      expect(result.success).toBe(true);
    });
  }
});
