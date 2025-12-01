import { randomInt } from 'node:crypto';

export function generateRandomPassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  let password = '';
  password += uppercase.charAt(randomInt(0, uppercase.length));
  password += lowercase.charAt(randomInt(0, lowercase.length));
  password += numbers.charAt(randomInt(0, numbers.length));

  const allChars = uppercase + lowercase + numbers;
  for (let i = 0; i < 4; i++) {
    password += allChars.charAt(randomInt(0, allChars.length));
  }

  const arr = password.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  return arr.join('');
}
