import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetMessagesParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roomId: number;
}