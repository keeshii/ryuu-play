import { Request, Response } from 'express';
import { ApiErrorEnum } from '../common/errors';

const EMAIL_PATTERN = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
const NAME_PATTERN = /^[a-zA-Z0-9]{3,32}$/;
const PASSWORD_PATTERN = /^[^\s]{5,32}$/;
const NUMBER_PATTERN = /^\d+$/;

export type ValidationFn = (value: any) => boolean;

export interface ValidationMap {
  [key: string]: Validator
}

export function Validate(validationMap: ValidationMap) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const handler = descriptor.value;

    if (handler === undefined) {
      return;
    }

    descriptor.value = function (req: Request, res: Response): any {
      req.body = req.body || {};
      for (const param in validationMap) {
        if (Object.prototype.hasOwnProperty.call(validationMap, param)) {
          const value = req.body[param];
          if (!validationMap[param].validate(value)) {
            res.statusCode = 400;
            res.send({error: ApiErrorEnum.VALIDATION_INVALID_PARAM, param});
            return;
          }
        }
      }
      return handler.apply(this, arguments);
    };
  };
}

export class Validator {
  public valid: boolean = true;
  private validators: ValidationFn[] = [];

  public validate(value: any): boolean {
    for (let i = 0; i < this.validators.length; i++) {
      if (this.validators[i](value) === false) {
        return false;
      }
    }
    return true;
  }

  public required(): Validator {
    this.validators.push((value: any) => !!value);
    return this;
  }

  public isString(): Validator {
    this.validators.push((value: any) => {
      return (typeof value === 'string');
    });
    return this;
  }

  public isBoolean(): Validator {
    this.validators.push((value: any) => {
      return (typeof value === 'boolean');
    });
    return this;
  }

  public isNumber(): Validator {
    this.validators.push((value: any) => {
      return (typeof value === 'number');
    });
    return this;
  }

  public minLength(len: number): Validator {
    this.isString();
    this.validators.push((value: string) => {
      return value.trim().length >= len;
    });
    return this;
  }

  public maxLength(len: number): Validator {
    this.isString();
    this.validators.push((value: string) => {
      return value.trim().length <= len;
    });
    return this;
  }

  public pattern(pattern: RegExp): Validator {
    this.isString();
    this.validators.push((value: string) => {
      return pattern.test(value);
    });
    return this;
  }

  public isEmail(): Validator {
    return this.pattern(EMAIL_PATTERN);
  }

  public isName(): Validator {
    return this.pattern(NAME_PATTERN);
  }

  public isPassword(): Validator {
    return this.pattern(PASSWORD_PATTERN);
  }

  public isInt(): Validator {
    this.isNumber();
    this.validators.push((value: number) => {
      const pattern = NUMBER_PATTERN;
      return pattern.test(String(value));
    });
    return this;
  }

}

export function check(): Validator {
  return new Validator();
}
