export class ResponseDto {
  constructor(id: string, message: string) {
    this.id = id;
    this.message = message;
  }

  id: string;
  message: string;
}