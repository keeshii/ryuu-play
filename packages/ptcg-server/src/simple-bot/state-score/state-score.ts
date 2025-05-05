import { State, PokemonCardList, Card } from '../../game';
import { SimpleScore } from './score';
import { SimpleBotOptions } from '../simple-bot-options';
import { HandScore } from './hand-score';
import { OpponentScore } from './opponent-score';
import { PlayerScore } from './player-score';
import { SpecialConditionsScore } from './special-conditions-score';
import { ActiveScore } from './active-score';
import { BenchScore } from './bench-score';
import { EnergyScore } from './energy-score';
import { DamageScore } from './damage-score';
import { ToolsScore } from './tools-score';

export class StateScore extends SimpleScore {

  private handScore: HandScore;
  private opponentScore: OpponentScore;
  private playerScore: PlayerScore;
  private specialConditionsScore: SpecialConditionsScore;
  private activeScore: ActiveScore;
  private benchScore: BenchScore;
  private energyScore: EnergyScore;
  private damageScore: DamageScore;
  private toolsScore: ToolsScore;

  constructor(protected options: SimpleBotOptions) {
    super(options);
    this.handScore = new HandScore(options);
    this.opponentScore = new OpponentScore(options);
    this.playerScore = new PlayerScore(options);
    this.specialConditionsScore = new SpecialConditionsScore(options);
    this.activeScore = new ActiveScore(options);
    this.benchScore = new BenchScore(options);
    this.energyScore = new EnergyScore(options);
    this.damageScore = new DamageScore(options);
    this.toolsScore = new ToolsScore(options);
  }

  public getScore(state: State, playerId: number): number {
    const handScore = this.handScore.getScore(state, playerId);
    const opponentScore = this.opponentScore.getScore(state, playerId);
    const playerScore = this.playerScore.getScore(state, playerId);
    const specialConditionsScore = this.specialConditionsScore.getScore(state, playerId);
    const activeScore = this.activeScore.getScore(state, playerId);
    const benchScore = this.benchScore.getScore(state, playerId);
    const energyScore = this.energyScore.getScore(state, playerId);
    const damageScore = this.damageScore.getScore(state, playerId);
    const toolsScore = this.toolsScore.getScore(state, playerId);

    const score = handScore
      + opponentScore
      + playerScore
      + specialConditionsScore
      + activeScore
      + benchScore
      + energyScore
      + damageScore
      + toolsScore;

    return score;
  }

  public getCardScore(state: State, playerId: number, card: Card): number {
    const player = this.getPlayer(state, playerId);
    const index = player.hand.cards.findIndex(c => c.id === card.id);

    const baseScore = this.handScore.getScore(state, playerId);
    let afterScore = baseScore;

    // Card is not in the hand, what if we have it?
    if (index === -1) {
      player.hand.cards.push(card);
      afterScore = this.handScore.getScore(state, playerId);
      player.hand.cards.pop();
    // Card is in our hand, what if we loses it?
    } else {
      const c = player.hand.cards.splice(index, 1);
      afterScore = this.handScore.getScore(state, playerId);
      player.hand.cards.splice(index, 0, c[0]);
    }

    return afterScore - baseScore;
  }

  public getPokemonScore(cardList: PokemonCardList): number {
    return this.getPokemonScoreBy(this.options.scores.active, cardList);
  }

}
