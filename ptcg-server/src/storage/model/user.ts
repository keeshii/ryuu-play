import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Avatar } from './avatar';
import { Deck } from './deck';
import { Rang } from '../rang.enum';

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
  public rang: Rang = Rang.JUNIOR;

  @Column()
  public avatarFile: string = '';

  @OneToMany(type => Deck, deck => deck.user)
  decks!: Deck[];

  @OneToMany(type => Avatar, avatar => avatar.user)
  avatars!: Avatar[];

}
