import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from './user';

@Entity()
@Unique(['user', 'name'])
export class Avatar extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(type => User, user => user.avatars)
    user: User = new User();

  @Column()
  public name: string = '';

  @Column()
  public fileName: string = '';

}
