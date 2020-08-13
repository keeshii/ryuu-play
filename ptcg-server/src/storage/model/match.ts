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
  public winner: GameWinner = GameWinner.NONE;

  @Column()
  public created: number = Date.now();

  @Column()
  public rankingStake: number = 0;

}
