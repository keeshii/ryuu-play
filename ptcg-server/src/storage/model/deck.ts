import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from './user';

@Entity()
@Unique(['user', 'name'])
export class Deck extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(type => User, user => user.decks)
    user: User = new User();

  @Column()
  public name: string = '';

  @Column({ type: 'text' })
  public cards: string = '';

  @Column()
  public isValid: boolean = false;

  @Column()
  public cardTypes: string = '[]';

}
