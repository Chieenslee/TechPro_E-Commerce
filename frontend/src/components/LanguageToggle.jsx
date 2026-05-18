import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContextValue';

const LanguageToggle = ({ compact = false }) => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const isVietnamese = language === 'vi';

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={isVietnamese ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
      title={isVietnamese ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-outline-variant/70 bg-surface-container px-3 py-2 text-label-sm font-bold text-on-surface hover:border-primary hover:text-primary transition-colors btn-ripple ${
        compact ? 'shadow-lg shadow-black/20' : ''
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">translate</span>
      <span>{isVietnamese ? 'VI' : 'EN'}</span>
    </button>
  );
};

export default LanguageToggle;
