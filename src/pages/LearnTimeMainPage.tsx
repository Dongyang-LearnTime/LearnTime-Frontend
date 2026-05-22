// 로그인 후 메인 페이지 — 기존 Home.tsx와 동일한 코드를 유지
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../app/apiClient';
import { useNotificationSSE } from '../hooks/useNotificationSSE';
import { NotificationDropdown } from '../components/layout/NotificationDropdown';

export default function LearnTimeMainPage() {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // 실시간 SSE 알림 수신 연결 — 로그인 상태일 때만 이 페이지가 렌더링되므로 항상 활성화
    useNotificationSSE();

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/api/auth/logout');
        } catch (error) {
            console.error('로그아웃 통신 에러 (서버 장애 등):', error);
        } finally {
            clearAuth();
            localStorage.removeItem('login_hint');
            navigate('/login');
        }
    };

    return (
        <div>
            <h1>메인 홈 화면 (테스트)</h1> {/* 임시 태그 */}

            {/* 실시간 알림 수신 아이콘 및 드롭다운 */}
            {isAuthenticated && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                    <NotificationDropdown />
                </div>
            )}

            <a href="/login"> {/* 임시 태그 */}
                로그인 페이지
            </a>

            <br />
            <a href="/study/plan/create"> {/* 임시 태그 */}
                일정 생성 페이지
            </a>

            <hr />
            {
                isAuthenticated && // 로그인 상태일때만 보이게
                    <button
                        onClick={handleLogout}
                    >
                        로그아웃 테스트
                    </button>
            }

        </div>
    );
}
