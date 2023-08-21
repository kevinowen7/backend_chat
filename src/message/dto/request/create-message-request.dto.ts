import {
  IsNotEmpty,
} from 'class-validator';
import { MessageType } from '../../enum/message-type.enum';

export class CreateMessageRequestDto {
  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  from: string;
}


export class SocketMessagePayload {
  type?: MessageType;
  body?: string;
  from?: string;
  roomId?: string;
}
