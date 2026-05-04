import { axiosInstance } from "../../../app/apiClient";

export interface StudyNoteData {
  studyId: string | undefined;
  title: string;
  content: string;
}

export const submitStudyNotesApi = async (dataToSave: StudyNoteData) : Promise<void> => {

  await axiosInstance.post(
    "/api/study/notes",
    dataToSave
  );

} 