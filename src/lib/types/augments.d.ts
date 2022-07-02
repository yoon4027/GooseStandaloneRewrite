import type { PatchStore } from "#lib/structures/patchStore";

declare module "@sapphire/pieces" {
  interface StoreRegistryEntries {
    patches: PatchStore;
  }
}

export default undefined;
