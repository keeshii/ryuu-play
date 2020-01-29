import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Deck } from './deck';

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

  @OneToMany(type => Deck, deck => deck.user)
  decks!: Deck[];

}
