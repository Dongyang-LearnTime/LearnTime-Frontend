import { useMemo } from "react";

interface ParsedPlanItem {
  title: string;
  pages: number | null;
  isReview: boolean;
}

interface FormattedPlanContentProps {
  planContent: string | null;
}

export function parsePlanContent(content: string): ParsedPlanItem[] {
  if (!content || content.trim() === "" || content === "자율 학습 및 휴식") return [];
  
  // 쉼표(뒤에 공백 포함) 또는 줄바꿈(\n, \r\n)으로 유연하게 분할
  const parts = content.split(/,\s+|\n|\r\n/).filter(part => part.trim() !== "");
  
  return parts.map(part => {
    let text = part.trim();
    let isReview = false;
    
    // 복습 패턴 검사 최적화 ([복습], (복습), 복습:, 복습 - 등 대응)
    if (text.startsWith("[복습]")) {
      isReview = true;
      text = text.substring(5).trim();
    } else if (text.startsWith("(복습)")) {
      isReview = true;
      text = text.substring(4).trim();
    } else if (text.startsWith("복습:")) {
      isReview = true;
      text = text.substring(3).trim();
    } else if (/^복습\s+-\s+/.test(text)) {
      isReview = true;
      text = text.replace(/^복습\s+-\s+/, "").trim();
    }
    
    // 페이지 정보 매칭 (p, page, 페이지, 쪽 단위 대응 및 내부 공백 허용)
    const pageMatch = text.match(/(.+?)\s*\(\s*(\d+)\s*(?:p|page|페이지|쪽)\.?\s*\)$/i);
    
    if (pageMatch) {
      return {
        title: pageMatch[1].trim(),
        pages: parseInt(pageMatch[2], 10),
        isReview
      };
    }
    
    return {
      title: text,
      pages: null,
      isReview
    };
  });
}

export default function FormattedPlanContent({ planContent }: FormattedPlanContentProps) {
  const items = useMemo(() => parsePlanContent(planContent || ""), [planContent]);
  
  const newStudies = useMemo(() => items.filter(item => !item.isReview), [items]);
  const reviews = useMemo(() => items.filter(item => item.isReview), [items]);
  
  const hasPages = useMemo(() => items.some(item => item.pages !== null), [items]);
  const totalPages = useMemo(() => items.reduce((acc, cur) => acc + (cur.pages || 0), 0), [items]);

  // 형식이 완전히 깨진 경우 감지 (HTML, JSON, 혹은 긴 줄글 형태)
  const isFormatBroken = useMemo(() => {
    if (!planContent) return false;
    
    const trimmed = planContent.trim();
    // 1. JSON 문자열 형태인 경우
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) return true;
    // 2. HTML 태그가 감지되는 경우
    if (/<[a-z][\s\S]*>/i.test(trimmed)) return true;
    
    // 3. 파싱 결과가 1개인데, 쪽수/복습 정보가 없으며 제목이 문장형(35자 이상)으로 긴 경우
    if (items.length === 1) {
      const singleItem = items[0];
      return (
        singleItem.pages === null &&
        !singleItem.isReview &&
        singleItem.title.length >= 35
      );
    }
    return false;
  }, [items, planContent]);

  if (!planContent) {
    return <span className="text-gray-400 italic">등록된 학습 계획이 없습니다.</span>;
  }

  // 예외 케이스 1: 자율 학습 및 휴식 또는 빈 목록
  if (planContent === "자율 학습 및 휴식" || items.length === 0) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl text-center text-sm font-bold text-gray-400">
        ☕ 자율 학습 및 휴식
      </div>
    );
  }

  // 예외 케이스 2: 형식이 깨지거나 일반 문장으로 넘어온 경우 (줄글 렌더링 피드백)
  if (isFormatBroken) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl text-left text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
        📢 {planContent}
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full text-left" id="formatted-plan-container">
      {/* 1. 요약 정보 메트릭스 배너 (페이지 존재 여부에 따라 3열 또는 2열로 자동 변경) */}
      <div 
        className={`grid gap-3 p-4 bg-gray-50 dark:bg-[#050505]/40 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl ${
          hasPages ? 'grid-cols-3' : 'grid-cols-2'
        }`}
        id="formatted-plan-metrics"
      >
        <div className="text-center">
          <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">신규 학습</div>
          <div className="text-sm font-black text-indigo-500 dark:text-indigo-400">{newStudies.length}개</div>
        </div>
        <div className="text-center border-l border-gray-200 dark:border-[#1a1a1a]">
          <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">복습</div>
          <div className="text-sm font-black text-emerald-500 dark:text-emerald-400">{reviews.length}개</div>
        </div>
        {hasPages && (
          <div className="text-center border-l border-gray-200 dark:border-[#1a1a1a]">
            <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">총 페이지</div>
            <div className="text-sm font-black text-amber-500 dark:text-amber-400">{totalPages}p</div>
          </div>
        )}
      </div>

      {/* 2. 신규 학습 섹션 */}
      {newStudies.length > 0 && (
        <div id="formatted-plan-new-section">
          <h4 className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2 pl-1">신규 학습</h4>
          <div className="space-y-2">
            {newStudies.map((item, idx) => (
              <div 
                key={idx} 
                className="flex justify-between items-center p-3 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/30 dark:border-indigo-950/30 rounded-xl"
              >
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-normal">{item.title}</span>
                {item.pages !== null && (
                  <span className="px-2 py-0.5 text-[10px] font-black bg-indigo-100/50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md shrink-0 ml-3">{item.pages}p</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 복습 섹션 */}
      {reviews.length > 0 && (
        <div id="formatted-plan-review-section">
          <h4 className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest mb-2 pl-1">복습</h4>
          <div className="space-y-2">
            {reviews.map((item, idx) => (
              <div 
                key={idx} 
                className="flex justify-between items-center p-3 bg-emerald-50/10 dark:bg-emerald-950/5 border border-emerald-100/20 dark:border-emerald-950/20 rounded-xl"
              >
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300 leading-normal">{item.title}</span>
                {item.pages !== null && (
                  <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-100/40 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-md shrink-0 ml-3">{item.pages}p</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
