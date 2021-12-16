import { PaginationInput } from '../dto/pagination.input';
import { PaginationInfo } from '../interfaces/Pagination-info.interface';

export const getPaginationInfo = (
  paginationInput: PaginationInput,
): PaginationInfo =>
  Object.assign({
    skip: (paginationInput.page - 1) * paginationInput.perPage,
    take: paginationInput.perPage,
  });
