import { axiosInstance } from "../../../app/apiClient";
import type { MessageReadRequest, MessageRequest, MessageResponse, PageResponse } from "../types/MessageTypes";

export const sendMessage = async (request: MessageRequest): Promise<number> => {
  const response = await axiosInstance.post("/api/messages", request);
  return response.data;
};

export const getSentMessages = async (page = 0, size = 10): Promise<PageResponse<MessageResponse>> => {
  const response = await axiosInstance.get(`/api/messages/sent`, {
    params: { page, size, sort: "sentAt,desc" },
  });
  return response.data;
};

export const getReceivedMessages = async (page = 0, size = 10): Promise<PageResponse<MessageResponse>> => {
  const response = await axiosInstance.get(`/api/messages/received`, {
    params: { page, size, sort: "sentAt,desc" },
  });
  return response.data;
};

export const readMessages = async (request: MessageReadRequest): Promise<void> => {
  await axiosInstance.patch("/api/messages/read", request);
};

export const deleteMessage = async (messageId: number): Promise<void> => {
  await axiosInstance.delete(`/api/messages/${messageId}`);
};
