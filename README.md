# Learn-Time 프론트엔드 프로젝트 아키텍처 및 연동 가이드

본 문서는 프로젝트의 전체 디렉토리 및 파일별 역할을 명시하고, Spring Boot 백엔드 서버와 데이터베이스 연동을 위한 가이드라인을 제공함.

---

## 1. 프로젝트 폴더 및 파일 역할 (Directory Structure & Roles)

### 파일 구조도 (File Structure Tree)
```text
📦 2026-Graduation-Project-Frontend
 ┣ 📂 dist             # (자동 생성) 최종 프로덕션 배포용 빌드 결과물
 ┣ 📂 src
 ┃ ┣ 📂 api            # 서버 통신 및 Axios 클라이언트 설정
 ┃ ┣ 📂 app            # 앱 진입점 및 전역 라우터(routes.tsx)
 ┃ ┣ 📂 assets         # 이미지 등 정적 리소스
 ┃ ┣ 📂 components     # 도메인별 섹션 및 공통 UI 위젯
 ┃ ┣ 📂 hooks          # React Query 등 데이터 페칭용 커스텀 훅
 ┃ ┣ 📂 pages          # 라우터에 매핑되는 메인 화면 컴포넌트
 ┃ ┣ 📂 types          # 전역 TypeScript 인터페이스 및 응답 스펙(DTO)
 ┃ ┣ 📜 index.css      # 전역 스타일 및 Tailwind CSS 지시어
 ┃ ┗ 📜 main.tsx       # React 앱 렌더링 루트
 ┣ 📜 index.html       # 최상위 HTML 문서
 ┣ 📜 package.json     # 패키지 의존성 및 스크립트 (pnpm)
 ┣ 📜 vite.config.ts   # Vite 빌드 및 백엔드 연동 프록시 설정
 ┣ 📜 eslint.config.js # 코드 컨벤션(ESLint) 설정
 ┗ 📜 tsconfig.*       # 타입스크립트 컴파일러 옵션
```

### `/src` 디렉토리 상세 (애플리케이션 소스 코드)
* **`api/`** : 서버와의 HTTP 통신을 담당하는 계층.
  * `client.ts`: 전역 Axios 인스턴스. 타임아웃, 전역 헤더 설정, JWT 인증 인터셉터 및 에러 응답 분기 처리 등을 담당함.
  * `exercise.ts`, `study.ts`: 운동 랩, 활동 스튜디오 등 각 도메인별 API 호출 함수가 정의되어 있으며, 서버 장애/미구동 시 렌더링할 Fallback Mock 데이터가 포함되어 있음.
* **`app/`** : 애플리케이션의 엔트리포인트 및 글로벌 설정 영역.
  * `App.tsx`: 전역 컨텍스트(React Query Provider 등), 라우터 진입점 및 전역 공통 UI(헤더 등)를 설정함.
  * `routes.tsx`: React Router 기반의 라우팅 매핑 정보를 관리함.
* **`assets/`** : 정적 리소스 파일 관리.
  * `images/`: 앱 내에서 사용되는 각종 배지, 일러스트 이미지 리소스 보관 폴더임.
* **`components/`** : 재사용 가능한 UI 및 비즈니스 컴포넌트 계층.
  * `common/`: 버튼, 카드, 인풋 필드, 차트 등 전역적으로 사용되는 공통 UI 컴포넌트.
  * `layout/`: 전체 레이아웃 (GNB, 글로벌 네비게이션 헤더 등).
  * `section/`: 도메인 단위의 페이지를 구성하는 복합 위젯 및 모달 컴포넌트 (study, exercise, home, community 등 도메인별 분리).
  * `ui/`: 아이콘(`Icons.tsx`) 등 최소 단위 프리젠테이셔널 요소.
* **`hooks/`** : 공용 커스텀 훅.
  * `queries/`: React Query (TanStack Query)를 활용한 서버 상태 페칭 커스텀 훅 모음 (`useStudyReport.ts`, `useExerciseReport.ts` 등).
* **`pages/`** : 라우터에 매핑되는 메인 페이지 단위의 화면 컴포넌트.
  * `home.tsx`, `StudyPage.tsx`, `ExercisePage.tsx`, `CommunityPage.tsx`, `SchedulePage.tsx`, `EmptyPage.tsx`
* **`types/`** : 전역 타입스크립트 인터페이스 (DTO, 응답 타입, 비즈니스 모델).
  * `index.ts`: 모델의 인터페이스 및 API Response 스펙 정의.
* **`index.css`** : Tailwind CSS 지시어 설정 및 글로벌 CSS, Pretendard 폰트 룰을 정의함.
* **`main.tsx`** : React 앱의 루트 렌더러 (Virtual DOM 렌더링 진입점).

### `/dist` 디렉토리 (프로덕션 배포 결과물)
* **`dist/`** : `pnpm run build` 명령어 실행 시 생성되는 최종 배포 폴더임. 
  * `src`의 모든 코드가 브라우저 전용 표준 JavaScript/CSS로 변환되어 용량이 압축(Minify) 저장됨.
  * 실제 웹 서버(Vercel, AWS S3 등) 호스팅 시, 소스코드가 아닌 오직 이 `dist` 폴더 하나만 업로드됨.
  * 소스코드 빌드 시 항상 덮어씌워지는 자동 생성 폴더이므로 **내부 파일을 수동으로 수정하거나 삭제하지 않아야 함** (관리는 오직 `src`에서만 진행).

### 기타 최상위 파일
* **`package.json` / `pnpm-lock.yaml`** : 프로젝트 의존성 모듈 목록 및 스크립트 (pnpm 패키지 매니저 사용).
* **`vite.config.ts`** : Vite 빌드 설정 파일. 로컬 개발 환경에서 CORS 회피용 프록시(`Proxy`)를 설정함.
* **`eslint.config.js`** : ESLint 정적 분석 포매팅 룰 설정.
* **`tsconfig.*.json`** : 타입스크립트 컴파일러(TSC) 옵션.
* **`index.html`** : 애플리케이션의 최상단 루트 HTML 문서.

---

## 2. 백엔드 및 DB 연동 가이드라인 (Backend & DB Integration Guide)

### 2.1 아키텍처 개요
본 프론트엔드는 **Spring Boot** 백엔드 애플리케이션 및 **MySQL/PostgreSQL** 관계형 데이터베이스와의 연동을 전제로 설계되어 있음. API 통신은 `Axios`를 통한 REST API 방식이며, 비동기 서버 상태 관리는 `@tanstack/react-query`를 사용함.

### 2.2 API 클라이언트 동작 원리 (`src/api/client.ts`)
* **프록시 (Proxy)**: 개발 시 브라우저 CORS 제약을 피하기 위해 `vite.config.ts`에서 프록시를 구동함. 프론트엔드에서 `/api` 경로로 호출하면, Vite 서버가 백엔드로 요청을 중계함.
* **타임아웃 (Timeout)**: 10,000ms(10초)로 설정되어 있음. DB 트랜잭션 지연 시 클라이언트 응답 대기 시간을 제어함.
* **인터셉터 (Interceptors)**:
  * **Request**: 브라우저의 `localStorage`에 저장된 `accessToken`을 읽어 매 요청마다 `Authorization: Bearer <토큰>` 헤더를 자동 주입함.
  * **Response**:
    * `401 Unauthorized`: JWT 토큰 만료 또는 인증 실패 발생. 로컬 스토리지의 토큰을 파기하고 재로그인 화면으로 유도하도록 처리되어 있음.
    * `403 Forbidden`: API 리소스에 대한 접근 권한 부족 알림.
    * `500 Internal Server Error`: DB 접근 오류, 트랜잭션 롤백 등 서버 내부 장애 시 시스템 로그 표출.

### 2.3 백엔드 개발 시 API 응답 스펙 준수
프론트엔드는 통일된 JSON 구조의 응답을 기대함. 백엔드의 ResponseDto는 반드시 `src/types/index.ts`에 정의된 `ApiResponse<T>` 스펙과 일치해야 함.

```json
{
  "code": 200,
  "message": "성공적으로 조회되었습니다.",
  "data": {
    // 실제 반환되는 리소스 페이로드
  }
}
```

### 2.4 개발 환경 연동 방법

1. **.env 환경변수 설정**
   프론트엔드 루트 디렉토리에 `.env` 파일을 생성(또는 수정)하고 백엔드 API 주소 접두사를 설정함.
   ```env
   VITE_API_BASE_URL=/api
   ```

2. **Vite Proxy 설정 점검 (`vite.config.ts`)**
   백엔드 서버 구동 포트(예: `localhost:8080`)에 맞춰 프록시 대상을 확인함.
   ```typescript
   export default defineConfig({
     // ...
     server: {
       proxy: {
         '/api': {
           target: 'http://localhost:8080', // 백엔드 서버 주소
           changeOrigin: true,
         }
       }
     }
   });
   ```

3. **에러 Fallback Mocking 활용과 제거**
   현재 프론트엔드의 각 API 호출부(`src/api/*.ts`)의 `catch` 블록에는 **백엔드 서버가 연동되지 않은 상태에서도 화면이 렌더링되도록 Mock 더미 데이터를 반환하는 예외 처리**가 작성되어 있음.
   * 백엔드 API 명세가 확정되고 정상 연동이 완료되면, 향후 프로덕션 빌드 이전에 해당 `catch` 블록의 Fallback 로직을 제거하거나 실제 로깅 및 에러 바운더리 핸들링 처리로 교체해야 함.
