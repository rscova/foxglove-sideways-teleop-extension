import { ExtensionContext } from "@foxglove/studio";
import { initSidewaysTeleopPanel } from "./SidewaysTeleopPanel";

export function activate(extensionContext: ExtensionContext) {
  extensionContext.registerPanel({ name: "SidewaysTeleop", initPanel: initSidewaysTeleopPanel });
}
