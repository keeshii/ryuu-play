export enum BotFlipMode {
  ALL_HEADS,
  ALL_TAILS,
  RANDOM
}

export enum BotShuffleMode {
  NO_SHUFFLE,
  REVERSE,
  RANDOM
}

export interface BotArbiterOptions {
  flipMode: BotFlipMode,
  shuffleMode: BotShuffleMode
}
