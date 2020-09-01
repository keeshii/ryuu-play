import { Response } from './response.interface';

export interface ReplayResponse extends Response {
  replayData: string;
}
