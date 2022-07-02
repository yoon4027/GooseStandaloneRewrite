import { Patch } from "#lib/structures";
import { Store } from "@sapphire/pieces";

export class PatchStore extends Store<Patch> {
  public constructor() {
    super(Patch as any, { name: "patches" });
  }
}
