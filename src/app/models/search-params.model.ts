export interface SearchParams {
  query?: string;
  search?: string;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
