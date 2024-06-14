export class LoggerError extends Error {
    public readonly name: string;
    public readonly message: string;
    public readonly statusCode: number;
  
    constructor(message: string, statusCode: number = 500) {
      super(message);
      this.name = this.constructor.name;
      this.message = message;
      this.statusCode = statusCode;
  
      // Ensures the name of this error is the same as the class name
      Object.setPrototypeOf(this, new.target.prototype);
      Error.captureStackTrace(this, this.constructor);
    }
  }
  