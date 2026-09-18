import { axiosInstance } from '../../../app/apiClient';
import type { CursorResponse } from '../../../types/PaginationType';
import type { StudyArchiveResponse } from './studyApi';
import type { StudyForumMessage } from '../types/StudyForumTypes';

const config = (signal: AbortSignal) => ({ signal, timeout: 15_000, handleForbiddenLocally: true });
const messagesPath = (studyId: number) => `/api/study/${studyId}/forum/messages`;

export async function getForumMembership(studyId: number, signal: AbortSignal) {
  const { data } = await axiosInstance.get<StudyArchiveResponse[]>('/api/study/archive', config(signal));
  return data.find(study => study.studyId === studyId) ?? null;
}

export async function getForumMessages(studyId: number, signal: AbortSignal, beforeId?: number) {
  const { data } = await axiosInstance.get<CursorResponse<StudyForumMessage>>(messagesPath(studyId), {
    ...config(signal), params: { beforeId, size: 30 },
  });
  return data;
}

export async function createForumMessage(studyId: number, content: string, signal: AbortSignal) {
  const { data } = await axiosInstance.post<StudyForumMessage>(messagesPath(studyId), { content }, config(signal));
  return data;
}

export async function deleteForumMessage(studyId: number, messageId: number, signal: AbortSignal) {
  await axiosInstance.delete(`${messagesPath(studyId)}/${messageId}`, config(signal));
}
