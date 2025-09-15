export interface PaginatedResponse {
  status?: number;
  count: number;
  data: any[];
}

export type GetterResponse = Promise<PaginatedResponse> | PaginatedResponse;

export type Getter = (params?: any) => GetterResponse;

export const defaultGetter: Getter = () => ({ count: 0, data: [] });
