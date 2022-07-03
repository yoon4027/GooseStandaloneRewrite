var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Patch } from "#lib/structures";
import { replaceInFile } from "#lib/util";
import { join } from "path";
class UserPatch extends Patch {
  async run({ asarExtractPath }) {
    await replaceInFile({
      filePath: join(asarExtractPath, "app_bootstrap", "Constants.js"),
      toReplace: `const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || API_ENDPOINT`,
      replaceWith: `const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || 'https://updates.goosemod.com/' + (process.stdout.write('GooseUpdate mods:\\n1. GooseMod\\n2. BetterDiscord\\n3. SmartCord\\n\\nEnter number(s) of mods> ') ? require('child_process').execSync("bash -c 'read -p \\"foobar\\" inp; echo $inp'", {stdio: ['inherit', 'pipe', 'pipe'] }).toString().replace('1', 'goosemod ').replace('2', 'betterdiscord ').replace('3', 'smartcord ').trim().replace(' ', '+') : '')`
    });
    await replaceInFile({
      filePath: join(asarExtractPath, "app_bootstrap", "Constants.js"),
      toReplace: `const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || 'https://discord.com/api/updates/'`,
      replaceWith: `const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || (UPDATE_ENDPOINT + '/')`
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
//# sourceMappingURL=gooseupdate-runtime.js.map