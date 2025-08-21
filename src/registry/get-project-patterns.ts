import path from "node:path";

export function getProjectPatterns(root: string) {
  return [
    path.join(root, "bluecodex.{js,jsx,ts,tsx}"),
    path.join(root, "blue.{js,jsx,ts,tsx}"),
    path.join(root, ".blue/**/*.blue.{js,jsx,ts,tsx}"),
  ];
}
