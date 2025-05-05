import { GameInfo } from '../interfaces';

export class SocketCache {
  gameInfoCache: {[id: number]: GameInfo} = {};
  lastLogIdCache: {[id: number]: number} = {};
}
