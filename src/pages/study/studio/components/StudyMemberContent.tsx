import { useState } from "react";

export interface StudyScheduleItem {
  id: number;
  content: string;
}

export default function StudyMemberContent() {
  // 로컬 상태로 일정 리스트 관리 (아직 서버 연동 안함)
  const [schedules, setSchedules] = useState<StudyScheduleItem[]>([]);
  // 입력창 텍스트 제어를 위한 상태
  const [inputValue, setInputValue] = useState<string>("");

  // 새로운 공부 일정 추가 핸들러
  const handleAddSchedule = () => {
    if (!inputValue.trim()) return;

    const newItem: StudyScheduleItem = {
      id: Date.now(), // 임시 고유 ID 생성
      content: inputValue.trim(),
    };

    setSchedules((prev) => [...prev, newItem]);
    setInputValue(""); // 입력창 초기화
  };

  // 엔터 키 누를 때 추가되도록 지원
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddSchedule();
    }
  };

  // 등록된 일정 삭제 핸들러
  const handleDeleteSchedule = (id: number) => {
    setSchedules((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
      <h3>공부 일정</h3>

      {/* 등록 입력창 영역 (디자인 최소화) */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="공부 일정을 입력하세요"
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleAddSchedule}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          등록
        </button>
      </div>

      {/* 일정 목록 테이블/리스트 표시 */}
      {schedules.length === 0 ? (
        <div style={{ color: "#666", fontStyle: "italic", textAlign: "center", padding: "12px 0" }}>
          등록된 공부 일정이 없습니다.
        </div>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          {schedules.map((item) => (
            <li
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>{item.content}</span>
              <button
                onClick={() => handleDeleteSchedule(item.id)}
                style={{
                  padding: "4px 8px",
                  cursor: "pointer",
                  backgroundColor: "#fee2e2", // light red
                  color: "#991b1b", // dark red
                  border: "1px solid #fca5a5",
                  borderRadius: "4px",
                }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
