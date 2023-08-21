import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { plainToClass } from 'class-transformer';
import { CreateMessageRequestDto, SocketMessagePayload } from './dto/request/create-message-request.dto';
import { CreateRoomRequestDto } from '../room/dto/request/create-room-request.dto';
import { RoomService } from '../room/room.service';
import { MessageType } from './enum/message-type.enum';
import { Injectable } from '@nestjs/common';
import { BaseRequestService } from '../common/service/base-request.service';



@Injectable()
@WebSocketGateway({ cors: true })
export class MessageGateway extends BaseRequestService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(
    private messageService: MessageService
  ) {
    super();
  }
  async handleDisconnect(client: any) {
  }

  async handleConnection(client: any, ...args: any[]) {
  }

  @SubscribeMessage('messages')
  async listenForMessages(@MessageBody() message: string, @ConnectedSocket() client: Socket) {
    // message : {"type":"MESSAGE","body":"hi!","from":"user1","roomId":"test"}
    const payload = plainToClass(SocketMessagePayload, message);
    switch (payload.type) {
      case MessageType.MESSAGE:
        const createMessagePayload = new CreateMessageRequestDto();
        createMessagePayload.from = payload.from;
        createMessagePayload.roomId = payload.roomId;
        createMessagePayload.message = payload.body;
        const created = await this.messageService.create(createMessagePayload);

        this.server.sockets.emit("RECEIVED_MESSAGE", created);
        break;
      default:
        console.log(`No sources available. with payload type: ${payload.type}`);
        break;
    }
  }
}