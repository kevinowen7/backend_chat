import {
  IsNotEmpty,
} from 'class-validator';

export class CreateRoomRequestDto {
  @IsNotEmpty()
  roomName: string;

  @IsNotEmpty()
  userName: string;
}
