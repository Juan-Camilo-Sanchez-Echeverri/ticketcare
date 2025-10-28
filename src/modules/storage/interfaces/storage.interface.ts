export type UploadableFile = Buffer | Express.Multer.File;

export type StorageStrategy = 'local';

export interface IStorageStrategy {
  saveFile(
    file: Buffer,
    pathFile: string,
    originalname?: string,
  ): Promise<string>;

  deleteFile(pathFile: string): Promise<void>;

  deleteFolder(pathFolder: string): Promise<void>;
  exists?(pathFile: string): Promise<boolean>;
  getFolderSize?(pathFolder: string): Promise<number>;
}
