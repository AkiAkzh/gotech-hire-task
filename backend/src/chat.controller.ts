import { Controller, Get, Post, Body, Param, Query, UseGuards} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

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
  async createRoom(@Body() body: any) {
    return this.chatService.createRoom(body.name, body.description);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rooms/:roomId/messages')
  async getMessages(
    @Param('roomId') roomId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedRoomId = parseInt(roomId, 10);
    const parsedLimit = Math.min(parseInt(limit || '25', 10), 100);
    const parsedOffset = parseInt(offset || '0', 10);

    return this.chatService.getMessages(parsedRoomId, parsedLimit, parsedOffset);
  }
}
