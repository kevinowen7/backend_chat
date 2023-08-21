import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { APIResponse } from './interface/common.interface';
import { OptionSort } from './class/option-sort.class';

export const errorResponse = (message = 'internal server error', statusCode = 500): APIResponse => {
  throw new HttpException(
    {
      data: null,
      success: false,
      message: message,
    },
    statusCode,
  );
};

export const httpExceptionHandler = exception => {
  if (exception.response) {
    const data = exception.response.data;
    const status = exception.response.status;

    if (status === 401) {
      throw new UnauthorizedException(data.message);
    } else if (status === 400) {
      throw new BadRequestException(data.message);
    } else if (status === 404) {
      throw new NotFoundException(data.message);
    } else if (status === 500) {
      throw new InternalServerErrorException(data.message);
    }
  }

  throw new InternalServerErrorException(exception.message);
};

export const successResponse = (data = {}, message = 'success'): APIResponse => {
  const response: {
    data?: Record<string, unknown> | null;
    message: string;
    success: boolean;
  } = {
    data,
    message: message,
    success: true,
  };

  return response;
};
export const getOptionSort = (sort?: string) => {
  const optionSort = new OptionSort();

  optionSort.key = "createdAt"
  optionSort.value = "DESC"

  if (sort) {
    optionSort.key = sort?.split(" ")?.[0];
    optionSort.value = sort?.split(" ")?.[1].toUpperCase();
  }

  return optionSort
};