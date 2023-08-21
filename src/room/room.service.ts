import {
  ConflictException,
  Injectable, NotFoundException,
} from '@nestjs/common';
import { BaseRequestService } from '../common/service/base-request.service';
import { Room, RoomDocument } from './schemas/room.schema';
import { errorRoomAlreadyExist, errorRoomNotFound, errorYouAlreadyJoinRoom } from '../common/error-message';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { CreateRoomRequestDto } from './dto/request/create-room-request.dto';

@Injectable()
export class RoomService extends BaseRequestService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<RoomDocument>,
  ) {
    super();
  }

  async create(createRoomRequestDto: CreateRoomRequestDto): Promise<Room> {
    let { roomName, userName } = createRoomRequestDto
    const existRoom = await this.findOneByAttribute({ roomName });
    if (existRoom) throw new NotFoundException({
      data: null,
      success: false,
      message: errorRoomAlreadyExist,
    });

    const room = new this.roomModel();
    room.roomName = roomName;
    room.users = [userName];
    const createdRoom = await room.save();
    return createdRoom;
  }

  async joinRoom(createRoomRequestDto: CreateRoomRequestDto): Promise<Room> {
    let { roomName, userName } = createRoomRequestDto
    const existRoom = await this.findOneByAttribute({ roomName });
    if (!existRoom) throw new NotFoundException({
      data: null,
      success: false,
      message: errorRoomNotFound,
    });

    if (existRoom.users.findIndex(data => data === userName) != -1) throw new ConflictException({
      data: null,
      success: false,
      message: errorYouAlreadyJoinRoom,
    });

    existRoom.users.push(userName);
    await this.roomModel.findOneAndUpdate({ roomName }, { users: existRoom.users })

    return existRoom;
  }

  async getRoomByUsernames(username: string): Promise<Room[]> {
    const rooms = await this.findByAttribute({ users: username });
    return rooms;
  }


  async findByAttribute(
    findOptions: FilterQuery<Room>,
    options?: QueryOptions,
    relations?: [string],
  ): Promise<Room[]> {
    return await this.roomModel.find(findOptions, options).sort({ updatedAt: -1 }).populate(relations);
  }

  async findOneByAttribute(
    findOptions: FilterQuery<Room>,
    options?: QueryOptions,
    relations?: [string],
  ): Promise<Room> {
    const room = await this.roomModel.findOne(findOptions, options).populate(relations);
    if (!room) new NotFoundException('Outlet not found');

    return room;
  }
}
