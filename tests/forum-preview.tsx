// 로컬 UI 검증 전용 진입점입니다. 실제 백엔드 요청이나 인증을 사용하지 않습니다.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AxiosError, AxiosHeaders } from 'axios';
import { axiosInstance } from '../src/app/apiClient';
import { useAuthStore } from '../src/store/useAuthStore';
import StudyForumPage from '../src/pages/study/forum/StudyForumPage';
import '../src/styles/index.css';

let status = 'ACTIVE';
let failed = false;
let serial = 65;
let rows = Array.from({ length: 65 }, (_, index) => ({ messageId: 65 - index, authorStudyMemberId: 2, authorUserId: 2, authorName: '스터디원', content: `${65 - index}번째 대화입니다. 오늘 학습한 내용을 함께 정리해 봐요.`, createdAt: '2026-09-15T14:00:00' }));
useAuthStore.getState().setUserId(1);
axiosInstance.defaults.adapter = async config => {
  const response = { data: {} as unknown, status: 200, statusText: 'OK', headers: new AxiosHeaders(), config };
  const reject = (code: string, message: string, httpStatus: number) => {
    throw new AxiosError(message, undefined, config, undefined, { ...response, status: httpStatus, data: { errorCode: code, message } });
  };
  if (failed) reject('TEST', '연결에 실패했습니다. 다시 시도해 주세요.', 500);
  if (config.url === '/api/study/archive') return { ...response, data: [{ studyId: 1, studyTitle: '자료구조 함께 공부하기', myStatus: status, myRole: 'MEMBER', status, role: 'MEMBER' }] };
  if (status === 'WITHDRAWN') reject('STUDY-FORUM-001', '접근 권한이 없습니다.', 403);
  if (config.method === 'post') {
    if (status === 'COMPLETED') reject('STUDY-FORUM-002', '수료한 스터디는 읽기 전용입니다.', 403);
    const { content } = JSON.parse(config.data as string) as { content: string };
    const row = { messageId: ++serial, authorStudyMemberId: 1, authorUserId: 1, authorName: '나', content: content.trim(), createdAt: '2026-09-15T14:05:00' };
    rows.unshift(row);
    return { ...response, status: 201, data: row };
  }
  if (config.method === 'delete') { rows = rows.filter(row => row.messageId !== Number(config.url?.split('/').at(-1))); return { ...response, status: 204 }; }
  const before = config.params?.beforeId as number | undefined;
  const candidates = rows.filter(row => before === undefined || row.messageId < before);
  const content = candidates.slice(0, 30);
  const hasNext = candidates.length > 30;
  return { ...response, data: { content, hasNext, nextCursor: hasNext ? content.at(-1)!.messageId : null } };
};

createRoot(document.getElementById('root')!).render(<StrictMode>
  <div className="p-4 lg:p-8 bg-gray-50 dark:bg-[#020202] min-h-screen">
    <nav aria-label="테스트 상태" className="flex flex-wrap gap-3 mb-4 text-sm">
      <button onClick={() => { status = 'COMPLETED'; }}>수료 상태로 변경</button>
      <button onClick={() => { status = 'WITHDRAWN'; }}>탈퇴 상태로 변경</button>
      <button onClick={() => { failed = !failed; }}>네트워크 실패 전환</button>
      <button onClick={() => document.documentElement.classList.toggle('dark')}>테마 전환</button>
    </nav>
    <MemoryRouter initialEntries={['/study/forum/1']}><Routes><Route path="/study/forum/:studyId" element={<StudyForumPage />} /></Routes></MemoryRouter>
  </div>
</StrictMode>);
