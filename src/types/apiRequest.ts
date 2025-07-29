export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  fullname: string;
  username: string;
  password: string;
}

export interface CreateChatRequest {
  title: string;
}

export interface CreateMessageRequest {
  content: string;
  role: string;
}
