var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Patch } from "#lib/structures";
import { replaceInFile } from "#lib/util";
import { join } from "node:path";
class UserPatch extends Patch {
  async run({ asarExtractPath }) {
    await replaceInFile({
      filePath: join(asarExtractPath, "common", "paths.js"),
      toReplace: `function determineUserData(userDataRoot, buildInfo) {`,
      replaceWith: `function determineUserData(userDataRoot, buildInfo) { return _path.default.join(process.resourcesPath, '..', 'userData');`
    });
  }
}
__name(UserPatch, "UserPatch");
export {
  UserPatch
};
//# sourceMappingURL=portable.js.map