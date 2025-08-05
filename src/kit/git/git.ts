import { type GitRefData, getCurrentGitRef } from "./get-current-git-ref";
import { gitRefDescription } from "./git-ref-description";

export class Git {
  get ref(): Promise<GitRefData> {
    return getCurrentGitRef();
  }

  get branch(): Promise<string> {
    return this.ref.then((ref) => {
      if (ref.type === "branch") return ref.name;
      throw new Error(
        `Unable to get git branch name: ${gitRefDescription(ref)}`,
      );
    });
  }

  get detachedHeadCommit(): Promise<string> {
    return getCurrentGitRef().then((ref) => {
      if (ref.type === "detached-head") return ref.commit;
      throw new Error(
        `Unable to get detached head commit: ${gitRefDescription(ref)}`,
      );
    });
  }
}

export const git = new Git();
