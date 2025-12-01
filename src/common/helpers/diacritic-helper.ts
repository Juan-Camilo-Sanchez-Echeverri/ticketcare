export const diacriticSensitiveRegex = (input: string): string => {
  return input
    .replaceAll(/a/gi, '[aáàäAÁÀÄ]')
    .replaceAll(/e/gi, '[eéëEÉË]')
    .replaceAll(/i/gi, '[iíïIÍÏ]')
    .replaceAll(/o/gi, '[oóöòOÓÖÒ]')
    .replaceAll(/u/gi, '[uüúùUÜÚÙ]');
};
