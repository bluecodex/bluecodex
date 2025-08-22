import { embeddedCommand } from "../command/command";
import { ioc } from "../ioc";
import { addSourceConfigResolverInstructionToShellProfile } from "./add-source-config-resolver-instruction-to-shell-profile";
import { saveBluecodexConfigShFile } from "./save-bluecodex-config-sh-file";
import { saveConfigResolver } from "./save-config-resolver";

export const configBlue = embeddedCommand(
  "config alias",
  {
    description: "Configure your bluecodex setup",
    alias: { validate: ["blue", "b"] },
  },
  async ({ alias }) => {
    await saveConfigResolver();
    await saveBluecodexConfigShFile(alias);
    const { sourceInstruction } =
      await addSourceConfigResolverInstructionToShellProfile();

    console.log(
      `Run ${ioc.theme.stylePrimary(`${sourceInstruction}`)} or restart your terminal.`,
    );
  },
);
