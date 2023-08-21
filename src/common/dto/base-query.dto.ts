export class BaseQueryDto<T> {
  items: T;

  constructor(partial: Partial<BaseQueryDto<T>>) {
    Object.assign(this, partial);
  }
}
