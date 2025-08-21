import { file } from "../file/file";
import { ioc } from "../ioc";

export async function source(pattern: string) {
  const files = (await file(pattern).exists())
    ? [file(pattern)]
    : await file.glob(pattern);

  for (const file of files) {
    const isLocalOnlyFile = file.path.startsWith(
      ioc.project.localBlueFolderPath,
    );

    if (isLocalOnlyFile) {
      await ioc.registry.markingAsLocal(async () => {
        await import(file.path);
        ioc.registry.registerSourceFile(file.path);
      });
    } else {
      await import(file.path);
      ioc.registry.registerSourceFile(file.path);
    }
  }

  return files;
}
