import { Controller, Get, Post, Body, Param, UseGuards} from '@nestjs/common';
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
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages(parseInt(roomId, 10));
  }
}
