export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];

export const VIDEO_MIME_TYPES = ['video/mp4'];

export const AUDIO_MIME_TYPES = ['audio/mpeg'];

export const OFFICE_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

export const PDF_MIME_TYPES = ['application/pdf'];

export const FILE_MIME_TYPES = [
  ...IMAGE_MIME_TYPES,
  ...VIDEO_MIME_TYPES,
  ...AUDIO_MIME_TYPES,
  ...OFFICE_MIME_TYPES,
  ...PDF_MIME_TYPES,
];
