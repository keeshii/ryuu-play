import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from './user';
import { GameWinner } from '../../game';

@Entity()
export class Match extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number = 0;

  @ManyToOne(type => User)
  player1: User = new User();

  @ManyToOne(type => User)
  player2: User = new User();

  @Column()
  public ranking1: number = 0;

  @Column()
  public rankingStake1: number = 0;

  @Column()
  public ranking2: number = 0;

  @Column()
  public rankingStake2: number = 0;

  @Column()
  public winner: GameWinner = GameWinner.NONE;

  @Column({ type: 'bigint' })
  public created: number = Date.now();

  @Column({ type: 'blob' })
  public replayData: string = '';

}
