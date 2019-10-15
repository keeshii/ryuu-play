import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';

export enum ApiErrorEnum {
  ERROR_BAD_TOKEN = 'ERROR_BAD_TOKEN',
  ERROR_REQUESTS_LIMIT_REACHED = 'ERROR_REQUESTS_LIMIT_REACHED',
  ERROR_UNKNOWN_REQUEST = 'ERROR_UNKNOWN_REQUEST',
  ERROR_LOGIN_INVALID = 'ERROR_LOGIN_INVALID',
  ERROR_SOCKET = 'ERROR_SOCKET',
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
    let code = undefined;

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
