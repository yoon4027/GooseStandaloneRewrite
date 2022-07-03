import { setupWindows } from "#lib/setup/windows";
import { copyDir } from "#lib/util";
import type { PatchRun, PatchRunExtra } from "#types/types";
import { Logger } from "@dimensional-fun/logger";
import { createPackage } from "asar";
import { existsSync } from "fs";
import { mkdir, rm, writeFile } from "fs/promises";
import { join } from "path";

const logger = new Logger("final");

export const final = async (
  { basePath, asarFilePath, asarExtractPath }: PatchRun,
  { platform, finalPath }: FinalExtraInformation
) => {
  await createPackage(asarExtractPath, asarFilePath);

  logger.info("Repacked asar");

  if (existsSync(finalPath)) {
    await rm(finalPath, { recursive: true, force: true });
  }

  await mkdir(join(finalPath, ".."), { recursive: true });

  await copyDir({
    from: basePath,
    to: finalPath,
  });

  await rm(basePath, { recursive: true, force: true });

  await writeFile(join(finalPath, "package.json"), JSON.stringify({}));

  logger.warn("Finalised");

  if (platform === "windows") {
    logger.warn("Running script to setup windows standlone.");
    await setupWindows({
      basePath: join(finalPath, ".."),
    });
  }
};

interface FinalExtraInformation extends PatchRunExtra {
  finalPath: string;
}
