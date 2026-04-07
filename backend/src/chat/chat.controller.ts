import { Controller, Get, Post, Body, Param, Query, UseGuards} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRoomDto } from '../dto/create-room.dto';
import { GetMessagesParamsDto } from '../dto/get-messages-params.dto';
import { GetMessagesQueryDto } from '../dto/get-messages-query.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('rooms')
  async getRooms() {
    return this.chatService.getRooms();
  }

  @UseGuards(JwtAuthGuard)
  @Post('rooms')
  async createRoom(@Body() body: CreateRoomDto) {
    return this.chatService.createRoom(body.name, body.description);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rooms/:roomId/messages')
  async getMessages(
    @Param() params: GetMessagesParamsDto,
    @Query() query: GetMessagesQueryDto,
  ) {
    return this.chatService.getMessages(
      params.roomId,
      query.limit ?? 25,
      query.offset ?? 0,
    );
  }
}
