import { downloadFile } from "#lib/util";
import type { DiscordManifest, InitOptions } from "#types/types.js";
import { Logger } from "@dimensional-fun/logger";
import { toTitleCase } from "@sapphire/utilities";
import Asar from "asar";
import axios, { AxiosResponse } from "axios";
import { createSpinner, Spinner } from "nanospinner";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "path";
import { x } from "tar";
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
    let downloadSpinner: Spinner;

    switch (platform) {
      case "linux": {
        const url = `https://discord.com/api/download/${channel}?platform=linux&format=tar.gz`;

        downloadSpinner = createSpinner(
          `Downloading tar ( 1/1 - tar - ${url})`
        ).start();

        await downloadFile(tarPath, url);

        downloadSpinner.success({ text: "Downloaded Tar" });
        break;
      }

      case "windows": {
        const manifestUrl = `https://discord.com/api/updates/distributions/app/manifests/latest?channel=${channel}&platform=win&arch=x86`;

        downloadSpinner = createSpinner(
          `Downloading tar ( 1/2 - manifest - ${manifestUrl} )`
        ).start();

        const manifestRequest: AxiosResponse<DiscordManifest> = await axios.get(
          manifestUrl
        );

        if (manifestRequest.status !== 200)
          logger.error("Failed to fetch the mainfest file.");

        downloadSpinner.success({ text: "Downloaded manifest." });

        const manifest = manifestRequest.data;

        downloadSpinner = createSpinner(
          `Downloading tar ( 2/2 - tar - ${manifest.full.url} )`
        ).start();

        const data = brotliDecompressSync(
          await axios.get(manifest.full.url, { responseType: "arraybuffer" })
        );

        await writeFile(tarPath, data);

        downloadSpinner.success({ text: "Downloaded Tar" });

        break;
      }
    }
  }

  if (!existsSync(basePath)) {
    const tarExtractSpinner = createSpinner("Extracting Tar").start();

    await x({
      file: tarPath,
      cwd: exPath,
    });

    tarExtractSpinner.success({ text: "Extracted Tar" });
  }

  if (platform === "windows") {
    await rm(join(dirPath, `delta_manifest.json`));

    logger.info(
      "Completed windows specific post-extract update package fixing"
    );
  }

  if (!existsSync(asarExtractPath)) {
    void mkdir(asarExtractPath, { recursive: true });

    const asarExractSpinner = createSpinner("Extracting Asar").start();

    Asar.extractAll(asarFilePath, asarExtractPath);

    asarExractSpinner.success({ text: "Extracted Asar." });
  }

  logger.info("Initialised");

  return {
    dirPath,
    basePath,

    asarFilePath,
    asarExtractPath,

    platform,
  };
};
