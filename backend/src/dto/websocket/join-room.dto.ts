import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class JoinRoomDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roomId: number;
}