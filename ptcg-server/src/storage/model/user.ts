import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number = 0;

  @Column()
  public name: string = '';

  @Column()
  public password: string = '';


}
