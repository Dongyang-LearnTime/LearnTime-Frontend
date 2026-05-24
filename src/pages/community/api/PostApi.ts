import { axiosInstance } from "../../../app/apiClient";
import imageCompression from "browser-image-compression";

export interface PostCreateRequest {
  title: string;
  content: string;
  studyId?: number;
  isNotice: boolean;
}

export const createPostApi = async (request: PostCreateRequest, images: File[]): Promise<number> => {
    const FORM_DATA_NAME: string = "images";
    const formData = new FormData();

    formData.append(
        "request",
        new Blob([JSON.stringify(request)], { type: "application/json" })
    );

    // 이미지 압축 및 FormData 추가 
    if (images && images.length > 0) {
        const options = {
        maxSizeMB: 1, 
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        };

        for (const image of images) {
            const compressedImage = await imageCompression(image, options);
            formData.append(FORM_DATA_NAME, compressedImage);
        }
    }

    const response = await axiosInstance.post<number>("/api/community/post", formData);

    return response.data;
};
