export interface PaginatedResponse<T = any> {
  status?: number;
  count: number;
  data: T[];
}

export type GetterResponse<T = any> =
  | Promise<PaginatedResponse<T>>
  | PaginatedResponse<T>;

export type Getter<T = any> = (params?: any) => GetterResponse<T>;

export const defaultGetter: Getter<any> = () => ({ count: 0, data: [] });
