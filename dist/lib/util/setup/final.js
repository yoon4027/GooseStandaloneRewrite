var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { setupWindows } from "#lib/setup/windows";
import { copyDir } from "#lib/util";
import { Logger } from "@dimensional-fun/logger";
import { createPackage } from "asar";
import { existsSync } from "fs";
import { mkdir, rm, writeFile } from "fs/promises";
import { join } from "path";
const logger = new Logger("final");
const final = /* @__PURE__ */ __name(async ({ basePath, asarFilePath, asarExtractPath }, { platform, finalPath }) => {
  await createPackage(asarExtractPath, asarFilePath);
  logger.info("Repacked asar");
  if (existsSync(finalPath)) {
    await rm(finalPath, { recursive: true, force: true });
  }
  await mkdir(join(finalPath, ".."), { recursive: true });
  await copyDir({
    from: basePath,
    to: finalPath
  });
  await rm(basePath, { recursive: true, force: true });
  await writeFile(join(finalPath, "package.json"), JSON.stringify({}));
  logger.warn("Finalised");
  if (platform === "windows") {
    logger.warn("Running script to setup windows standlone.");
    await setupWindows({
      basePath: join(finalPath, "..")
    });
  }
}, "final");
export {
  final
};
//# sourceMappingURL=final.js.map