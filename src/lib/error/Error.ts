import { errorCodes, HttpStatus } from './ErrorCodes';

export type ErrorOptions<T> = {
  message?: string;
  statusCode?: number;
  data?: T;
};

class AppError<T> extends Error {
  public statusCode: HttpStatus;
  public data: T | null;

  constructor(options: ErrorOptions<T>) {
    const { statusCode = 500, data = null } = options;

    const statusCodeErrorMessage = typeof statusCode === 'number' ? errorCodes.get(statusCode) : '';

    const message = options.message ?? statusCodeErrorMessage;
    super(message);

    this.statusCode = statusCode;
    this.data = data;
  }
}

const createThrow =
  (code?: HttpStatus) =>
  <T>(options: ErrorOptions<T> = {}) => {
    throw new AppError({ statusCode: code, ...options });
  };

export const createApplicationError = () => ({
  throw: createThrow(),
  badData: createThrow(HttpStatus.UnprocessableEntity),
  badRequest: createThrow(HttpStatus.BadRequest),
  forbidden: createThrow(HttpStatus.Forbidden),
  notFound: createThrow(HttpStatus.NotFound),
  unauthorized: createThrow(HttpStatus.Unauthorized),
});

export type CreateApplicationError = ReturnType<typeof createApplicationError>;
