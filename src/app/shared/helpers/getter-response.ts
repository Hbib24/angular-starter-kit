export interface PaginatedResponse {
  count: number;
  data: { [key: string]: any }[];
}

export type GetterResponse = Promise<PaginatedResponse> | PaginatedResponse;

export type Getter = (params?: any) => GetterResponse;
