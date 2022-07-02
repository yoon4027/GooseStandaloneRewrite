import { Patch } from "#lib/structures";
import { copyFile } from "fs/promises";
import { join } from "node:path";

export class UserPatch extends Patch {
  public override async run({ asarFilePath, basePath }: Patch.Args) {
    await copyFile(
      asarFilePath,
      join(basePath, "resources", "app.asar.backup")
    );
  }
}
