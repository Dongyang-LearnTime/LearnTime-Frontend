// ============================================================
// pages/schedule/SchedulePage.tsx
// 일정 생성 및 루틴 관리 페이지 (달력 메모 기능 추가 버전).
// ============================================================
import { useState, useMemo } from 'react';
import {
  ScheduleHeader,
  AiInsightsBox,
  TodayScheduleBox,
  RoutineScheduleBox,
  MajorScheduleBox,
  CalendarBox,
  DayDetailModal,
  ScheduleModal,
} from '../components/section/schedule';
import type { Schedule } from '../components/section/schedule';

export function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: '1', title: '아침 요가', date: '2026-05-07', startTime: '07:00', endTime: '08:00', type: 'routine', completed: true, repeatDays: [1, 2, 3, 4, 5], isFavorite: true },
    { id: '2', title: '알고리즘 문제 풀이', date: '2026-05-07', startTime: '10:00', endTime: '12:00', type: 'schedule', completed: false, isFavorite: false },
    { id: '3', title: '졸업 프로젝트 회의', date: '2026-05-07', startTime: '14:00', endTime: '16:00', type: 'schedule', completed: false, isFavorite: true },
    { id: '4', title: '독서 (인문학)', date: '2026-05-07', startTime: '22:00', endTime: '23:00', type: 'routine', completed: false, repeatDays: [0, 6], isFavorite: false },
  ]);

  // 달력 상태
  const [viewDate, setViewDate] = useState(new Date(2026, 4, 7)); // 2026년 5월 7일 기준

  // 달력 메모 상태 (YYYY-MM-DD: 메모내용)
  const [calendarNotes, setCalendarNotes] = useState<Record<string, string>>({
    '2026-05-07': '프로젝트 마감일',
    '2026-05-15': '친구 생일 🎂',
    '2026-05-20': '전시회 관람'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDayDetailOpen, setIsDayDetailOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth(); // 0-11

  const [formData, setFormData] = useState<Partial<Schedule>>({
    title: '',
    date: '2026-05-07',
    startTime: '09:00',
    endTime: '10:00',
    type: 'schedule',
    repeatDays: [],
    isFavorite: false
  });

  const todayDateStr = '2026-05-07';
  const todayDayIndex = 4;

  const todaySchedules = useMemo(() => {
    return schedules.filter(s => {
      if (s.type === 'schedule') return s.date === todayDateStr;
      if (s.type === 'routine') return s.repeatDays?.includes(todayDayIndex);
      return false;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules]);

  const selectedDaySchedules = useMemo(() => {
    if (selectedDay === null) return [];
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    const dayOfWeek = new Date(currentYear, currentMonth, selectedDay).getDay();

    return schedules.filter(s => {
      if (s.type === 'schedule') return s.date === dateStr;
      if (s.type === 'routine') return s.repeatDays?.includes(dayOfWeek);
      return false;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules, selectedDay, currentYear, currentMonth]);

  const routineSchedules = useMemo(() => {
    return schedules.filter(s => s.type === 'routine').sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules]);

  const majorSchedules = useMemo(() => {
    return schedules.filter(s => s.isFavorite && s.type === 'schedule').sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules]);

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleOpenAddModal = (dateStr?: string) => {
    setEditingId(null);
    setFormData({
      title: '',
      date: dateStr || todayDateStr,
      startTime: '09:00',
      endTime: '10:00',
      type: 'schedule',
      repeatDays: [],
      isFavorite: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (schedule: Schedule) => {
    setEditingId(schedule.id);
    setFormData({ ...schedule });
    setIsModalOpen(true);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setIsDayDetailOpen(true);
  };

  const handleSaveSchedule = () => {
    if (!formData.title) return;
    if (editingId) {
      setSchedules(schedules.map(s => s.id === editingId ? { ...s, ...formData } as Schedule : s));
    } else {
      const newSchedule: Schedule = {
        id: Date.now().toString(),
        title: formData.title || '',
        date: formData.date || todayDateStr,
        startTime: formData.startTime || '',
        endTime: formData.endTime || '',
        type: formData.type || 'schedule',
        completed: false,
        repeatDays: formData.repeatDays,
        isFavorite: formData.isFavorite || false
      };
      setSchedules([...schedules, newSchedule]);
    }
    setIsModalOpen(false);
  };

  const toggleComplete = (id: string) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const updateCalendarNote = (day: number, note: string) => {
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setCalendarNotes({ ...calendarNotes, [dateStr]: note });
  };

  const handleChangeField = (field: keyof Schedule, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleRepeatDay = (dayIndex: number) => {
    const currentDays = formData.repeatDays || [];
    if (currentDays.includes(dayIndex)) {
      setFormData(prev => ({ ...prev, repeatDays: currentDays.filter(d => d !== dayIndex) }));
    } else {
      setFormData(prev => ({ ...prev, repeatDays: [...currentDays, dayIndex].sort() }));
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ScheduleHeader onOpenAddModal={() => handleOpenAddModal()} />

      {/* Gemini AI Insights */}
      <AiInsightsBox />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <CalendarBox
          currentYear={currentYear}
          currentMonth={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDayClick={handleDayClick}
          calendarNotes={calendarNotes}
        />

        <div className="flex flex-col gap-6 max-h-[900px]">
          <TodayScheduleBox
            schedules={todaySchedules}
            onToggleComplete={toggleComplete}
            onOpenEdit={handleOpenEditModal}
            onDelete={deleteSchedule}
          />

          <RoutineScheduleBox
            schedules={routineSchedules}
            onToggleComplete={toggleComplete}
            onOpenEdit={handleOpenEditModal}
            onDelete={deleteSchedule}
          />

          <MajorScheduleBox
            schedules={majorSchedules}
            onToggleComplete={toggleComplete}
            onOpenEdit={handleOpenEditModal}
            onDelete={deleteSchedule}
          />
        </div>
      </div>

      {/* 날짜 상세 일정 모달 */}
      <DayDetailModal
        isOpen={isDayDetailOpen}
        onClose={() => setIsDayDetailOpen(false)}
        selectedDay={selectedDay}
        currentYear={currentYear}
        currentMonth={currentMonth}
        calendarNotes={calendarNotes}
        updateCalendarNote={updateCalendarNote}
        selectedDaySchedules={selectedDaySchedules}
        onOpenAddModal={handleOpenAddModal}
        onToggleComplete={toggleComplete}
        onOpenEdit={handleOpenEditModal}
        onDelete={deleteSchedule}
      />

      {/* 일정 추가/수정 모달 */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingId={editingId}
        formData={formData}
        onChangeField={handleChangeField}
        onToggleRepeatDay={handleToggleRepeatDay}
        onSave={handleSaveSchedule}
      />
    </div>
  );
}
