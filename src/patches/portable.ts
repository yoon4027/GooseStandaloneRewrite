import { Patch } from "#lib/structures";
import { replaceInFile } from "#lib/util";
import { join } from "node:path";

export class UserPatch extends Patch {
  public override async run({ asarExtractPath }: Patch.Args) {
    await replaceInFile({
      filePath: join(asarExtractPath, "common", "paths.js"),
      toReplace: `function determineUserData(userDataRoot, buildInfo) {`,
      replaceWith: `function determineUserData(userDataRoot, buildInfo) { return _path.default.join(process.resourcesPath, '..', 'userData');`,
    });
  }
}
