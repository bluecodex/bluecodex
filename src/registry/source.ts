import { file } from "../file/file";
import { ioc } from "../ioc";

export async function source(pattern: string) {
  const files = (await file(pattern).exists())
    ? [file(pattern)]
    : await file.glob(pattern);

  for (const file of files) {
    const isLocalOnlyFile = file.filename.startsWith(
      ioc.project.localBlueFolderPath,
    );

    if (isLocalOnlyFile) {
      await ioc.registry.markingAsLocal(async () => {
        await import(file.filename);
        ioc.registry.registerSourceFile(file.filename);
      });
    } else {
      await import(file.filename);
      ioc.registry.registerSourceFile(file.filename);
    }
  }

  return files;
}
