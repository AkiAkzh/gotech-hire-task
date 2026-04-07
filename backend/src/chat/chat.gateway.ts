import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ChatService } from '../chat/chat.service';
import { JoinRoomDto } from '../dto/websocket/join-room.dto';
import { SendMessageDto } from '../dto/websocket/send-message.dto';
import { LeaveRoomDto } from '../dto/websocket/leave-room.dto';
import { VerifiedJwtPayload } from '../types/auth.types';
import { NewMessagePayload } from '../types/message.types';
import { ROOM_CHANNEL_PREFIX, WS_EVENTS } from '../chat/chat.constants';

// TODO: consider using NestJS ConfigModule / ConfigService for centralized configuration management
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as VerifiedJwtPayload;
      client.data.user = payload;
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {}

  @SubscribeMessage(WS_EVENTS.JOIN_ROOM)
  handleJoinRoom(@MessageBody() data: JoinRoomDto, @ConnectedSocket() client: Socket) {
    if (!client.data.user) {
      throw new UnauthorizedException('Unauthorized socket connection');
    }

    const roomKey = `${ROOM_CHANNEL_PREFIX}${data.roomId}`;
    client.join(roomKey);
  }

  @SubscribeMessage(WS_EVENTS.SEND_MESSAGE)
  async handleMessage(@MessageBody() data: SendMessageDto, @ConnectedSocket() client: Socket) {
    if (!client.data.user) {
      throw new UnauthorizedException('Unauthorized socket connection');
    }

    const { roomId, content } = data;
    const { userId, username } = client.data.user as VerifiedJwtPayload;

    const message = await this.chatService.saveMessage(roomId, userId, content, username);

    const roomKey = `${ROOM_CHANNEL_PREFIX}${roomId}`;
    const payload: NewMessagePayload = {
      ...message,
      username,
    };

    this.server.to(roomKey).emit(WS_EVENTS.NEW_MESSAGE, payload);
  }

  @SubscribeMessage(WS_EVENTS.LEAVE_ROOM)
  handleLeaveRoom(@MessageBody() data: LeaveRoomDto, @ConnectedSocket() client: Socket) {
    if (!client.data.user) {
      throw new UnauthorizedException('Unauthorized socket connection');
    }

    const roomKey = `${ROOM_CHANNEL_PREFIX}${data.roomId}`;
    client.leave(roomKey);
  }
}