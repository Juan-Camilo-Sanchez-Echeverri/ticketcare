import { Injectable, NotImplementedException, Logger } from '@nestjs/common';

import {
  StorageStrategy,
  IStorageStrategy,
  UploadableFile,
} from './interfaces/storage.interface';

import { LocalStrategy } from './strategies/local.storage.strategy';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly localStrategy: LocalStrategy) {}

  async saveFile(
    file: UploadableFile,
    path: string,
    strategy: StorageStrategy,
  ): Promise<string> {
    let buffer: Buffer;
    let originalname: string | undefined;

    if (Buffer.isBuffer(file)) {
      buffer = file;
    } else {
      buffer = file.buffer;
      originalname = file.originalname;
    }

    this.logAction('Save file', path, strategy);
    return this.getStrategy(strategy).saveFile(buffer, path, originalname);
  }

  async deleteFile(path: string, strategy: StorageStrategy): Promise<void> {
    this.logAction('Delete file', path, strategy);
    return this.getStrategy(strategy).deleteFile(path);
  }

  async deleteFolder(pathFolder: string, strategy: StorageStrategy) {
    this.logAction('Delete folder', pathFolder, strategy);
    const strategyInstance = this.getStrategy(strategy);

    return strategyInstance.deleteFolder(pathFolder);
  }

  async exists(filePath: string, strategy: StorageStrategy): Promise<boolean> {
    this.logAction('Check existence', filePath, strategy);
    const strategyInstance = this.getStrategy(strategy);

    if (typeof strategyInstance.exists === 'function') {
      return strategyInstance.exists(filePath);
    }

    return false;
  }

  getFileUrl(pathFile: string): string {
    this.logAction('Get file URL', pathFile, 'local');
    return this.localStrategy.getFileUrl(pathFile);
  }

  private getStrategy(strategy: StorageStrategy): IStorageStrategy {
    if (strategy === 'local') {
      return this.localStrategy;
    }
    throw new NotImplementedException();
  }

  private logAction(action: string, path: string, strategy: string) {
    this.logger.log(
      '\n==============================\n' +
        '   📦 StorageService Action    \n' +
        '------------------------------\n' +
        `   Action    : ${action}\n` +
        `   Path      : ${path}\n` +
        `   Strategy  : ${strategy}\n` +
        '==============================\n',
    );
  }
}
