var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { copyDir } from "#lib/util";
import { Logger } from "@dimensional-fun/logger";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { readdir, rm } from "fs/promises";
import { join } from "path";
const logger = new Logger("win-setup");
const setupWindows = /* @__PURE__ */ __name(async ({ basePath }) => {
  logger.info("Computing paths...");
  const oldAppPath = join(basePath, `app-0.0.0`);
  const exePath = join(oldAppPath, (await readdir(oldAppPath)).find((x) => x.includes(".exe")));
  if (!existsSync(exePath))
    return logger.error("Couldn't find the executable file.");
  logger.warn("Running Discord to generate installer.db...");
  execSync(`"${exePath}"`, { stdio: "inherit" });
  logger.info("Ran, finding new app dir");
  const newAppPath = join(basePath, (await readdir(basePath)).find((x) => x.startsWith(`app-1.`)));
  logger.warn("Copying modules from new to old...");
  await copyDir({
    from: join(newAppPath, "modules"),
    to: join(oldAppPath, "modules")
  });
  logger.info("Removing new...");
  await rm(newAppPath, { recursive: true, force: true });
  logger.info("Renaming old to new...");
  await copyDir({
    from: oldAppPath,
    to: newAppPath
  });
  return await rm(oldAppPath, { recursive: true, force: true });
}, "setupWindows");
export {
  setupWindows
};
//# sourceMappingURL=windows.js.map