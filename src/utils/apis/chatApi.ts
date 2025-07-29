import type { ApiResponse } from "../../types/apiResponse";
import type { Chat, ChatDTO } from "../../types/chat";
import type {
  CreateChatRequest,
  CreateMessageRequest,
} from "../../types/apiRequest";
import { createApiInstance } from "../requestApi";
import type { Message } from "../../types/message";

const chatApiBaseURL = import.meta.env.VITE_API_BE_URL;
const api = createApiInstance(chatApiBaseURL);

const createChat = async (
  userId: string,
  chat: CreateChatRequest
): Promise<ApiResponse<Chat>> => {
  return api.makeRequest<ApiResponse<Chat>>({
    url: `/chat/${userId}`,
    method: "POST",
    data: chat,
  });
};

const getChatByUser = async (
  userId: string
): Promise<ApiResponse<ChatDTO[]>> => {
  return api.makeRequest<ApiResponse<ChatDTO[]>>({
    url: `/chat/get-chats-by-user/${userId}`,
    method: "GET",
  });
};

const getChatById = async (chatId: string): Promise<ApiResponse<ChatDTO>> => {
  return api.makeRequest<ApiResponse<ChatDTO>>({
    url: `/chat/${chatId}`,
    method: "GET",
  });
};

const sendMessage = async (
  chatId: string,
  message: CreateMessageRequest
): Promise<ApiResponse<Message>> => {
  return api.makeRequest<ApiResponse<Message>>({
    url: `/chat/send-message/${chatId}`,
    method: "POST",
    data: message,
  });
};

export const chatApi = { createChat, getChatByUser, getChatById, sendMessage };
