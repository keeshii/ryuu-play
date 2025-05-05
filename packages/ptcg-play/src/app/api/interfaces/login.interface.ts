import { Response } from './response.interface';
import { ServerConfig } from '@ryuu-play/ptcg-server';

export interface LoginResponse extends Response {
  token: string;
  config: ServerConfig;
}

export interface InfoResponse extends Response {
  config: ServerConfig;
}
