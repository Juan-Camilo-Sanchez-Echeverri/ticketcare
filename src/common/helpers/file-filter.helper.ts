import { UnsupportedMediaTypeException } from '@nestjs/common';
import { FILE_EXTENSIONS, IMAGE_EXTENSIONS } from '../constants';

export const imageFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: (
    error: UnsupportedMediaTypeException | null,
    isValid: boolean,
  ) => void,
) => {
  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = IMAGE_EXTENSIONS;

  if (validExtensions.includes(fileExtension)) return callback(null, true);

  const error = new UnsupportedMediaTypeException(
    `The file extension is not valid. Only files are allowed ${Object.values(
      validExtensions,
    ).join(', ')}`,
  );

  callback(error, false);
};

export const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: (error: string | null, isValid: boolean) => void,
) => {
  const fileExtension = file.originalname.split('.').pop();
  const validExtensions = FILE_EXTENSIONS;

  if (validExtensions.includes(fileExtension!)) return callback(null, true);

  const error = `The file extension ${file.originalname} is not valid. Only files are allowed ${Object.values(
    validExtensions,
  ).join(', ')}`;

  callback(error, false);
};
