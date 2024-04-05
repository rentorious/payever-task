import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Avatar {
  @ObjectIdColumn()
  _id: string;

  @Column({ unique: true })
  userId: number;

  @Column({ nullable: false })
  hash: string;
}
