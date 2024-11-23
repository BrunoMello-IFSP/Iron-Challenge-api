class AppError extends Error {
  public readonly message: string;
  public readonly errorCode?: string;
  public readonly statusCode: number;

  constructor(message: string, errorCode?: string, statusCode = 400) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

export default AppError;
