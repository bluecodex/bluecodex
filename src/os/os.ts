import open from "open";

export class Os {
  async open(target: string) {
    await open(target);
    return;
  }
}

export const os = new Os();
