var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Patch } from "#lib/structures";
import { Store } from "@sapphire/pieces";
class PatchStore extends Store {
  constructor() {
    super(Patch, { name: "patches" });
  }
}
__name(PatchStore, "PatchStore");
export {
  PatchStore
};
//# sourceMappingURL=patchStore.js.map