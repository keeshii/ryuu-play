import { State, GameError, GameMessage, Player, PokemonCardList } from '../../game';
import { SimpleBotOptions, PokemonScores } from '../simple-bot-options';

export abstract class SimpleScore {

  constructor(protected options: SimpleBotOptions) { }

  public abstract getScore(state: State, playerId: number): number;

  protected getPlayer(state: State, playerId: number): Player {
    const player = state.players.find(p => p.id === playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    return player;
  }

  protected getPokemonScoreBy(scores: PokemonScores, cardList: PokemonCardList): number {
    const card = cardList.getPokemonCard();

    if (card === undefined) {
      return 0;
    }

    let damage = 0;
    card.attacks.forEach(a => damage += a.damage);

    let score = 0;
    score += scores.hp * card.hp;
    score += scores.damage * damage;
    score += scores.ability * card.powers.length;
    score += scores.retreat * card.retreat.length;
    return score;
  }

}
