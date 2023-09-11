import {
  ConflictException,
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
    const censoredMessages = ["hamburger", "ramen", "hotdog", "badWord123"];

    let { message, roomId, from } = createMessageRequestDto

    const existRoom = await this.roomModel.findOne({ _id: roomId });
    if (!existRoom) new NotFoundException('Room not found');

    const newMessage = new this.messageModel();
    newMessage.message = message;

    let numberOfCensoredMessage = 0;
    for (const censoredMessage of censoredMessages) {
      let censoredData = "";
      for (var i = 0; i < censoredMessage.length; i++) { censoredData += "*" }

      if (newMessage.message.split(censoredMessage).length > 1) {
        numberOfCensoredMessage += newMessage.message.split(censoredMessage).length - 1
      }

      newMessage.message = newMessage.message.replace(new RegExp(censoredMessage, 'g'), censoredData);
    }

    if (numberOfCensoredMessage >= 3) {
      return null
    }

    newMessage.roomId = roomId;
    newMessage.from = from;
    const createdMessage = await newMessage.save();

    await this.roomModel.findByIdAndUpdate(roomId, { lastMessage: newMessage.message })

    return createdMessage;
  }

  async delete(messasgeId: string): Promise<Message> {

    const message = await this.messageModel.findOne({ _id: messasgeId });
    if (!message) new NotFoundException('Message not found');

    const deletedMessage = await message.delete();

    return deletedMessage;
  }

  async updateUsername(fromUsername: string, toUsername: string): Promise<any> {
    const existUsername = await this.messageModel.findOne({ from: toUsername });
    if (existUsername) return { success: 0, message: "Username already taken" };

    await this.messageModel.updateMany({ from: fromUsername }, { from: toUsername });

    return { success: 1, message: "Success" };
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
