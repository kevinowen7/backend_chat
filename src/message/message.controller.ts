import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { StatusCodes } from 'http-status-codes/build/cjs';
import { ConfigService } from '@nestjs/config';
import { MessageService } from './message.service';
import { CreateMessageRequestDto } from './dto/request/create-message-request.dto';
import { Message } from './schemas/message.schema';

@Controller('message')
@ApiTags('message')
export class MessageController {
  constructor(
    private configService: ConfigService,
    private messageService: MessageService,
  ) { }

  @Get('/')
  @HttpCode(StatusCodes.OK)
  async getMessages(@Query('roomId') roomdId: string): Promise<BaseResponseDto<Message[]>> {
    const result = await this.messageService.getMessageByRoomId(roomdId);
    return BaseResponseDto.successResponse(result, 'Get Messages Success.');
  }
}
