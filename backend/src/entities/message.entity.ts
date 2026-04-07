import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('messages')
@Index('IDX_messages_room_id_created_at', ['room_id', 'createdAt'])
@Index('IDX_messages_user_id', ['user_id'])
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_id: number;

  @Column()
  user_id: number;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  senderName: string;

  @CreateDateColumn()
  createdAt: Date;
}
