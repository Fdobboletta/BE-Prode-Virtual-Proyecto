export class CustomError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class DuplicateEmailError extends CustomError {
  constructor() {
    super('Email already registered.', 409);
  }
}

export class UnknownError extends CustomError {
  constructor(message: string = 'Unknown error occurred.') {
    super(message, 500);
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication failed.') {
    super(message, 401);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized.') {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Not found.') {
    super(message, 404);
  }
}
