import type { User } from "./user";

export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  status: string;
  data?: T;
}

export interface loginResponse {
  user: User;
  access_token: string;
}
