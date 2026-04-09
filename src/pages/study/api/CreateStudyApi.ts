import { axiosInstance } from "../../../app/apiClient";

// 응답 타입 (재사용 가능하게 export)
export interface BookToc {
  chapter: string;
  title: string;
  page: number | null;
}

export const extractTocApi = async (file: File): Promise<BookToc[]> => {
  const formData = new FormData();
  formData.append("image", file); // 반드시 이름 image로

  const response = await axiosInstance.post<BookToc[]>(
    "/api/study/extract",
    formData
  );

  return response.data;
};