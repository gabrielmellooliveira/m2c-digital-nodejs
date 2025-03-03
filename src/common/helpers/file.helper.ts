export class FileHelper {
  static getText(buffer: Buffer): string[] {
    const fileContent = buffer.toString('utf-8');
    return fileContent.split(/\r?\n/);
  }
}