import {
  Injectable, NotFoundException,
} from '@nestjs/common';
import { BaseRequestService } from '../common/service/base-request.service';
import { Message, MessageDocument } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { CreateMessageRequestDto } from './dto/request/create-message-request.dto';
import { Room, RoomDocument } from '../room/schemas/room.schema';

@Injectable()
export class MessageService extends BaseRequestService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,

    @InjectModel(Room.name)
    private roomModel: Model<RoomDocument>,
  ) {
    super();
  }

  async create(createMessageRequestDto: CreateMessageRequestDto): Promise<Message> {
    let { message, roomId, from } = createMessageRequestDto

    const existRoom = await this.roomModel.findOne({ _id: roomId });
    if (!existRoom) new NotFoundException('Room not found');

    const newMessage = new this.messageModel();
    newMessage.message = message;
    newMessage.roomId = roomId;
    newMessage.from = from;
    const createdMessage = await newMessage.save();

    await this.roomModel.findByIdAndUpdate(roomId, { lastMessage: newMessage.message })

    return createdMessage;
  }

  async getMessageByRoomId(roomId: string): Promise<Message[]> {
    const messages = await this.findByAttribute({ roomId });
    return messages;
  }


  async findByAttribute(
    findOptions: FilterQuery<Message>,
    options?: QueryOptions,
    relations?: [string],
  ): Promise<Message[]> {
    return await this.messageModel.find(findOptions, options).sort({ updatedAt: -1 }).populate(relations);
  }

  async findOneByAttribute(
    findOptions: FilterQuery<Message>,
    options?: QueryOptions,
    relations?: [string],
  ): Promise<Message> {
    const message = await this.messageModel.findOne(findOptions, options).populate(relations);
    if (!message) new NotFoundException('Message not found');

    return message;
  }
}
