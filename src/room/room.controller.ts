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
import { BaseResponsePaginationDto } from '../common/dto/base-response-pagination.dto';
import { RoomService } from './room.service';
import { CreateRoomRequestDto } from './dto/request/create-room-request.dto';
import { Room } from './schemas/room.schema';

@Controller('room')
@ApiTags('room')
export class RoomController {
  constructor(
    private configService: ConfigService,
    private roomService: RoomService,
  ) { }

  @Post('/')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createRoomRequestDto: CreateRoomRequestDto): Promise<BaseResponseDto<Room>> {
    const result = await this.roomService.create(createRoomRequestDto);
    return BaseResponseDto.successResponse(result, 'Create Room success.');
  }

  @Post('/join')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async join(@Body() createRoomRequestDto: CreateRoomRequestDto): Promise<BaseResponseDto<Room>> {
    const result = await this.roomService.joinRoom(createRoomRequestDto);
    return BaseResponseDto.successResponse(result, 'Join Room success.');
  }

  @Get('/')
  @HttpCode(StatusCodes.OK)
  async getRooms(@Query('username') username: string): Promise<BaseResponseDto<Room[]>> {
    const result = await this.roomService.getRoomByUsernames(username);
    return BaseResponseDto.successResponse(result, 'Get Rooms Success.');
  }
}
