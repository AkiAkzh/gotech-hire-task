import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('messages')
@Index('IDX_messages_room_id_created_at', ['roomId', 'createdAt'])
@Index('IDX_messages_user_id', ['userId'])
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: number;

  @Column()
  userId: number;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  senderName: string;

  @CreateDateColumn()
  createdAt: Date;
}