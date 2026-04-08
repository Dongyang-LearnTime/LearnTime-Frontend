// UploadTestPage.tsx
import React, { useState } from "react";
import { axiosInstance } from "../app/apiClient";

export default function UploadTestPage() {
  // File 객체 (브라우저 Heap에 저장됨)
  const [file, setFile] = useState<File | null>(null);

  // 파일 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // 업로드 요청
  const handleUpload = async () => {
    if (!file) {
      alert("파일 선택하세요");
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // key는 반드시 "image"

    try {
      const response = await axiosInstance.post(
        "/api/study/extract",
        formData,
      );

      console.log("응답:", response.data);
      alert("성공");
    } catch (error: any) {
      console.error("에러:", error);
      alert("실패");
    }
  };

  return (
    <div>
      <h2>이미지 업로드 테스트</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button onClick={handleUpload}>업로드</button>
    </div>
  );
};
