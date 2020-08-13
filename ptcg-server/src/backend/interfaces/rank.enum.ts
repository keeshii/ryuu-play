export enum Rank {
  JUNIOR = 'JUNIOR',
  SENIOR = 'SENIOR',
  MASTER = 'MASTER'
}

export interface RankLevel {
  points: number;
  rank: Rank;
}

export const rankLevels: RankLevel[] = [
  { points: 0, rank: Rank.JUNIOR },
  { points: 1000, rank: Rank.SENIOR },
  { points: 3000, rank: Rank.MASTER }
];
