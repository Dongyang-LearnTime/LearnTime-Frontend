import type { Terms } from "../../../types/UserEnums";
import { TERMS_CONTENTS } from "./constants/termsData"; // 데이터 임포트

interface Props {
  termsAgreements: Record<Terms, boolean>;
  onChange: (term: Terms, checked: boolean) => void;
}

const TermsAgreementSection = ({ termsAgreements, onChange }: Props) => {
    
  const handleToggle = (term: Terms, checked: boolean) => {
    onChange(term, checked);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">약관 동의</p>

      <div className="border border-slate-200 dark:border-[#333] rounded-2xl p-5 bg-slate-50/50 dark:bg-[#111] space-y-6">
        {TERMS_CONTENTS.map((term) => (
          <div key={term.id} className="group">
            <div className="flex items-center justify-between mb-2 px-1">
              <label 
                className={`text-xs font-bold ${term.required ? "text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}
              >
                {term.required ? "[필수]" : "[선택]"} {term.title}
              </label>
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                checked={termsAgreements[term.id]}
                onChange={(e) => handleToggle(term.id, e.target.checked)}
              />
            </div>

            {/* 약관 본문 영역: 화이트 스페이스 보존을 위해 whitespace-pre-wrap 적용 */}
            <div className="h-32 overflow-y-auto text-[11px] bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] rounded-xl p-3 leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap shadow-sm">
              {term.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsAgreementSection;