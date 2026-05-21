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
