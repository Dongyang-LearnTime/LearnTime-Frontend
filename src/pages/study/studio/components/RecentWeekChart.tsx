import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import type { StudyRecentWeekInfoResponse } from "../../types/StudyTypes";

interface RecentWeekChartProps {
  data: StudyRecentWeekInfoResponse[];
}

type MetricType = "focusTime" | "understandingScore";

// 시간 문자열(HH:mm:ss)을 분 단위의 실수 값으로 변환하는 헬퍼 함수
const parseTimeToMinutes = (timeStr: string | null): number => {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  if (parts.length !== 3) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const seconds = parseInt(parts[2], 10) || 0;
  return hours * 60 + minutes + Math.round(seconds / 60);
};

// 그래프 선에 할당할 색상 목록
const COLORS = [
  "#2563eb", // blue-600
  "#16a34a", // green-600
  "#ea580c", // orange-600
  "#db2777", // pink-600
  "#7c3aed", // violet-600
  "#0891b2", // cyan-600
  "#eab308", // yellow-500
];

export default function RecentWeekChart({ data }: RecentWeekChartProps) {
  // 조회할 지표 상태 관리 (기본값: 집중 시간)
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("focusTime");

  // 전체 멤버 정보 추출
  const memberInfos = useMemo(() => {
    return data.map((item) => ({
      id: item.studyMemberId,
      name: item.name,
    }));
  }, [data]);

  // 선택된 멤버들의 목록(ID) 상태 관리 (기본값: 전체 멤버 선택)
  const [selectedMembers, setSelectedMembers] = useState<number[]>(memberInfos.map((m) => m.id));

  // 멤버 체크박스 선택/해제 핸들러
  const handleMemberToggle = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Recharts용 단일 데이터 소스로 피벗(Pivot) 가공
  // 데이터 구조 변환: [ { planDate: "2026-05-21", member_1: 90, member_2: 60, rest_1: 0, emptyValue: 0 }, ... ]
  const chartData = useMemo(() => {
    const dateMap = new Map<string, { [key: string]: number | string | null }>();

    data.forEach((memberData) => {
      const memberKey = `member_${memberData.studyMemberId}`;
      const restKey = `rest_${memberData.studyMemberId}`;

      memberData.recentWeekInfos.forEach((info) => {
        const { planDate, focusTime, understandingScore, isRestDay } = info;
        
        // 해당 날짜의 객체가 없으면 새로 생성
        if (!dateMap.has(planDate)) {
          dateMap.set(planDate, { planDate });
        }
        
        const dayObj = dateMap.get(planDate)!;
        
        // 휴식일 정보 수집 (0: 활동일, 1: 휴식일)
        dayObj[restKey] = isRestDay ? 1 : 0;
        
        // 지표 종류에 따라 값 대입 (데이터가 없을 경우 null 유지)
        if (selectedMetric === "focusTime") {
          dayObj[memberKey] = focusTime ? parseTimeToMinutes(focusTime) : null;
        } else {
          dayObj[memberKey] = understandingScore;
        }
      });
    });

    // 날짜 오름차순 정렬하여 배열로 변환 및 음영 필드 계산
    return Array.from(dateMap.values())
      .sort((a, b) => {
        return new Date(a.planDate as string).getTime() - new Date(b.planDate as string).getTime();
      })
      .map((dayObj) => {
        // 선택된 멤버들 중 한 명이라도 휴식일이 있거나, 
        // 선택된 모든 멤버들의 데이터 값이 null 인지 판별
        const isAllNull = selectedMembers.every((memberId) => {
          const val = dayObj[`member_${memberId}`];
          return val === null || val === undefined;
        });

        const hasRestDay = selectedMembers.some((memberId) => {
          return dayObj[`rest_${memberId}`] === 1;
        });

        // 음영 플래그 (1이면 100% 영역 칠해짐, 0이면 칠해지지 않음)
        const isEmpty = isAllNull || hasRestDay;

        return {
          ...dayObj,
          emptyValue: isEmpty ? 1 : 0,
        };
      });
  }, [data, selectedMetric, selectedMembers]);

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
      <h3>일주일 간 지표 그래프</h3>

      {/* 지표 선택 영역 (디자인 최소화) */}
      <div style={{ marginBottom: "16px" }}>
        <span style={{ marginRight: "12px", fontWeight: "bold" }}>조회 지표:</span>
        <label style={{ marginRight: "12px" }}>
          <input
            type="radio"
            name="metric"
            value="focusTime"
            checked={selectedMetric === "focusTime"}
            onChange={() => setSelectedMetric("focusTime")}
          />
          집중 시간 (분)
        </label>
        <label>
          <input
            type="radio"
            name="metric"
            value="understandingScore"
            checked={selectedMetric === "understandingScore"}
            onChange={() => setSelectedMetric("understandingScore")}
          />
          이해도 점수
        </label>
      </div>

      {/* 멤버 선택 영역 */}
      <div style={{ marginBottom: "16px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
        <span style={{ fontWeight: "bold" }}>스터디 멤버 필터:</span>
        {memberInfos.map((member) => (
          <label key={member.id} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <input
              type="checkbox"
              checked={selectedMembers.includes(member.id)}
              onChange={() => handleMemberToggle(member.id)}
            />
            {member.name}
          </label>
        ))}
      </div>

      {/* Recharts 그래프 렌더링 */}
      <div style={{ width: "100%", height: 350 }}>
        {selectedMembers.length === 0 ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            선택된 스터디 멤버가 없습니다.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="planDate" />
              {/* 메인 데이터 Y축 */}
              <YAxis
                label={{
                  value: selectedMetric === "focusTime" ? "집중 시간 (분)" : "이해도 점수",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" }
                }}
              />
              {/* 음영 처리를 위한 가상 Y축 */}
              <YAxis yAxisId="empty" hide domain={[0, 1]} />
              
              <Tooltip />
              <Legend />

              {/* 배경 음영 처리를 위해 라인 뒤에 바 차트를 배치 */}
              <Bar
                yAxisId="empty"
                dataKey="emptyValue"
                fill="#e5e7eb" // gray-200
                opacity={0.5}
                isAnimationActive={false}
                legendType="none"
                tooltipType="none"
              />

              {selectedMembers.map((memberId, index) => {
                const color = COLORS[index % COLORS.length];
                const member = memberInfos.find((m) => m.id === memberId);
                return (
                  <Line
                    key={memberId}
                    type="monotone"
                    dataKey={`member_${memberId}`}
                    name={member ? member.name : `멤버 ${memberId}`}
                    stroke={color}
                    activeDot={{ r: 8 }}
                    connectNulls={false} // 데이터가 없는 지점은 선을 끊음
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
