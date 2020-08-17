import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Avatar } from './avatar';
import { Deck } from './deck';
import { Rank, rankLevels } from '../../backend/interfaces/rank.enum';

@Entity()
@Unique(['name'])
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number = 0;

  @Column()
  public name: string = '';

  @Column()
  public email: string = '';

  @Column()
  public ranking: number = 0;

  @Column()
  public password: string = '';

  @Column({ type: 'bigint' })
  public registered: number = 0;
  
  @Column({ type: 'bigint' })
  public lastSeen: number = 0;

  @Column({ type: 'bigint' })
  public lastRankingChange: number = 0;

  @Column()
  public avatarFile: string = '';

  @OneToMany(type => Deck, deck => deck.user)
  decks!: Deck[];

  @OneToMany(type => Avatar, avatar => avatar.user)
  avatars!: Avatar[];

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
