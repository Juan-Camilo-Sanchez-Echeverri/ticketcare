export const diacriticSensitiveRegex = (input: string): string => {
  return input
    .replace(/a/gi, '[aáàäAÁÀÄ]')
    .replace(/e/gi, '[eéëEÉË]')
    .replace(/i/gi, '[iíïIÍÏ]')
    .replace(/o/gi, '[oóöòOÓÖÒ]')
    .replace(/u/gi, '[uüúùUÜÚÙ]');
};
