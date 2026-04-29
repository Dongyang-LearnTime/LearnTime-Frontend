import { axiosInstance } from "../../../app/apiClient";
import imageCompression from 'browser-image-compression';
import type { StudyForm, BookToc } from "../create/CreateStudy";

export const extractTocApi = async (file: File): Promise<BookToc[]> => {
  const FORM_DATA_NAME : string = "image";

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

export const createStudyPlanApi = async (studyForm : StudyForm, bookToc : BookToc[]) : Promise<void> => {

  await axiosInstance.post(
    "/api/study/generate",
    {
      bookTitle : studyForm.bookTitle,
      studyTitle : studyForm.studyTitle,
      startDate : studyForm.startDate,
      endDate : studyForm.endDate,
      restDays : studyForm.restDays,
      restDates : studyForm.restDates,
      tocList : bookToc
    }
  );

}
