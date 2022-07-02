export interface PatchRun {
  dirPath: string;
  basePath: string;

  asarFilePath: string;
  asarExtractPath: string;

  platform: UserPlatform;
}

export interface InitOptions {
  platform: UserPlatform;
  channel: DiscordChannel;
  buildPath: string;
}

export interface PatchRunExtra {
  channel: DiscordChannel;
  name: string;
  platform: UserPlatform;
  buildInfo: BuildInfo;
}

export interface BuildInfo {
  newUpdater: boolean;
  releaseChannel: DiscordChannel;
  version: string;
}

export interface InquirerOptions extends Omit<PatchRunExtra, "buildInfo"> {
  patches: string[];
}

export interface ReplaceInFileOptions {
  filePath: string;
  toReplace: string;
  replaceWith: string;
}

export type DiscordChannel = "stable" | "ptb" | "canary";
export type UserPlatform = "windows" | "linux";
export type DiscordClientType = "smartcord" | "betterdiscord" | "goosemod";

export default undefined;
