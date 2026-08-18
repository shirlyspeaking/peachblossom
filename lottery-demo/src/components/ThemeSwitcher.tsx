import type { UiTheme } from '../lib/types';
import { THEME_OPTIONS } from '../lib/types';

type Props = {
  value: UiTheme;
  onChange: (theme: UiTheme) => void;
};

export function ThemeSwitcher({ value, onChange }: Props) {
  return (
    <div className="theme-switcher" role="tablist" aria-label="抽籤介面">
      {THEME_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={value === opt.id}
          className={`theme-chip ${value === opt.id ? 'is-active' : ''}`}
          onClick={() => onChange(opt.id)}
        >
          <i className={`fa-solid ${opt.icon}`} aria-hidden="true" />
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
