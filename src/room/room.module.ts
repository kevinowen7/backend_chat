import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestContextModule } from 'nestjs-request-context';
import { Room, RoomSchema } from './schemas/room.schema';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  controllers: [RoomController],
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
    ]),
    HttpModule,
    ConfigModule,
    RequestContextModule,
  ],
  providers: [
    RoomService,
  ],
  exports: [RoomService]
})
export class RoomModule { }
