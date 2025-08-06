import { execa } from "execa";
import which from "which";

export type GitRefData = Awaited<ReturnType<typeof getCurrentGitRef>>;

export async function getCurrentGitRef() {
  try {
    const hasGit = await which("git", { nothrow: true });
    if (!hasGit) return { type: "git-cli-unavailable" } as const;

    const { stdout } = await execa`git symbolic-ref --short HEAD`;
    return { type: "branch", name: stdout.trim() } as const;
  } catch (error) {
    try {
      // Not in a git branch, check if in a detached head
      const { stdout } = await execa`git rev-parse --short HEAD`;

      return { type: "detached-head", commit: stdout.trim() } as const;
    } catch {
      return { type: "not-a-git-repo" } as const;
    }
  }
}
