import { randomBytes } from 'crypto';

export function generateRandomPath(length: number): string {
  const randomBytesBuffer = randomBytes(length);
  return randomBytesBuffer.toString('hex');
}

export function cleanAndGenerateRandomPath(filename: string): string {
  const randomPath = generateRandomPath(8);

  let cleanedFilename = filename.trim();
  cleanedFilename = cleanedFilename.replace(/[^\w.]/g, '');
  cleanedFilename = cleanedFilename.replace(/\.+/g, '.');
  cleanedFilename = cleanedFilename.replace(/^\.*/, '');
  const finalPath = `${randomPath}/${cleanedFilename}`;

  return finalPath;
}

export const makeFilenameWithSize = (params: { filename: string, width: number, height: number }) => {
  return `size-${params.width}-${params.height}-${params.filename}`
}