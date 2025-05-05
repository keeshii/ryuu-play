import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Avatar } from './avatar';
import { Deck } from './deck';
import { Replay } from './replay';
import { Rank, rankLevels } from '@ptcg/common';
import { bigint } from '../transformers/bigint';

@Entity()
@Unique(['name'])
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name: string = '';

  @Column()
  public email: string = '';

  @Column()
  public ranking: number = 0;

  @Column()
  public password: string = '';

  @Column({ type: 'bigint', transformer: [ bigint ] })
  public registered: number = 0;
  
  @Column({ type: 'bigint', transformer: [ bigint ] })
  public lastSeen: number = 0;

  @Column({ type: 'bigint', transformer: [ bigint ] })
  public lastRankingChange: number = 0;

  @Column()
  public avatarFile: string = '';

  @OneToMany(type => Deck, deck => deck.user)
    decks!: Deck[];

  @OneToMany(type => Avatar, avatar => avatar.user)
    avatars!: Avatar[];

  @OneToMany(type => Replay, replay => replay.user)
    replays!: Replay[];

  public getRank(): Rank {
    let rank = rankLevels[0].rank;
    for (const level of rankLevels) {
      if (level.points > this.ranking) {
        break;
      }
      rank = level.rank;
    }
    return rank;
  }

  public async updateLastSeen(): Promise<this> {
    this.lastSeen = Date.now();
    await User.update(this.id, { lastSeen: this.lastSeen });
    return this;
  }

}
