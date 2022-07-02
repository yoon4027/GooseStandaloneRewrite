import type { PatchRun, PatchRunExtra } from "#types/types";
import { Piece } from "@sapphire/pieces";

export abstract class Patch extends Piece {
  public run(
    args: PatchRun,
    extraInformation: PatchRunExtra
  ): Promise<string> | string | void | Promise<void>;

  public run(): string {
    return "Done!";
  }
}

export declare namespace Patch {
  type Args = PatchRun;
  type ArgsExtra = PatchRunExtra;
}
