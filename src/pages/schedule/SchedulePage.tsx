import { useState, useMemo, useEffect } from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';
import {
  ScheduleHeader,
  TodayScheduleBox,
  RoutineScheduleBox,
  MajorScheduleBox,
  CalendarBox,
  DayDetailModal,
  ScheduleModal,
} from './types/scheduleIndex';
import type { Schedule, DayOfWeek } from './types/ScheduleTypes';
import {
  getMonthlySchedulesApi,
  createScheduleApi,
  updateScheduleApi,
  deleteScheduleApi,
} from './api/ScheduleApi';

import { getRoutinesApi, createRoutineApi, updateRoutineApi, deleteRoutineApi } from './api/RoutineApi';
 

// 오늘 날짜를 YYYY-MM-DD 형식으로 구하는 헬퍼 함수
const getTodayString = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// 요일 인덱스 변환 맵
const DAY_MAP: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const FRONT_DAY_MAP: DayOfWeek[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export default function SchedulePage() {
  usePageTitle('일정 관리');

  // 일정 및 달력 메모 상태
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [calendarNotes, setCalendarNotes] = useState<Record<string, string>>({});

  // 달력 상태 (오늘 날짜 기준으로 초기화)
  const [viewDate, setViewDate] = useState(new Date());
  
  // 모달 제어 상태
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ isDayDetailOpen, setIsDayDetailOpen ] = useState(false);
  const [ selectedDay, setSelectedDay ] = useState<number | null>(null);
  const [ editingId, setEditingId ] = useState<string | null>(null);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth(); // 0-11

  // 새 일정 생성을 위한 폼 데이터 상태
  const [ formData, setFormData ] = useState<Partial<Schedule>>({
    title: '',
    date: getTodayString(new Date()),
    startTime: '09:00',
    endTime: '10:00',
    type: 'schedule',
    repeatDays: [],
    isFavorite: false
  });

  // 오늘 날짜 정보 계산
  const today = useMemo(() => new Date(), []);
  const todayDateStr = useMemo(() => getTodayString(today), [today]);
  const todayDayIndex = useMemo(() => today.getDay(), [today]);

  // 로컬 메모 불러오기
  useEffect(() => {
    const savedNotes = localStorage.getItem('learn_time_calendar_notes');
    if (savedNotes) {
      try {
        setCalendarNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse calendar notes from localStorage', e);
      }
    }
  }, []);

  // 1. 일정 및 루틴 API 동기화 함수
  const fetchAllData = async () => {
    try {
      const [calendarData, routineData] = await Promise.all([
        getMonthlySchedulesApi(currentYear, currentMonth + 1),
        getRoutinesApi()
      ]);

      // Calendar DTO -> Schedule 인터페이스 변환
      const mappedSchedules: Schedule[] = calendarData.map(dto => {
        const [dateStr, timeStr] = dto.targetDate.split('T');
        const startTime = timeStr ? timeStr.substring(0, 5) : '09:00';
        
        // 1시간 간격 기본 설정
        const [h, m] = startTime.split(':').map(Number);
        const endH = String((h + 1) % 24).padStart(2, '0');
        const endTime = `${endH}:${String(m).padStart(2, '0')}`;

        return {
          id: `schedule-${dto.calendarRecordId}`, // schedule 접두사 붙임
          title: dto.content,
          date: dateStr,
          startTime,
          endTime,
          type: 'schedule',
          isFavorite: dto.isImportant || false
        };
      });

      // Routine DTO -> Schedule 인터페이스 변환
      const mappedRoutines: Schedule[] = routineData.map(dto => {
        const startTime = dto.startTime ? dto.startTime.substring(0, 5) : '09:00';
        const [h, m] = startTime.split(':').map(Number);
        const endH = String((h + 1) % 24).padStart(2, '0');
        const endTime = `${endH}:${String(m).padStart(2, '0')}`;

        const repeatDays = dto.daysOfWeek
          ? dto.daysOfWeek.map((dayStr: string) => DAY_MAP[dayStr])
          : [];

        return {
          id: `routine-${dto.routineId}`, // routine 접두사 붙임
          title: dto.content,
          date: dto.startDate || todayDateStr,
          startTime,
          endTime,
          type: 'routine',
          completed: false,
          repeatDays,
          isFavorite: dto.isImportant || false
        };
      });

      setSchedules([...mappedSchedules, ...mappedRoutines]);
    } catch (error) {
      console.error('Failed to load schedules and routines:', error);
    }
  };

  // 연월 변경 시 목록 재조회
  useEffect(() => {
    fetchAllData();
  }, [currentYear, currentMonth]);

  // 오늘의 일정 필터링 (루틴은 제외하고 일반 일정만 필터링)
  const todaySchedules = useMemo(() => {
    return schedules.filter(s => {
      if (s.type === 'schedule') return s.date === todayDateStr;
      return false;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules, todayDateStr]);

  // 선택된 날짜의 상세 일정 필터링 (루틴은 제외하고 일반 일정만 필터링)
  const selectedDaySchedules = useMemo(() => {
    if (selectedDay === null) return [];
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;

    return schedules.filter(s => {
      if (s.type === 'schedule') return s.date === dateStr;
      return false;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules, selectedDay, currentYear, currentMonth]);

  // 반복 루틴 목록 필터링
  const routineSchedules = useMemo(() => {
    return schedules.filter(s => s.type === 'routine').sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules]);

  // 주요 일정(별표) 목록 필터링
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

  // 일정/루틴 저장 (생성 또는 수정)
  const handleSaveSchedule = async () => {
    if (!formData.title) return;
    try {
      if (editingId) {
        const isRoutine = editingId.startsWith('routine-');
        const rawId = editingId.replace('schedule-', '').replace('routine-', '');

        if (isRoutine) {
          // 루틴 수정
          const startTime = `${formData.startTime || '09:00'}:00`;
          const daysOfWeek = formData.repeatDays
            ? formData.repeatDays.map(idx => FRONT_DAY_MAP[idx])
            : [];
          
          await updateRoutineApi(rawId, {
            content: formData.title || '',
            startTime,
            startDate: formData.date || todayDateStr,
            endDate: null,
            isImportant: formData.isFavorite || false,
            daysOfWeek
          });
        } else {
          // 일반 일정 수정
          const targetDate = `${formData.date || todayDateStr}T${formData.startTime || '09:00'}:00`;
          await updateScheduleApi(rawId, {
            content: formData.title || '',
            targetDate,
            isImportant: formData.isFavorite || false
          });
        }
      } else {
        if (formData.type === 'routine') {
          // 새 루틴 생성
          const startTime = `${formData.startTime || '09:00'}:00`;
          const daysOfWeek = formData.repeatDays
            ? formData.repeatDays.map(idx => FRONT_DAY_MAP[idx])
            : [];

          await createRoutineApi({
            content: formData.title || '',
            startTime,
            startDate: formData.date || todayDateStr,
            endDate: null,
            isImportant: formData.isFavorite || false,
            daysOfWeek
          });
        } else {
          // 새 일반 일정 생성
          const targetDate = `${formData.date || todayDateStr}T${formData.startTime || '09:00'}:00`;
          await createScheduleApi({
            content: formData.title || '',
            targetDate,
            isImportant: formData.isFavorite || false
          });
        }
      }
      setIsModalOpen(false);
      fetchAllData(); // 저장 완료 후 목록 재조회
    } catch (error) {
      console.error('Failed to save schedule:', error);
      alert('일정 저장에 실패했습니다.');
    }
  };

  // 일정 완료 여부 토글 (체크박스 로직은 실제론 제거되었으나 인터페이스 잔존)
  const toggleComplete = async (id: string) => {
    if (id.startsWith('routine-')) return; // 루틴은 완료 여부 없음
    const target = schedules.find(s => s.id === id);
    if (!target) return;
    const rawId = id.replace('schedule-', '');

    try {
      const targetDate = `${target.date}T${target.startTime}:00`;
      await updateScheduleApi(rawId, {
        content: target.title,
        targetDate,
        isImportant: target.isFavorite
      });
      fetchAllData();
    } catch (error) {
      console.error('Failed to toggle completion status:', error);
    }
  };

  // 일정 또는 루틴 삭제
  const deleteSchedule = async (id: string) => {
    if (!confirm('정말로 이 항목을 삭제하시겠습니까?')) return;
    const isRoutine = id.startsWith('routine-');
    const rawId = id.replace('schedule-', '').replace('routine-', '');

    try {
      if (isRoutine) {
        await deleteRoutineApi(rawId);
      } else {
        await deleteScheduleApi(rawId);
      }
      fetchAllData(); // 삭제 완료 후 목록 재조회
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      alert('일정 삭제에 실패했습니다.');
    }
  };

  // 특정 날짜의 달력 로컬 메모 업데이트
  const updateCalendarNote = async (day: number, note: string) => {
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    setCalendarNotes((prev: Record<string, string>) => {
      const updated = { ...prev, [dateStr]: note };
      localStorage.setItem('learn_time_calendar_notes', JSON.stringify(updated));
      return updated;
    });
  };

  const handleChangeField = (field: keyof Schedule, value: any) => {
    setFormData((prev: Partial<Schedule>) => {
      const updated = { ...prev, [field]: value };
      
      // 시작 시간을 설정하면 종료 시간을 시작 시간과 같게 동기화 (시작시간 <= 종료시간 보장)
      if (field === 'startTime') {
        updated.endTime = value;
      }
      
      // 종료 시간이 시작 시간보다 이전으로 설정될 경우 시작 시간과 같게 조정 (시작시간 <= 종료시간 조건)
      if (field === 'endTime' && prev.startTime && value < prev.startTime) {
        updated.endTime = prev.startTime;
      }
      
      return updated;
    });
  };

  const handleToggleRepeatDay = (dayIndex: number) => {
    const currentDays = formData.repeatDays || [];
    if (currentDays.includes(dayIndex)) {
      setFormData((prev: Partial<Schedule>) => ({ ...prev, repeatDays: currentDays.filter((d: number) => d !== dayIndex) }));
    } else {
      setFormData((prev: Partial<Schedule>) => ({ ...prev, repeatDays: [...currentDays, dayIndex].sort() }));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ScheduleHeader onOpenAddModal={() => handleOpenAddModal()} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <CalendarBox
          currentYear={currentYear}
          currentMonth={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDayClick={handleDayClick}
          calendarNotes={calendarNotes}
          schedules={schedules}
        />

        <div className="flex flex-col gap-6 max-h-225">
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
