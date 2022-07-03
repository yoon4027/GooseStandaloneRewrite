var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Patch } from "#lib/structures";
import { replaceInFile } from "#lib/util";
import Inquirer from "inquirer";
import { join } from "node:path";
class UserPatch extends Patch {
  async run({ asarExtractPath }) {
    let { branch } = await Inquirer.prompt([
      {
        type: "checkbox",
        name: "branch",
        message: "GooseUpdate mods",
        choices: [
          "smartcord",
          "betterdiscord",
          { name: "goosemod", checked: true }
        ]
      }
    ]);
    branch = branch.join("+");
    await replaceInFile({
      filePath: join(asarExtractPath, "app_bootstrap", "Constants.js"),
      toReplace: `const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || API_ENDPOINT`,
      replaceWith: `const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || 'https://updates.goosemod.com/${branch}'`
    });
    await replaceInFile({
      filePath: join(asarExtractPath, "app_bootstrap", "Constants.js"),
      toReplace: `const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || 'https://discord.com/api/updates/'`,
      replaceWith: `const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || 'https://updates.goosemod.com/${branch}/'`
    });
    await replaceInFile({
      filePath: join(asarExtractPath, "common", "Settings.js"),
      toReplace: `return defaultValue`,
      replaceWith: `return key === 'SKIP_HOST_UPDATE' ? true : defaultValue`
    });
  }
}
__name(UserPatch, "UserPatch");
export {
  UserPatch
};
//# sourceMappingURL=gooseupdate.js.map