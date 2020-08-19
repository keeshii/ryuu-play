import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';

export enum ApiErrorEnum {
  ERROR_UNSUPPORTED_API_VERSION = 'ERROR_UNSUPPORTED_API_VERSION',
  ERROR_BAD_TOKEN = 'ERROR_BAD_TOKEN',
  ERROR_REQUESTS_LIMIT_REACHED = 'ERROR_REQUESTS_LIMIT_REACHED',
  ERROR_UNKNOWN_REQUEST = 'ERROR_UNKNOWN_REQUEST',
  ERROR_LOGIN_INVALID = 'ERROR_LOGIN_INVALID',
  ERROR_SOCKET = 'ERROR_SOCKET',
  ERROR_NAME_EXISTS = 'ERROR_NAME_EXISTS',
  ERROR_EMAIL_EXISTS = 'ERROR_EMAIL_EXISTS',
  ERROR_REGISTER_DISABLED = 'ERROR_REGISTER_DISABLED',
  ERROR_REGISTER_INVALID_SERVER_PASSWORD = 'ERROR_REGISTER_INVALID_SERVER_PASSWORD',
}

export class ApiError implements Error {
  code: ApiErrorEnum;
  name: string;
  message: string;
  stack: string;
  timeout: boolean;

  public static fromError(ex: HttpErrorResponse | TimeoutError): ApiError {
    if (ex instanceof ApiError) {
      return ex;
    }

    const name = ex.name;
    const message = ex.message;
    let code;

    if (ex instanceof HttpErrorResponse && ex.error && ex.error.error) {
      code = ex.error.error;
    }

    const apiError = new ApiError(code, message, name);
    apiError.timeout = ex instanceof TimeoutError;
    return apiError;
  }

  constructor(code: ApiErrorEnum, message?: string, name?: string) {
    this.name = name || code;
    this.message = message || code;
    this.code = code;
  }

}
