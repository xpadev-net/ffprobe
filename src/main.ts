import { spawn } from "node:child_process";
import { type FfprobeOutput, FfprobeOutputSchema } from "./ffprobeSchema";

export const ffprobe = async (filePath: string): Promise<FfprobeOutput> => {
  return new Promise((resolve, reject) => {
    const ffprobeProcess = spawn("ffprobe", [
      "-v",
      "error",
      "-show_format",
      "-show_streams",
      "-of",
      "json",
      filePath,
    ]);

    let output = "";
    let errorOutput = "";

    ffprobeProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    ffprobeProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    ffprobeProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ffprobe exited with code ${code}: ${errorOutput}`));
      } else {
        try {
          const result = FfprobeOutputSchema.parse(JSON.parse(output));

          resolve(result);
        } catch (parseError) {
          if (parseError instanceof SyntaxError) {
            reject(
              new Error(
                `Failed to parse ffprobe output: ${parseError.message}`,
              ),
            );
          } else {
            reject(parseError);
          }
        }
      }
    });
  });
};
