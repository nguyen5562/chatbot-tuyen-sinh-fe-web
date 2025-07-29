import type { Message } from "./message";

export interface Chat {
  id: string;
  title: string;
  userId?: string;
}

export interface ChatDTO extends Chat {
  messages: Message[];
}
