import { v4 as uuid } from 'uuid';

export function generateFileNameAndPath(ext: string, folder: string): string {
  const cleanFolder = folder.replace(/\/+$/, '');
  const safeExt = ext.startsWith('.') ? ext : ext ? `.${ext}` : '';

  const fileName = `${uuid()}${safeExt}`;
  const path = `${cleanFolder}/${fileName}`;

  return path;
}
