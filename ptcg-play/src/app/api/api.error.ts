import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';

export enum ApiErrorEnum {
  ERROR_BAD_TOKEN = 'ERROR_BAD_TOKEN',
  ERROR_REQUESTS_LIMIT_REACHED = 'ERROR_REQUESTS_LIMIT_REACHED',
  ERROR_UNKNOWN_REQUEST = 'ERROR_UNKNOWN_REQUEST',
  ERROR_LOGIN_INVALID = 'ERROR_LOGIN_INVALID',
}

export class ApiError implements Error {
  code: ApiErrorEnum;
  name: string;
  message: string;
  stack: string;
  timeout: boolean;

  constructor(ex: HttpErrorResponse | TimeoutError) {
    this.name = ex.name;
    this.message = ex.message;

    if (ex instanceof HttpErrorResponse && ex.error && ex.error.error) {
      this.code = ex.error.error;
    }

    this.timeout = ex instanceof TimeoutError;
  }

}
