import { v4 as uuid } from 'uuid';

export function generateFileNameAndPath(ext: string, folder: string): string {
  let cleanFolder = folder;

  while (cleanFolder.length > 0 && cleanFolder.endsWith('/')) {
    cleanFolder = cleanFolder.slice(0, -1);
  }

  let safeExt = '';
  if (ext.startsWith('.')) {
    safeExt = ext;
  } else if (ext) {
    safeExt = `.${ext}`;
  }

  const fileName = `${uuid()}${safeExt}`;
  const path = `${cleanFolder}/${fileName}`;

  return path;
}
