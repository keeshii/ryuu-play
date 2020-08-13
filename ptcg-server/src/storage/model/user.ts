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

  @Column()
  public registered: number = Date.now();
  
  @Column()
  public lastSeen: number = Date.now();

  @Column()
  public lastRankingChange: number = Date.now();

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

}
