import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from './user';
import { GameWinner, ReplayPlayer } from '../../game';
import { bigint } from '../transformers/bigint';

@Entity()
export class Replay extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number = 0;

  @ManyToOne(type => User)
  user: User = new User();

  @Column()
  public name: string = '';

  @Column({ type: 'simple-json' })
  player1: ReplayPlayer = { userId: 0, name: '', ranking: 0 };

  @Column({ type: 'simple-json' })
  player2: ReplayPlayer = { userId: 0, name: '', ranking: 0 };

  @Column()
  public winner: GameWinner = GameWinner.NONE;

  @Column({ type: 'bigint', transformer: [ bigint ] })
  public created: number = Date.now();

  @Column({ type: 'blob' })
  public replayData: string = '';

}
