import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty()
  data: unknown;

  @ApiProperty()
  message: string;

  @ApiProperty()
  success: boolean;
}
