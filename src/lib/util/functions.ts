import type { ReplaceInFileOptions } from "#types/types";
import axios from "axios";
import {
  copyFile,
  lstat,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "fs/promises";
import { join, resolve } from "node:path";

export const replaceInFile = async ({
  filePath,
  replaceWith,
  toReplace,
}: ReplaceInFileOptions) => {
  let content = await readFile(filePath, "utf8");

  content = content.replaceAll(toReplace, replaceWith);

  await writeFile(filePath, content);
};

export const downloadFile = async (path: string, url: string) => {
  const res = await axios.get(url, { responseType: "blob" });

  return await writeFile(path, res.data);
};

export const renameFile = async ({
  oldPath,
  newPath,
}: {
  oldPath: string;
  newPath: string;
}) => {
  await copyFile(oldPath, newPath);

  await rm(oldPath, { recursive: true, force: true });
};

export const copyDir = async ({ from, to }: { from: string; to: string }) => {
  await mkdir(to);

  for (const element of await readdir(from)) {
    const outPath = resolve(join(to, element));
    if ((await lstat(join(from, element))).isFile()) {
      await copyFile(join(from, element), outPath);
    } else {
      await copyDir({
        from: join(from, element),
        to: outPath,
      });
    }
  }
};
