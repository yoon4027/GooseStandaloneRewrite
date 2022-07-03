var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Patch } from "#lib/structures";
import { renameFile, replaceInFile } from "#lib/util";
import { toTitleCase } from "@sapphire/utilities";
import { join } from "path";
class UserPatch extends Patch {
  async run({ basePath }, { name, channel, platform }) {
    if (platform === "linux")
      await this.runLinux({ basePath, name, channel });
    const execSuffix = channel === "stable" ? "" : toTitleCase(channel);
    const execExt = platform === "windows" ? ".exe" : "";
    const execPath = join(basePath, `Discord${execSuffix}${execExt}`);
    await renameFile({
      oldPath: execPath,
      newPath: join(basePath, `${toTitleCase(name)}${execSuffix}${execExt}`)
    });
  }
  async runLinux({ basePath, channel, name }) {
    const desktopPath = join(basePath, `discord${channel === "stable" ? "" : `-${channel}`}.desktop`);
    await replaceInFile({
      filePath: desktopPath,
      toReplace: "discord",
      replaceWith: name.toLowerCase()
    });
    await replaceInFile({
      filePath: desktopPath,
      toReplace: "Discord",
      replaceWith: toTitleCase(name)
    });
    await renameFile({
      oldPath: desktopPath,
      newPath: join(basePath, `${name.toLowerCase()}${channel === "stable" ? "" : `-${channel}`}.desktop`)
    });
  }
}
__name(UserPatch, "UserPatch");
export {
  UserPatch
};
//# sourceMappingURL=branding-files.js.map