import { Patch } from "#lib/structures";
import { replaceInFile } from "#lib/util";
import type { DiscordClientType } from "#types/types";
import Inquirer from "inquirer";
import { join } from "node:path";

export class UserPatch extends Patch {
  public override async run({ asarExtractPath }: Patch.Args) {
    let { branch } = (await Inquirer.prompt([
      {
        type: "checkbox",

        name: "branch",

        message: "GooseUpdate mods",

        choices: [
          "smartcord",
          "betterdiscord",

          { name: "goosemod", checked: true },
        ],
      },
    ])) as { branch: DiscordClientType[] | string };

    (branch as string) = (branch as DiscordClientType[]).join("+");

    await replaceInFile({
      filePath: join(asarExtractPath, "app_bootstrap", "Constants.js"),
      toReplace: `const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || API_ENDPOINT`,
      replaceWith: `const UPDATE_ENDPOINT = settings.get('UPDATE_ENDPOINT') || 'https://updates.goosemod.com/${branch}'`,
    });

    await replaceInFile({
      filePath: join(asarExtractPath, "app_bootstrap", "Constants.js"),
      toReplace: `const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || 'https://discord.com/api/updates/'`,
      replaceWith: `const NEW_UPDATE_ENDPOINT = settings.get('NEW_UPDATE_ENDPOINT') || 'https://updates.goosemod.com/${branch}/'`,
    });

    await replaceInFile({
      filePath: join(asarExtractPath, "common", "Settings.js"),
      toReplace: `return defaultValue`,
      replaceWith: `return key === 'SKIP_HOST_UPDATE' ? true : defaultValue`,
    });
  }
}
