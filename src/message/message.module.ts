import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestContextModule } from 'nestjs-request-context';
import { Message, MessageSchema } from './schemas/message.schema';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageGateway } from './message.gateway';
import { Room, RoomSchema } from '../room/schemas/room.schema';
@Module({
  controllers: [MessageController],
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
    HttpModule,
    ConfigModule,
    RequestContextModule,
  ],
  providers: [
    MessageService,
    MessageGateway
  ],
  exports: [MessageService, MessageGateway]
})
export class MessageModule { }
