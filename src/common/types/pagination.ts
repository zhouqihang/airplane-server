import { PaginationDto } from '../dtos/pagination.dto';

export class Pagination {
  page = 1;
  pageSize = 10;
  total = 0;
  list = [];

  constructor(plist = [], total = 0, dto: PaginationDto) {
    this.list = plist;
    this.total = total;
    this.page = dto.page;
    this.pageSize = dto.pageSize;
  }
}
