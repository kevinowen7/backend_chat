import { MetaObject } from "../class/pagination.class";

export class BaseResponsePaginationDto<T> {
  data: T;
  metadata: MetaObject;
  message: string;
  success: boolean;
  constructor(partial: Partial<BaseResponsePaginationDto<T>>) {
    Object.assign(this, partial);
  }

  static successResponse<T>(data: T, metadata: MetaObject, message: string): BaseResponsePaginationDto<T> {
    return new BaseResponsePaginationDto({
      data: data,
      metadata,
      message,
      success: true,
    });
  }

  static errorResponse<T>(data: T, message: string): BaseResponsePaginationDto<T> {
    return new BaseResponsePaginationDto({
      data: null,
      message,
      success: false,
    });
  }
}
