import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import type { StudyRecentWeekInfoResponse } from "../../types/studyTypes";
import { Card } from "../../../../components/common/Card";

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

// 트렌디한 네온/파스텔 색상 조합
const COLORS = [
  "#6366f1", // Indigo 500
  "#ec4899", // Pink 500
  "#14b8a6", // Teal 500
  "#f59e0b", // Amber 500
  "#8b5cf6", // Violet 500
  "#0ea5e9", // Sky 500
  "#10b981", // Emerald 500
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
        
        // 지표 종류에 따라 값 대입 (데이터가 없거나 null일 경우 0으로 강제 보정)
        if (selectedMetric === "focusTime") {
          dayObj[memberKey] = focusTime ? parseTimeToMinutes(focusTime) : 0;
        } else {
          dayObj[memberKey] = (understandingScore !== null && understandingScore !== undefined) ? understandingScore : 0;
        }
      });
    });

    // 날짜 오름차순 정렬하여 배열로 변환 및 음영 필드 계산
    return Array.from(dateMap.values())
      .sort((a, b) => {
        return new Date(a.planDate as string).getTime() - new Date(b.planDate as string).getTime();
      })
      .map((dayObj) => {
        // 선택된 모든 멤버 키에 대해 null이거나 undefined이면 0으로 치환합니다.
        selectedMembers.forEach((memberId) => {
          const key = `member_${memberId}`;
          if (dayObj[key] === null || dayObj[key] === undefined) {
            dayObj[key] = 0;
          }
        });

        // 선택된 멤버들 중 한 명이라도 휴식일이 있거나, 
        // 선택된 모든 멤버들의 데이터 값이 0인지 판별 (이전에는 null이었던 판별)
        const isAllZero = selectedMembers.every((memberId) => {
          const val = dayObj[`member_${memberId}`];
          return val === 0 || val === null || val === undefined;
        });

        const hasRestDay = selectedMembers.some((memberId) => {
          return dayObj[`rest_${memberId}`] === 1;
        });

        // 음영 플래그 (1이면 100% 영역 칠해짐, 0이면 칠해지지 않음)
        const isEmpty = isAllZero || hasRestDay;

        return {
          ...dayObj,
          emptyValue: isEmpty ? 1 : 0,
        };
      });
  }, [data, selectedMetric, selectedMembers]);

  return (
    <Card className="h-full border-0 shadow-none bg-white dark:bg-[#050505] rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">주간 몰입도</h3>
          <p className="text-xs font-medium text-gray-500">최근 7일간의 학습 성과를 비교 분석합니다.</p>
        </div>

        {/* 지표 선택 버튼 그룹 */}
        <div className="flex items-center bg-gray-100 dark:bg-[#111] p-1 rounded-xl w-fit">
          <button
            onClick={() => setSelectedMetric("focusTime")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedMetric === "focusTime"
                ? "bg-white dark:bg-[#222] text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            집중 시간
          </button>
          <button
            onClick={() => setSelectedMetric("understandingScore")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedMetric === "understandingScore"
                ? "bg-white dark:bg-[#222] text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            이해도 점수
          </button>
        </div>
      </div>

      {/* 멤버 필터 (모던 토글 뱃지) */}
      <div className="mb-6 flex flex-wrap items-center gap-2 relative z-10">
        <span className="text-xs font-black text-gray-400 mr-2 uppercase tracking-widest">멤버 필터</span>
        {memberInfos.map((member, idx) => {
          const isSelected = selectedMembers.includes(member.id);
          const color = COLORS[idx % COLORS.length];
          return (
            <button
              key={member.id}
              onClick={() => handleMemberToggle(member.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isSelected 
                  ? "bg-white dark:bg-[#111] text-gray-900 dark:text-white shadow-sm"
                  : "bg-transparent border-transparent text-gray-400 hover:bg-gray-50 dark:hover:bg-[#111]"
              }`}
              style={isSelected ? { borderColor: color } : {}}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isSelected ? color : '#9ca3af' }}></span>
                {member.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Recharts 그래프 렌더링 */}
      <div className="w-full h-[320px] relative z-10">
        {selectedMembers.length === 0 ? (
          <div className="flex justify-center items-center h-full text-sm font-bold text-gray-400 bg-gray-50 dark:bg-[#0a0a0a] rounded-3xl">
            선택된 스터디 멤버가 없습니다.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-[#1f1f1f]" />
              <XAxis 
                dataKey="planDate" 
                stroke="#9ca3af" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return `${d.getMonth()+1}/${d.getDate()}`;
                }}
              />
              {/* 메인 데이터 Y축 */}
              <YAxis
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '12px' }}
                itemStyle={{ color: '#fff', paddingTop: '4px' }}
                labelStyle={{ color: '#9ca3af', marginBottom: '8px' }}
                cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              
              <Legend 
                wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '20px' }} 
                iconType="circle"
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
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                    connectNulls={false}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
