var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Patch } from "#lib/structures";
import { copyFile } from "fs/promises";
import { join } from "node:path";
class UserPatch extends Patch {
  async run({ asarFilePath, basePath }) {
    await copyFile(asarFilePath, join(basePath, "resources", "app.asar.backup"));
  }
}
__name(UserPatch, "UserPatch");
export {
  UserPatch
};
//# sourceMappingURL=asar-backup.js.map