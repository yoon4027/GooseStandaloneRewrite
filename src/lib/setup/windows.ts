import { copyDir } from "#lib/util";
import { Logger } from "@dimensional-fun/logger";
import { execSync } from "child_process";
import { readdir, rm } from "fs/promises";
import { join } from "path";

const logger = new Logger("win-setup");

export const setupWindows = async ({ basePath }: SetupWindowsArgs) => {
  logger.info("Computing paths...");

  const oldAppPath = join(basePath, `app-0.0.0`);

  const exePath = join(
    oldAppPath,
    (await readdir(oldAppPath)).find((x) => x.includes(".exe"))!
  );

  logger.warn("Running Discord to generate installer.db...");

  execSync(`"${exePath}"`, { stdio: "inherit" });

  logger.info("Ran, finding new app dir");

  const newAppPath = join(
    basePath,
    (await readdir(basePath)).find((x) => x.startsWith(`app-1.`))!
  );

  logger.warn("Copying modules from new to old...");

  await copyDir({
    from: join(newAppPath, "modules"),
    to: join(oldAppPath, "modules"),
  });

  logger.info("Removing new...");

  await rm(newAppPath, { recursive: true, force: true });

  logger.info("Renaming old to new...");

  await copyDir({
    from: oldAppPath,
    to: newAppPath,
  });

  await rm(oldAppPath, { recursive: true, force: true });
};

interface SetupWindowsArgs {
  basePath: string;
}
