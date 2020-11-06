import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';
import { ApiErrorEnum } from 'ptcg-server';

export class ApiError implements Error {
  code: ApiErrorEnum;
  name: string;
  message: string;
  stack: string;
  timeout: boolean;
  handled: boolean;

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
