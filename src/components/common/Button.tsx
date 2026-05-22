import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyle = "rounded-2xl text-[0.65rem] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 outline-none active:scale-95";
  
  let variantStyle = "";
  switch(variant) {
    case 'primary':
      variantStyle = "bg-black dark:bg-white text-white dark:text-black shadow-xl shadow-black/5 dark:shadow-white/5 hover:opacity-90";
      break;
    case 'danger':
      variantStyle = "bg-rose-500 text-white shadow-xl shadow-rose-500/10 hover:bg-rose-600";
      break;
    case 'outline':
      variantStyle = "bg-transparent border border-gray-100 dark:border-[#1a1a1a] text-gray-500 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white";
      break;
    case 'secondary':
      variantStyle = "bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#27272a]";
      break;
  }

  return (
    <button className={`${baseStyle} ${variantStyle} py-4 px-8 ${className}`} {...props}>
      {children}
    </button>
  );
}
