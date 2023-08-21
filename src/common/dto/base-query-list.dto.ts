export class BaseQueryListDto<T> {
  items: T[];

  constructor(partial: Partial<BaseQueryListDto<T>>) {
    Object.assign(this, partial);
  }
}
