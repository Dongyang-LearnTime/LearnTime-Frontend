import { axiosInstance } from "../../../app/apiClient";
import imageCompression from 'browser-image-compression';
import type { StudyForm, BookToc } from "../create/CreateStudyPage";

export type StudyGenerationStatus = 'PLANNING' | 'READY' | 'FAILED';

export interface StudyStatusResponse {
  studyId: number;
  status: StudyGenerationStatus;
  isPublic?: boolean;
}

export interface FriendResponse {
  friendId: number;
  userId: number;
  name: string;
  email: string;
  createdAt: string;
}

export const getFriendsApi = async (): Promise<FriendResponse[]> => {
  const response = await axiosInstance.get<FriendResponse[]>("/api/user/friends");
  return response.data;
};

export const extractTocApi = async (file: File): Promise<BookToc[]> => {
  const FORM_DATA_NAME: string = "image";

  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options); // 압축
  const formData = new FormData();
  formData.append(FORM_DATA_NAME, compressedFile);

  const response = await axiosInstance.post<BookToc[]>(
    "/api/study/extract",
    formData
  );

  return response.data;
};

export const createStudyPlanApi = async (
  studyForm: StudyForm,
  bookToc: BookToc[],
  studyMemberList: number[]
): Promise<number> => {                         // studyId 반환

  const response = await axiosInstance.post<number>(
    "/api/study/generate",
    {
      bookTitle: studyForm.bookTitle,
      studyTitle: studyForm.studyTitle,
      startDate: studyForm.startDate,
      endDate: studyForm.endDate,
      restDays: studyForm.restDays,
      restDates: studyForm.restDates,
      tocList: bookToc,
      studyMemberList: studyMemberList,
      isPublic: studyForm.isPublic
    }
  );

  return response.data; // studyId
};

export const getStudyStatusApi = async (studyId: number): Promise<StudyStatusResponse> => {
  const response = await axiosInstance.get<StudyStatusResponse>(
    `/api/study/${studyId}/status`
  );
  return response.data;
};

