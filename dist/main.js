var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
await import("#lib/util/setup");
import { final } from "#lib/util/setup/final";
import { init } from "#lib/util/setup/init";
import { Logger } from "@dimensional-fun/logger";
import { container } from "@sapphire/pieces";
import { Result } from "@sapphire/result";
import { readFile, rm } from "fs/promises";
import { default as Inquirer } from "inquirer";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { exit } from "process";
const __dirname = dirname(fileURLToPath(import.meta.url));
const logger = new Logger("main");
async function bootstrap() {
  const buildPath = join(__dirname, "..", "out", "build");
  const distPath = join(__dirname, "..", "out", "dist");
  const defaultPatches = ["gooseupdate", "portable", "branding-files"];
  const allPatches = container.stores.get("patches").map((p) => p.name);
  const options = await Inquirer.prompt([
    {
      type: "input",
      name: "name",
      default: "goosestandalone",
      message: "Client name"
    },
    {
      type: "list",
      loop: false,
      name: "platform",
      default: "windows",
      message: "Discord platform",
      choices: ["linux", "windows"]
    },
    {
      type: "list",
      loop: false,
      name: "channel",
      default: "stable",
      message: "Discord channel",
      choices: ["stable", "ptb", "canary"]
    },
    {
      type: "checkbox",
      name: "patches",
      message: "Client patches",
      choices: allPatches.map((x) => ({
        checked: defaultPatches.includes(x),
        name: x
      }))
    }
  ]);
  const initResult = await Result.fromAsync(await init({ ...options, buildPath }));
  if (initResult.isErr()) {
    return logger.error(initResult.err());
  }
  const dirs = initResult.unwrap();
  const patchesStore = container.stores.get("patches");
  const extraInformation = {
    ...options,
    buildInfo: JSON.parse(await readFile(join(dirs.basePath, "resources", "build_info.json"), "utf8"))
  };
  for (const patchName of options.patches) {
    void await patchesStore.get(patchName)?.run({ ...dirs }, extraInformation);
  }
  logger.info("\n\nFinalising...");
  const finalPath = join(distPath, options.channel, options.platform, options.platform === "windows" ? `app-0.0.0` : "");
  await rm(finalPath, { recursive: true, force: true });
  const finalResult = await Result.fromAsync(await final(dirs, { ...extraInformation, finalPath }));
  if (finalResult.isErr()) {
    return logger.error(finalResult.err());
  }
  logger.silly("Process fully done.");
  exit(0);
}
__name(bootstrap, "bootstrap");
await bootstrap();
//# sourceMappingURL=main.js.map