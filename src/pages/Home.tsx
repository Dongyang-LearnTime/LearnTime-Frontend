import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore.ts';
import { axiosInstance } from '../app/apiClient.ts';

export default function Home() {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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