import { file } from "../file/file";

const BASH_PROFILE_FILENAMES = [
  ".bashrc",
  ".bash_profile",
  ".bash_login",
  ".profile",
];

const ZSH_PROFILE_FILENAMES = [".zshrc", ".zprofile", ".zlogin"];

export async function findShellProfileFile() {
  const shell = process.env.SHELL || "";

  if (shell.includes("bash")) {
    for (const filename of BASH_PROFILE_FILENAMES) {
      const profileFile = file(`~/${filename}`);
      if (await profileFile.exists()) return profileFile;
    }

    return file(BASH_PROFILE_FILENAMES[0]);
  }

  if (shell.includes("zsh")) {
    for (const filename of ZSH_PROFILE_FILENAMES) {
      const profileFile = file(`~/${filename}`);
      if (await profileFile.exists()) return profileFile;
    }

    return file(ZSH_PROFILE_FILENAMES[0]);
  }

  if (shell.includes("fish")) {
    return file("~/.config/fish/config.fish");
  }

  return file("~/.profile");
}
