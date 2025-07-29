export class BaseResponseDto<T> {
  data: T;
  message?: string;
  timestamp: string;

  constructor(data: T, message?: string) {
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
