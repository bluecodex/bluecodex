import type { GitRefData } from "./get-current-git-ref";

export function gitRefDescription(refData: GitRefData) {
  switch (refData.type) {
    case "branch":
      return `You are in the branch "${refData.name}"`;
    case "detached-head":
      return `You are in a detached HEAD commit "${refData.commit}"`;
    case "git-cli-unavailable":
      return `The git command is not available`;
    case "not-a-git-repo":
      return `The is not a git repo`;
  }
}
