import { dayMap } from "./CreateStudy";
import type { StudyForm } from "./CreateStudy";

interface StudyBaseInfoFormProps {
    studyForm: StudyForm;
    setStudyForm: React.Dispatch<React.SetStateAction<StudyForm>>;

    tempRestDate: string;
    setTempRestDate: React.Dispatch<React.SetStateAction<string>>;

    studyDays: number;
}

export default function StudyBaseInfoForm({
    studyForm,
    setStudyForm,
    tempRestDate,
    setTempRestDate,
    studyDays
}: StudyBaseInfoFormProps) {

    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜

    // =========================
    // 입력 변경
    // =========================
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setStudyForm(prev => {
            const next = { ...prev, [name]: value };

            // 종료일 < 시작일 방지
            if (name === "endDate" && next.startDate && value < next.startDate) {
                alert("종료일은 시작일보다 이전일 수 없습니다.");
                return prev;
            }

            // 시작일 변경 시 종료일 자동 보정
            if (name === "startDate" && next.endDate && next.endDate < value) {
                next.endDate = value;
            }

            return next;
        });
    };

    // =========================
    // 쉬는 요일 토글
    // =========================
    const handleRestDayToggle = (day: string) => {
        setStudyForm(prev => ({
            ...prev,
            restDays: prev.restDays.includes(day)
                ? prev.restDays.filter(d => d !== day)
                : [...prev.restDays, day]
        }));
    };

    // =========================
    // 쉬는 날짜 추가
    // =========================
    const handleAddRestDate = () => {
        if (!tempRestDate || studyForm.restDates.includes(tempRestDate)) return;

        setStudyForm(prev => ({
            ...prev,
            restDates: [...prev.restDates, tempRestDate]
        }));

        setTempRestDate('');
    };

    // =========================
    // UI
    // =========================
    return (
        <form>
            <h2>1. 스터디 기본 정보 입력</h2>

            <div>
                <label>책 제목 : </label>
                <input
                    type="text"
                    name="bookTitle"
                    required
                    maxLength={150}
                    value={studyForm.bookTitle}
                    onChange={handleFormChange}
                />
            </div>

            <div>
                <label>진도 제목 : </label>
                <input
                    type="text"
                    name="studyTitle"
                    required
                    maxLength={100}
                    value={studyForm.studyTitle}
                    onChange={handleFormChange}
                />
            </div>

            <div>
                <label>시작 날짜 : </label>
                <input
                    type="date"
                    name="startDate"
                    required
                    min={today}
                    value={studyForm.startDate}
                    onChange={handleFormChange}
                />
            </div>

            <div>
                <label>종료 날짜 : </label>
                <input
                    type="date"
                    name="endDate"
                    required
                    min={studyForm.startDate || today}
                    value={studyForm.endDate}
                    onChange={handleFormChange}
                />
            </div>

            <br />

            <div>
                <label>쉬는 요일: </label>
                {Object.keys(dayMap).map(day => (
                    <label key={day}>
                        <input
                            type="checkbox"
                            checked={studyForm.restDays.includes(day)}
                            onChange={() => handleRestDayToggle(day)}
                        />
                        {day.substring(0, 3)}
                    </label>
                ))}
            </div>

            <div>
                <label>쉬는 날짜: </label>

                <input
                    type="date"
                    value={tempRestDate}
                    min={today}
                    onChange={(e) => setTempRestDate(e.target.value)}
                />

                <button type="button" onClick={handleAddRestDate}>
                    추가
                </button>

                <ul>
                    {studyForm.restDates.map(date => (
                        <li key={date}>
                            {date}
                            <button
                                type="button"
                                onClick={() =>
                                    setStudyForm(prev => ({
                                        ...prev,
                                        restDates: prev.restDates.filter(d => d !== date)
                                    }))
                                }
                            >
                                삭제
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <p>
                실제 진행일: {studyDays}일
                {studyDays > 0 && (studyDays < 14 || studyDays > 90) && (
                    <span style={{ color: 'red', marginLeft: '8px' }}>
                        (14~90일 범위여야 합니다)
                    </span>
                )}
            </p>

            <button type="submit">
                생성
            </button>
        </form>
    );
}