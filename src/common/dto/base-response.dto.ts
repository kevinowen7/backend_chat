export class BaseResponseDto<T> {
  data: T;
  message: string;
  success: boolean;
  constructor(partial: Partial<BaseResponseDto<T>>) {
    Object.assign(this, partial);
  }

  static successResponse<T>(data: T, message: string): BaseResponseDto<T> {
    return new BaseResponseDto({
      data: data,
      message,
      success: true,
    });
  }

  static errorResponse<T>(data: T, message: string): BaseResponseDto<T> {
    return new BaseResponseDto({
      data: null,
      message,
      success: false,
    });
  }
}
