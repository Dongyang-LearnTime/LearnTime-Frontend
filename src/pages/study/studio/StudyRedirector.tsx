import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyStore } from '../../../store/useStudyStore';
import { usePageTitle } from '../../../hooks/usePageTitle';

export default function StudyRedirector() {
  usePageTitle('학습 스튜디오 불러오는 중...');
  const navigate = useNavigate();
  const { progresses, fetchProgresses, isLoading } = useStudyStore();

  useEffect(() => {
    fetchProgresses();
  }, [fetchProgresses]);

  useEffect(() => {
    if (isLoading) return;

    if (progresses && progresses.length > 0) {
      // 1순위: hasTodayPlan === true 이면서 studyId가 가장 큰(최근) 스터디
      const plansToday = progresses.filter(p => p.hasTodayPlan);
      
      let targetId: number;
      let targetTitle: string = '';
      
      if (plansToday.length > 0) {
        // hasTodayPlan이 있는 것들 중 가장 큰 id를 가진 스터디 탐색
        const target = plansToday.reduce((prev, current) => (prev.studyId > current.studyId) ? prev : current);
        targetId = target.studyId;
        targetTitle = target.studyTitle;
      } else {
        // hasTodayPlan이 없으면 전체 중 가장 큰 id를 가진 스터디 탐색
        const target = progresses.reduce((prev, current) => (prev.studyId > current.studyId) ? prev : current);
        targetId = target.studyId;
        targetTitle = target.studyTitle;
      }
      
      navigate(`/study/${targetId}?title=${encodeURIComponent(targetTitle)}`, { replace: true });
    } else if (progresses.length === 0 && !isLoading) {
      // 목록이 비어있으면 Empty 화면으로 이동
      navigate('/study/empty', { replace: true });
    }
  }, [progresses, isLoading, navigate]);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <span className="text-sm font-bold text-gray-400">스터디 정보를 불러오는 중입니다...</span>
    </div>
  );
}
