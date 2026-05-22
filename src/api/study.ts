/**
 * @file study.ts
 * @description 학습 관리(Study) REST API 연동.
 */

import { apiClient } from './client';
import type { Todo, CreateTodoDto, UpdateTodoDto, ApiResponse, StudyReport } from '../types';

// API 엔드포인트
const STUDY_API_PATH = '/study/todos';

export const studyApi = {
  /**
   * @description Todo 목록 조회 (GET /api/study/todos)
   * @returns {Promise<Todo[]>} 학습 체크리스트
   */
  getTodos: async (): Promise<Todo[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Todo[]>>(STUDY_API_PATH);
      return response.data.data;
    } catch (error) {
      // API 실패 시 더미 데이터 반환
      console.warn('임시 더미 데이터 반환', error);
      return [
        { id: '1', text: '1장: 미적분 기초 (1~15페이지)', completed: true, isAi: true },
        { id: '2', text: '2장: 도함수의 활용 핵심 예제 풀이', completed: false, isAi: true },
        { id: '3', text: '수학 익힘책 오답노트 작성', completed: false, isAi: false },
        { id: '4', text: '저녁 운동 및 명상', completed: false, isAi: false },
      ];
    }
  },

  /**
   * @description Todo 단건 추가 (POST /api/study/todos)
   * @param {CreateTodoDto} dto - 생성 Todo 정보
   * @returns {Promise<Todo>} 생성된 Todo
   */
  createTodo: async (dto: CreateTodoDto): Promise<Todo> => {
    const response = await apiClient.post<ApiResponse<Todo>>(STUDY_API_PATH, dto);
    return response.data.data;
  },

  /**
   * @description Todo 일괄 추가 (POST /api/study/todos/bulk)
   * @param {CreateTodoDto[]} dtos - 생성 Todo 목록
   * @returns {Promise<Todo[]>} 생성된 Todo 목록
   */
  createTodosBulk: async (dtos: CreateTodoDto[]): Promise<Todo[]> => {
    const response = await apiClient.post<ApiResponse<Todo[]>>(`${STUDY_API_PATH}/bulk`, dtos);
    return response.data.data;
  },

  /**
   * @description Todo 수정 (PUT /api/study/todos/{id})
   * @param {string} id - Todo ID
   * @param {UpdateTodoDto} dto - 수정 정보
   * @returns {Promise<Todo>} 수정된 Todo
   */
  updateTodo: async (id: string, dto: UpdateTodoDto): Promise<Todo> => {
    const response = await apiClient.put<ApiResponse<Todo>>(`${STUDY_API_PATH}/${id}`, dto);
    return response.data.data;
  },

  /**
   * @description Todo 삭제 (DELETE /api/study/todos/{id})
   * @param {string} id - Todo ID
   */
  deleteTodo: async (id: string): Promise<void> => {
    await apiClient.delete(`${STUDY_API_PATH}/${id}`);
  },

  /**
   * @description 공부 기록 리포트 조회 (GET /api/study/report)
   * @returns {Promise<StudyReport>} AI 공부 리포트
   */
  getStudyReport: async (): Promise<StudyReport> => {
    try {
      const response = await apiClient.get<ApiResponse<StudyReport>>('/study/report');
      return response.data.data;
    } catch (error) {
      console.warn('임시 더미 리포트 데이터 반환', error);
      return {
        totalStudyTime: 420,
        completedTodosCount: 12,
        totalTodosCount: 18,
        weeklyStudyMinutes: [40, 70, 45, 90, 60, 85, 30],
        studiedKeywords: ['미적분의 기본 정리', '치환적분', '수학 익힘책 오답', '영어 단어 암기', '뽀모도로 루틴'],
        aiFeedbackSummary: '이번 주 미적분 파트 이해도가 85% 이상으로 매우 우수합니다. 작성해주신 오답 노트와 실전 예제 풀이를 보았을 때 개념 적용 능력이 크게 향상되었습니다. 뽀모도로 기법(25분 몰입/5분 휴식)도 계획대로 82% 실천하셨습니다. 다만 주말(토, 일) 공부량이 급감하는 경향이 있으니, 토요일 오전에 가볍게 1차 누적 복습을 배치하여 학습 연속성을 확보해보는 것을 추천합니다.',
        reportDate: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
      };
    }
  },
};



