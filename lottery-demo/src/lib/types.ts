export type Person = {
  id: string;
  name: string;
};

export type DrawPhase = 'idle' | 'playing' | 'revealing' | 'finished';

export type UiTheme = 'claw' | 'wheel' | 'lot' | 'petal' | 'blindbox';

export type DrawHistoryEntry = {
  id: string;
  at: number;
  winners: Person[];
  theme: UiTheme;
};

export type ThemeViewProps = {
  items: Person[];
  remaining: Person[];
  phase: DrawPhase;
  pendingWinners: Person[];
  drawCount: number;
  onRequestStart: () => void;
  onRevealDone: () => void;
};

export const THEME_OPTIONS: { id: UiTheme; label: string; icon: string }[] = [
  { id: 'wheel', label: '轉盤', icon: 'fa-dharmachakra' },
  { id: 'lot', label: '竹籤', icon: 'fa-scroll' },
  { id: 'petal', label: '花瓣', icon: 'fa-spa' },
  { id: 'blindbox', label: '盲盒', icon: 'fa-gift' },
  { id: 'claw', label: '娃娃機', icon: 'fa-hand' },
];
