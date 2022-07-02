import { Patch } from "#lib/structures";
import { renameFile, replaceInFile } from "#lib/util";
import { toTitleCase } from "@sapphire/utilities";
import { join } from "path";

export class UserPatch extends Patch {
  public override async run(
    { basePath }: Patch.Args,
    { name, channel, platform }: Patch.ArgsExtra
  ) {
    if (platform === "linux") await this.runLinux({ basePath, name, channel });

    const execSuffix = channel === "stable" ? "" : toTitleCase(channel);
    const execExt = platform === "windows" ? ".exe" : "";

    const execPath = join(basePath, `Discord${execSuffix}${execExt}`);

    await renameFile({
      oldPath: execPath,
      newPath: join(basePath, `${toTitleCase(name)}${execSuffix}${execExt}`),
    });
  }

  private async runLinux({ basePath, channel, name }: RunLinuxOptions) {
    const desktopPath = join(
      basePath,
      `discord${channel === "stable" ? "" : `-${channel}`}.desktop`
    );

    await replaceInFile({
      filePath: desktopPath,
      toReplace: "discord",
      replaceWith: name.toLowerCase(),
    });

    await replaceInFile({
      filePath: desktopPath,
      toReplace: "Discord",
      replaceWith: toTitleCase(name),
    });

    // Rename file
    await renameFile({
      oldPath: desktopPath,
      newPath: join(
        basePath,
        `${name.toLowerCase()}${
          channel === "stable" ? "" : `-${channel}`
        }.desktop`
      ),
    });
  }
}

type RunLinuxOmit = Omit<Patch.ArgsExtra, "platform">;

interface RunLinuxOptions extends Omit<RunLinuxOmit, "buildInfo"> {
  basePath: string;
}
