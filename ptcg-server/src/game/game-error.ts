

export enum GameMessage {
  BOT_NOT_INITIALIZED = 'BOT_NOT_INITIALIZED',
  BOT_NOT_FOUND = 'BOT_NOT_FOUND',
  CLIENT_NOT_CONNECTED = 'CLIENT_NOT_CONNECTED',
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  ACTION_IN_PROGRESS = 'ACTION_IN_PROGRESS',
  ILLEGAL_ACTION = 'ILLEGAL_ACTION',
  ALREADY_PLAYING = 'ALREADY_PLAYING',
  MAX_PLAYERS_REACHED = 'MAX_PLAYERS_REACHED',
  SETUP_PLAYER_NO_BASIC = 'SETUP_NO_BASIC',
  SETUP_OPPONENT_NO_BASIC = 'SETUP_OPPONENT_NO_BASIC',
  SETUP_WHO_BEGINS_FLIP = 'SETUP_WHO_BEGINS_FLIP',
  CHOOSE_STARTING_POKEMONS = 'CHOOSE_STARTING_POKEMONS',
  UNKNOWN_CARD = 'UNKNOWN_CARD',
  NOT_YOUR_TURN = 'NOT_YOUR_TURN',
  PROMPT_ALREADY_RESOLVED = 'PROMPT_ALREADY_RESOLVED',
  INVALID_TARGET = 'INVALID_TARGET',
  UNKNOWN_ATTACK = 'UNKNOWN_ATTACK',
  ENERGY_ALREADY_ATTACHED = 'ENERGY_ALREADY_ATTACHED',
  NOT_ENOUGH_ENERGY = 'NOT_ENOUGH_ENERGY',
  RETREAT_MESSAGE = 'RETREAT_MESSAGE'
}

export class GameError extends Error {

  constructor(message: GameMessage, public param?: string) {
    super(message);
  }

}
