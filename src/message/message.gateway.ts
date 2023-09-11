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

        if (!created) {
          this.server.sockets.emit("BANNED_USER", { from: payload.from, bannedTime: 5 });

          // TODO: ban user for 5 minutes
        }

        this.server.sockets.emit("RECEIVED_MESSAGE", created);
        break;
      case MessageType.DELETE:
        await this.messageService.delete(payload.body)

        this.server.sockets.emit("RENDER_ROOM", payload.body);
        break;
      case MessageType.CHANGE_USERNAME:
        const data = await this.messageService.updateUsername(payload.from, payload.body)

        if (data.success == 0) {
          this.server.sockets.emit("CHANGE_USERNAME_FAILED", {
            from: payload.from,
            to: payload.body
          });
        }

        this.server.sockets.emit("USERNAME_CHANGED", {
          from: payload.from,
          to: payload.body
        });
        break;
      default:
        console.log(`No sources available. with payload type: ${payload.type}`);
        break;
    }
  }
}