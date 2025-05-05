import { GameInfo } from '@ptcg/common';

export class SocketCache {
  gameInfoCache: {[id: number]: GameInfo} = {};
  lastLogIdCache: {[id: number]: number} = {};
}
