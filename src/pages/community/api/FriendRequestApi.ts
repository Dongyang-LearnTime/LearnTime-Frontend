import { axiosInstance } from '../../../app/apiClient';

export type FriendRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface FriendRequestResponse {
  friendRequestId: number;
  requesterId: number;
  requesterName: string;
  receiverId: number;
  receiverName: string;
  status: FriendRequestStatus;
  createdAt: string;
}

// 친구 요청 전송
export const sendFriendRequestApi = async (receiverId: number): Promise<number> => {
  const response = await axiosInstance.post<number>(
    `/api/user/friends/requests/${receiverId}`
  );

  return response.data;
};

// 받은 친구 요청 목록 조회
export const getReceivedPendingRequestsApi = async (): Promise<FriendRequestResponse[]> => {
  const response = await axiosInstance.get<FriendRequestResponse[]>('/api/user/friends/requests/received');
  return response.data;
};

// 보낸 친구 요청 목록 조회
export const getSentPendingRequestsApi = async (): Promise<FriendRequestResponse[]> => {
  const response = await axiosInstance.get<FriendRequestResponse[]>('/api/user/friends/requests/sent');
  return response.data;
};

// 친구 요청 승인
export const acceptFriendRequestApi = async (friendRequestId: number): Promise<number> => {
  const response = await axiosInstance.patch<number>(`/api/user/friends/requests/${friendRequestId}/accept`);
  return response.data;
};

// 친구 요청 거절
export const rejectFriendRequestApi = async (friendRequestId: number): Promise<void> => {
  await axiosInstance.patch(`/api/user/friends/requests/${friendRequestId}/reject`);
};

// 친구 요청 취소
export const cancelFriendRequestApi = async (friendRequestId: number): Promise<void> => {
  await axiosInstance.patch(`/api/user/friends/requests/${friendRequestId}`);
};
