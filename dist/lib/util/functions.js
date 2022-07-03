var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import axios from "axios";
import {
  copyFile,
  lstat,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile
} from "fs/promises";
import { join, resolve } from "node:path";
const replaceInFile = /* @__PURE__ */ __name(async ({
  filePath,
  replaceWith,
  toReplace
}) => {
  let content = await readFile(filePath, "utf8");
  content = content.replaceAll(toReplace, replaceWith);
  await writeFile(filePath, content);
}, "replaceInFile");
const downloadFile = /* @__PURE__ */ __name(async (path, url) => {
  const res = await axios.get(url, { responseType: "blob" });
  await writeFile(path, res.data);
}, "downloadFile");
const renameFile = /* @__PURE__ */ __name(async ({
  oldPath,
  newPath
}) => {
  await copyFile(oldPath, newPath);
  await rm(oldPath, { recursive: true, force: true });
}, "renameFile");
const copyDir = /* @__PURE__ */ __name(async ({ from, to }) => {
  await mkdir(to);
  for (const element of await readdir(from)) {
    const outPath = resolve(join(to, element));
    if ((await lstat(join(from, element))).isFile()) {
      await copyFile(join(from, element), outPath);
    } else {
      await copyDir({
        from: join(from, element),
        to: outPath
      });
    }
  }
}, "copyDir");
export {
  copyDir,
  downloadFile,
  renameFile,
  replaceInFile
};
//# sourceMappingURL=functions.js.map