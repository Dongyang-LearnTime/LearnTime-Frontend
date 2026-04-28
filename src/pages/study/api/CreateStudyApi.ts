import { axiosInstance } from "../../../app/apiClient";
import imageCompression from 'browser-image-compression';

// 응답 타입 (재사용 가능하게 export)
export interface BookToc {
  chapter: string;
  title: string;
  page: number | null;
}

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