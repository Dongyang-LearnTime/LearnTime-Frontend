import { axiosInstance } from "../../../app/apiClient";

export interface StudyNoteData {
  studyId: string | undefined;
  title: string;
  content: string;
}

export interface StudyNoteDetail {
  studyNotesId: number;
  studyId: number;
  studyMemberId : number;
  title: string;
  content: string; // Tiptap HTML content
  createdAt: string;
  updatedAt: string;
}

export const getStudyNoteDetailApi = async (noteId: string): Promise<StudyNoteDetail> => {
  const response = await axiosInstance.get<StudyNoteDetail>(
    `/api/study/notes/${noteId}`
  );

  return response.data;
};


export const submitStudyNotesApi = async (dataToSave: StudyNoteData): Promise<number> => {
  const response = await axiosInstance.post<number>(
    "/api/study/notes",
    dataToSave
  );
  return response.data;
};

export const updateStudyNoteApi = async (noteId: string, data: {title: string, content: string}): Promise<void> => {
  await axiosInstance.put(
    `/api/study/notes/${noteId}`, 
    {
      title : data.title,
      content : data.content
    }
  );
};

export const deleteStudyNoteApi = async (noteId: string): Promise<void> => {
  await axiosInstance.delete(
    `/api/study/notes/${noteId}`
  );
};

/** 특정 스터디의 필기 목록 조회 */
export interface StudyNoteListItem {
  studyNotesId: number;
  studyId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export const getStudyNoteListApi = async (studyId: string): Promise<StudyNoteListItem[]> => {
  const response = await axiosInstance.get<StudyNoteListItem[]>(
    `/api/study/notes?studyId=${studyId}`
  );
  return response.data;
};
