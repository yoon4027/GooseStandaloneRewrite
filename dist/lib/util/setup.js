import { PatchStore } from "#lib/structures";
import { container } from "@sapphire/pieces";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
void container.stores.register(new PatchStore());
container.stores.registerPath(join(dirname(fileURLToPath(import.meta.url)), "..", ".."));
await container.stores.load();
//# sourceMappingURL=setup.js.map