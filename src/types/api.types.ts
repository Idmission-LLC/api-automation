export interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: { [key: string]: string };
  time: number;
}
