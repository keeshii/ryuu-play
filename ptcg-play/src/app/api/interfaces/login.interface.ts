import { Response } from './response.interface';

export interface LoginResponse extends Response {
  token: string;
}
