import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import {
    createStudyPlanApi,
    getStudyStatusApi,
} from '../pages/study/api/createStudyApi';
import { getApiErrorUtil } from '../utils/getApiErrorUtil';
import type { StudyForm, BookToc } from '../pages/study/create/CreateStudyPage';

// 폴링 관련 상수 (대문자로 관리)
const POLLING_INTERVAL_MS = 2500;  // 2.5초 간격
const POLLING_TIMEOUT_MS  = 15000; // 최대 15초 타임아웃

export function useStudyGeneration() {
    const navigate = useNavigate();

    // POST 완료 후 받은 studyId 저장 (null이면 폴링 비활성화)
    const [ pendingStudyId, setPendingStudyId ] = useState<number | null>(null);
    // POST 요청 진행 중 여부
    const [ isRequesting, setIsRequesting ] = useState<boolean>(false);
    // 에러 메시지 (POST 실패 / FAILED 상태 / 타임아웃 포함)
    const [ generationError, setGenerationError ] = useState<string>('');
    // 폴링 시작 시각 (타임아웃 계산용 Ref: 렌더링 불필요)
    const pollingStartedAt = useRef<number | null>(null);

    // ─── TanStack Query: 상태 폴링 ──────────────────────────────
    const { data: statusData } = useQuery({
        queryKey: ['studyStatus', pendingStudyId],
        queryFn: () => getStudyStatusApi(pendingStudyId!),

        // pendingStudyId가 없으면 쿼리 자체를 비활성화
        enabled: pendingStudyId !== null,

        // PLANNING 상태일 때만 폴링 지속, READY/FAILED/타임아웃이면 false 반환해 중단
        refetchInterval: (query) => {
            const status = query.state.data?.status;

            if (status === 'READY' || status === 'FAILED') return false;

            if (pollingStartedAt.current !== null) {
                const elapsed = Date.now() - pollingStartedAt.current;
                if (elapsed >= POLLING_TIMEOUT_MS) return false;
            }

            return POLLING_INTERVAL_MS;
        },

        // 탭 포커스 시 불필요한 추가 요청 방지
        refetchOnWindowFocus: false,
    });

    // ─── 폴링 결과 감지 (useEffect로 사이드 이펙트 명확히 분리) ──
    useEffect(() => {
        if (!statusData) return;

        if (statusData.status === 'READY') {
            // READY: 성공 → 상세 페이지로 이동 (경로는 routes.tsx 기준으로 수정 필요)
            alert('🎉 공부 진도가 생성되었습니다!');
            navigate(`/study/${statusData.studyId}`);
            return;
        }

        if (statusData.status === 'FAILED') {
            // FAILED: 백엔드 AI 처리 오류
            setGenerationError('AI 학습 계획 생성에 실패했습니다. 다시 시도해 주세요.');
            setPendingStudyId(null);
            return;
        }

        // PLANNING 상태에서 타임아웃 초과 감지
        if (statusData.status === 'PLANNING' && pollingStartedAt.current !== null) {
            const elapsed = Date.now() - pollingStartedAt.current;
            if (elapsed >= POLLING_TIMEOUT_MS) {
                setGenerationError('응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.');
                setPendingStudyId(null);
            }
        }
    }, [statusData, navigate]);

    // ─── 생성 요청 함수 (POST 단계) ──────────────────────────────
    const requestGeneration = async (
        studyForm: StudyForm,
        bookToc: BookToc[],
        studyMemberList: number[]
    ) => {
        // 중복 실행 방지
        if (isRequesting || pendingStudyId !== null) return;

        setIsRequesting(true);
        setGenerationError('');

        try {
            // 빠른 응답으로 인한 UI 깜빡임(Flickering) 방지를 위해 최소 1초 대기 보장
            const [studyId] = await Promise.all([
                createStudyPlanApi(studyForm, bookToc, studyMemberList),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);
            
            pollingStartedAt.current = Date.now(); // 타임아웃 타이머 시작
            setPendingStudyId(studyId);            // 이 순간부터 useQuery 폴링 활성화
        } catch (error: unknown) {
            setGenerationError(getApiErrorUtil(error));
        } finally {
            setIsRequesting(false);
        }
    };

    // ─── 재시도 시 상태 초기화 ────────────────────────────────────
    const resetGeneration = () => {
        setPendingStudyId(null);
        setGenerationError('');
        pollingStartedAt.current = null;
    };

    // UI 렌더링용 파생 상태
    const isPolling = pendingStudyId !== null && statusData?.status === 'PLANNING';
    const isBusy    = isRequesting || isPolling; // 버튼 disabled 처리용

    return {
        requestGeneration,
        resetGeneration,
        isBusy,
        isPolling,
        generationError,
    };
}
