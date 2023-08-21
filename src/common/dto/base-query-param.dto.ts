export class BaseQueryParamDto {
  page: number;
  size: number;
  sort: SortQueryDto[];
  filter: FilterQueryDto[];
  skipRecord = () => {
    return Math.max((this.page - 1) * this.size, 0);
  };
}

export class SortQueryDto {
  field: string;
  direction: string;
}

export class FilterQueryDto {
  field: string;
  query: string;
}
