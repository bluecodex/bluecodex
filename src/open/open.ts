import openPackage from "open";

export async function open(target: string) {
  await openPackage(target);
  return;
}
