import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore.ts';
import { axiosInstance } from '../app/apiClient.ts';

export default function Home() {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);
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
        <h1>메인 홈 화면 (테스트)</h1>

        <button 
            onClick={handleLogout}
            style={{ marginTop: '20px', padding: '10px', cursor: 'pointer' }}
        >
            로그아웃 테스트
        </button>
        </div>
    );
}