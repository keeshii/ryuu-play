import { BaseEntity, Column, Entity, Unique, PrimaryGeneratedColumn } from 'typeorm';

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

}
