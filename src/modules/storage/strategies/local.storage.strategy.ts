import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';

import { generateFileNameAndPath } from '@common/helpers';

import { IStorageStrategy } from '../interfaces/storage.interface';

@Injectable()
export class LocalStrategy implements IStorageStrategy {
  private readonly baseDirectory = path.resolve(process.cwd());

  async saveFile(
    buffer: Buffer,
    folder: string,
    originalname?: string,
  ): Promise<string> {
    const extFromPath = path.extname(folder);
    const ext = originalname ? path.extname(originalname) : '';

    const relPath = extFromPath
      ? folder.replaceAll(/^\/+/, '')
      : generateFileNameAndPath(ext, folder);

    const fullPath = path.join(this.baseDirectory, relPath);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    await fs.writeFile(fullPath, buffer);

    buffer.fill(0);

    return `/${relPath}`;
  }

  async deleteFile(pathFile: string): Promise<void> {
    const fullPath = path.join(this.baseDirectory, pathFile);
    await fs.unlink(fullPath).catch(() => {});
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      const absolutePath = path.join(this.baseDirectory, filePath);
      await fs.access(absolutePath, fs.constants.F_OK | fs.constants.R_OK);
      return true;
    } catch {
      return false;
    }
  }

  async getFolderSize(pathFolder: string): Promise<number> {
    const fullPath = path.join(this.baseDirectory, pathFolder);
    const entries = await fs.readdir(fullPath, { withFileTypes: true });

    const sizes = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(fullPath, entry.name);
        if (entry.isDirectory()) {
          return this.getFolderSize(entryPath);
        }
        const { size } = await fs.stat(entryPath);
        return size;
      }),
    );

    return sizes.reduce((acc, size) => acc + size, 0);
  }

  async deleteFolder(pathFolder: string): Promise<void> {
    const absolutePath = path.join(this.baseDirectory, pathFolder);
    const directoryPath = path.dirname(absolutePath);

    try {
      await fs.rm(directoryPath, { recursive: true, force: true });
    } catch {
      console.error(
        `rm failed for ${directoryPath}. Falling back to manual delete.`,
      );
      await this.deleteFolderRecursive(directoryPath);
    }
  }

  getFileUrl(pathFile: string): string {
    return `/${pathFile.replaceAll('\\\\', '/').replaceAll(/^\/+/, '')}`;
  }

  private async deleteFolderRecursive(folderPath: string): Promise<void> {
    const relativePath = path.relative(this.baseDirectory, folderPath);
    const exists = await this.exists(relativePath);

    if (exists) {
      const entries = await fs.readdir(folderPath, { withFileTypes: true });

      await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(folderPath, entry.name);
          if (entry.isDirectory()) {
            await this.deleteFolderRecursive(fullPath);
          } else {
            await fs.unlink(fullPath);
          }
        }),
      );

      await fs.rmdir(folderPath);
    }
  }
}
