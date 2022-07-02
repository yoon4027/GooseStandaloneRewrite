import { downloadFile } from "#lib/util";
import type { InitOptions } from "#types/types.js";
import { Logger } from "@dimensional-fun/logger";
import { toTitleCase } from "@sapphire/utilities";
import Asar from "asar";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "path";
import Tar from "tar";
import { brotliDecompressSync } from "zlib";

const logger = new Logger("init");

export const init = async ({ channel, platform, buildPath }: InitOptions) => {
  const dirPath = join(buildPath, channel, platform);

  const basePath = join(
    dirPath,
    platform === "windows"
      ? "files"
      : `Discord${channel === "stable" ? "" : toTitleCase(channel)}`
  );

  const asarFilePath = join(basePath, "resources", "app.asar");
  const asarExtractPath = join(dirPath, "asar");

  await rm(basePath, { recursive: true, force: true });
  await rm(asarExtractPath, { recursive: true, force: true });

  const tarPath = join(dirPath, `discord.tar.gz`);
  const exPath = join(dirPath);

  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }

  if (!existsSync(tarPath)) {
    switch (platform) {
      case "linux": {
        const url = `https://discord.com/api/download/${channel}?platform=linux&format=tar.gz`;

        logger.info("Downloading tar (", url, ")");

        await downloadFile(tarPath, url);

        break;
      }

      case "windows": {
        const manifestUrl = `https://discord.com/api/updates/distributions/app/manifests/latest?channel=${channel}&platform=win&arch=x86`;

        logger.info("Downloading tar ( 1/2 - manifest -", manifestUrl, ")");

        const manifest = await (await fetch(manifestUrl)).json();

        logger.info("Downloading tar ( 2/2 - tar -", manifest.full.url, ")");

        const data = brotliDecompressSync(
          await (await fetch(manifest.full.url)).arrayBuffer()
        );

        await writeFile(tarPath, data);

        break;
      }
    }
  }

  logger.info("Got tar");

  if (!existsSync(basePath)) {
    await Tar.x({
      file: tarPath,
      cwd: exPath,
    });
  }

  logger.info("Extracted tar");

  if (platform === "windows") {
    await rm(join(dirPath, `delta_manifest.json`));

    logger.info(
      "Completed windows specific post-extract update package fixing"
    );
  }

  if (!existsSync(asarExtractPath)) {
    mkdir(asarExtractPath, { recursive: true });

    Asar.extractAll(asarFilePath, asarExtractPath);
  }

  logger.info("Extracted asar");

  logger.info("Initialised");

  return {
    dirPath,
    basePath,

    asarFilePath,
    asarExtractPath,

    platform,
  };
};
