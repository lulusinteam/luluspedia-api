import { PaginationResponseDto } from './dto/pagination-response.dto';

export const pagination = <T>(
  data: [T[], number],
  options: { page: number; limit: number },
): PaginationResponseDto<T> => {
  const [items, total] = data;
  const totalPages = Math.ceil(total / options.limit);
  return {
    data: items,
    total,
    totalPages,
    page: options.page,
    limit: options.limit,
    hasNextPage: options.page < totalPages,
  };
};
