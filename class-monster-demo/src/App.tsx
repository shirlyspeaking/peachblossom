import { useEffect, useMemo, useRef, useState } from 'react';

type Student = {
  id: string;
  name: string;
  avatarUrl: string;
  score: number;
};

type Phase = 'idle' | 'spinning' | 'slowing' | 'finished';

const STORAGE_KEY = 'class_monster_demo_students';
const RULES_ADD_KEY = 'class_monster_demo_rules_add';
const RULES_DEDUCT_KEY = 'class_monster_demo_rules_deduct';
const DEFAULT_NAMES = ['小桃', '阿源', '春花', '青山', '白鹿', '星河', '阿竹', '小雲'];

const DEFAULT_RULES_ADD = `範例（可自行修改）：
• 主動回答 +2
• 作業准时完成 +1
• 協助同儕 +2`;

const DEFAULT_RULES_DEDUCT = `範例（可自行修改）：
• 遲到 −1
• 未帶指定用品 −1
• 影響課堂秩序 −2`;

function createId() {
  if ('crypto' in window && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseNames(input: string) {
  return input
    .split(/[\n,，、]/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function makeUniqueName(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}${n}`)) n += 1;
  return `${base}${n}`;
}

function studentsFromNames(parsed: string[]): Student[] {
  const taken = new Set<string>();
  return parsed.map((raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const finalName = makeUniqueName(trimmed, taken);
    taken.add(finalName);
    return {
      id: createId(),
      name: finalName,
      avatarUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(finalName)}`,
      score: 0,
    };
  }).filter(Boolean) as Student[];
}

function mergeNewStudents(existing: Student[], parsed: string[]): Student[] {
  const taken = new Set(existing.map((s) => s.name));
  const additions = parsed
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((trimmed) => {
      const finalName = makeUniqueName(trimmed, taken);
      taken.add(finalName);
      return {
        id: createId(),
        name: finalName,
        avatarUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(finalName)}`,
        score: 0,
      };
    });
  return [...existing, ...additions];
}

function normalizeStoredStudent(raw: unknown): Student | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.name !== 'string' || typeof o.avatarUrl !== 'string') return null;
  const score = typeof o.score === 'number' && Number.isFinite(o.score) ? o.score : 0;
  return { id: o.id, name: o.name, avatarUrl: o.avatarUrl, score };
}

function shuffleStudents(students: Student[]) {
  return [...students].sort(() => Math.random() - 0.5);
}

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [ruleAddText, setRuleAddText] = useState(DEFAULT_RULES_ADD);
  const [ruleDeductText, setRuleDeductText] = useState(DEFAULT_RULES_DEDUCT);
  const [singleNameInput, setSingleNameInput] = useState('');
  const [batchInput, setBatchInput] = useState(DEFAULT_NAMES.join('\n'));
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [pickCount, setPickCount] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [winners, setWinners] = useState<Student[]>([]);
  const [error, setError] = useState('');
  const timerRef = useRef<number | null>(null);
  const speedRef = useRef(55);

  const activeStudent = students[activeIndex] ?? students[0];
  const hasClass = students.length > 0;
  const batchParsedCount = useMemo(() => parseNames(batchInput).length, [batchInput]);

  useEffect(() => {
    const savedStudents = localStorage.getItem(STORAGE_KEY);
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents) as unknown[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const restored = parsed.map(normalizeStoredStudent).filter(Boolean) as Student[];
          if (restored.length > 0) {
            setStudents(restored);
            setBatchInput(restored.map((s) => s.name).join('\n'));
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const ra = localStorage.getItem(RULES_ADD_KEY);
    const rd = localStorage.getItem(RULES_DEDUCT_KEY);
    if (typeof ra === 'string' && ra.trim()) setRuleAddText(ra);
    if (typeof rd === 'string' && rd.trim()) setRuleDeductText(rd);
  }, []);

  useEffect(() => {
    if (students.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(RULES_ADD_KEY, ruleAddText);
  }, [ruleAddText]);

  useEffect(() => {
    localStorage.setItem(RULES_DEDUCT_KEY, ruleDeductText);
  }, [ruleDeductText]);

  useEffect(() => {
    if (phase !== 'spinning' && phase !== 'slowing') return undefined;

    const tick = () => {
      setActiveIndex((current) => (current + 1) % students.length);

      if (phase === 'slowing') {
        speedRef.current += 42;
      }

      if (phase === 'slowing' && speedRef.current > 410) {
        const selected = shuffleStudents(students).slice(0, pickCount);
        setWinners(selected);
        setPhase('finished');
        announceWinners(selected);
        return;
      }

      timerRef.current = window.setTimeout(tick, speedRef.current);
    };

    timerRef.current = window.setTimeout(tick, speedRef.current);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [phase, pickCount, students]);

  const replaceClassFromBatch = () => {
    const names = parseNames(batchInput);
    if (names.length === 0) {
      setError('清單中至少需要一位姓名。');
      return;
    }

    const nextStudents = studentsFromNames(names);
    setStudents(nextStudents);
    setPickCount(1);
    setActiveIndex(0);
    setWinners([]);
    setPhase('idle');
    setError('');
    setSelectedIds(new Set());
    setSelectionMode(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStudents));
  };

  const addSingleStudent = () => {
    const name = singleNameInput.trim();
    if (!name) {
      setError('請輸入姓名。');
      return;
    }
    setStudents((prev) => {
      const next = mergeNewStudents(prev, [name]);
      setBatchInput(next.map((s) => s.name).join('\n'));
      return next;
    });
    setSingleNameInput('');
    setError('');
    setWinners([]);
    setPhase('idle');
  };

  const addBatchStudents = () => {
    const names = parseNames(batchInput);
    if (names.length === 0) {
      setError('批量欄位中沒有有效姓名。');
      return;
    }
    setStudents((prev) => {
      const next = mergeNewStudents(prev, names);
      setBatchInput(next.map((s) => s.name).join('\n'));
      return next;
    });
    setError('');
    setWinners([]);
    setPhase('idle');
  };

  const removeStudent = (id: string) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== id);
      setBatchInput(next.map((s) => s.name).join('\n'));
      return next;
    });
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setWinners((w) => w.filter((s) => s.id !== id));
    setPhase('idle');
  };

  const toggleSelectStudent = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllStudents = () => {
    setSelectedIds(new Set(students.map((s) => s.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const deleteSelectedStudents = () => {
    if (selectedIds.size === 0) return;
    const ok = window.confirm(`確定要從班級移除選取的 ${selectedIds.size} 位同學嗎？`);
    if (!ok) return;
    const removeSet = selectedIds;
    setStudents((prev) => {
      const next = prev.filter((s) => !removeSet.has(s.id));
      setBatchInput(next.map((s) => s.name).join('\n'));
      return next;
    });
    setWinners((w) => w.filter((s) => !removeSet.has(s.id)));
    setSelectedIds(new Set());
    setPhase('idle');
    setSelectionMode(false);
  };

  const adjustScore = (id: string, delta: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, score: s.score + delta } : s))
    );
  };

  const resetClass = () => {
    window.speechSynthesis?.cancel();
    localStorage.removeItem(STORAGE_KEY);
    setStudents([]);
    setBatchInput(DEFAULT_NAMES.join('\n'));
    setPickCount(1);
    setWinners([]);
    setPhase('idle');
    setError('');
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const startRollCall = () => {
    if (!hasClass) return;
    speedRef.current = 55;
    setWinners([]);
    setPhase('spinning');
  };

  const stopRollCall = () => {
    if (phase !== 'spinning') return;
    setPhase('slowing');
  };

  const closeResult = () => {
    if (phase === 'finished') {
      setPhase('idle');
    }
  };

  const updatePickCount = (nextCount: number) => {
    const safeCount = Math.min(Math.max(nextCount, 1), Math.max(students.length, 1));
    setPickCount(safeCount);
  };

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">桃花源 · 課堂工具</p>
          <h1>芯芽</h1>
          <p className="hero-copy">
            建立名單、設定加分／扣分規則參考，並為每位同學記分。支援單人加入、批量加入、批次刪除與以清單覆蓋重建。
          </p>
        </div>
        <div className="hero-monster" aria-hidden="true">
          <XinyaSproutGlyph className="hero-sprout-glyph" />
        </div>
      </section>

      <section className="workspace">
        <aside className="setup-card">
          <div className="section-heading">
            <span>★</span>
            <div>
              <h2>加分 · 扣分規則</h2>
              <p>寫給全班看的說明，僅作參考，不會自動幫學生加減分。</p>
            </div>
          </div>

          <label className="field-label" htmlFor="rules-add">
            加分規則
          </label>
          <textarea
            id="rules-add"
            className="rules-textarea"
            value={ruleAddText}
            onChange={(e) => setRuleAddText(e.target.value)}
            placeholder="例如：舉手回答 +2"
          />

          <label className="field-label" htmlFor="rules-deduct">
            扣分規則
          </label>
          <textarea
            id="rules-deduct"
            className="rules-textarea rules-textarea--deduct"
            value={ruleDeductText}
            onChange={(e) => setRuleDeductText(e.target.value)}
            placeholder="例如：遲到 −1"
          />

          <div className="section-heading section-heading--spaced">
            <span>1</span>
            <div>
              <h2>學生姓名管理</h2>
              <p>單筆加入、批量加入，或在卡片上刪除。</p>
            </div>
          </div>

          <label className="field-label" htmlFor="single-name">
            單人加入
          </label>
          <div className="single-add-row">
            <input
              id="single-name"
              type="text"
              value={singleNameInput}
              onChange={(e) => setSingleNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSingleStudent()}
              placeholder="輸入姓名後按加入"
              maxLength={32}
            />
            <button className="inline-button" type="button" onClick={addSingleStudent}>
              加入
            </button>
          </div>

          <label className="field-label" htmlFor="batch-names">
            批量輸入（換行、逗號、頓號皆可）
          </label>
          <textarea
            id="batch-names"
            className="batch-textarea"
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            placeholder="小桃&#10;阿源&#10;春花"
          />

          <div className="input-meta">
            <span>清單中約 {batchParsedCount} 位姓名</span>
            {error && <strong>{error}</strong>}
          </div>

          <button className="secondary-button" type="button" onClick={addBatchStudents} disabled={!batchInput.trim()}>
            批量加入（追加到現有名單）
          </button>

          <button className="primary-button" type="button" onClick={replaceClassFromBatch}>
            以清單覆蓋重建班級
          </button>
          <p className="hint-text">覆蓋重建會重置所有同學的頭像與分數為 0。</p>

          {hasClass && (
            <button className="ghost-button" type="button" onClick={resetClass}>
              清空全班名單
            </button>
          )}
        </aside>

        <section className="class-board">
          <details className="rules-board-summary">
            <summary>加分／扣分規則（點開查看）</summary>
            <div className="rules-board-columns">
              <div>
                <strong>加分</strong>
                <pre className="rules-board-pre">{ruleAddText || '（尚未填寫）'}</pre>
              </div>
              <div>
                <strong>扣分</strong>
                <pre className="rules-board-pre rules-board-pre--deduct">{ruleDeductText || '（尚未填寫）'}</pre>
              </div>
            </div>
          </details>

          <div className="board-header">
            <div>
              <p className="eyebrow">Class Board</p>
              <h2>{hasClass ? `${students.length} 位同學` : '尚未建立班級'}</h2>
            </div>
            <label className="count-control">
              抽取
              <input
                type="number"
                min="1"
                max={Math.max(students.length, 1)}
                value={pickCount}
                disabled={!hasClass || phase === 'spinning' || phase === 'slowing'}
                onChange={(event) => updatePickCount(Number(event.target.value))}
              />
              位
            </label>
          </div>

          {hasClass && (
            <div className="bulk-actions-bar">
              <button
                type="button"
                className={selectionMode ? 'chip-button chip-button--active' : 'chip-button'}
                onClick={() => {
                  setSelectionMode((v) => !v);
                  setSelectedIds(new Set());
                }}
              >
                {selectionMode ? '結束批次選取' : '批次選取'}
              </button>
              {selectionMode && (
                <>
                  <button type="button" className="chip-button" onClick={selectAllStudents}>
                    全選
                  </button>
                  <button type="button" className="chip-button" onClick={clearSelection}>
                    清除勾選
                  </button>
                  <button
                    type="button"
                    className="chip-button chip-button--danger"
                    disabled={selectedIds.size === 0}
                    onClick={deleteSelectedStudents}
                  >
                    刪除選取（{selectedIds.size}）
                  </button>
                </>
              )}
            </div>
          )}

          {hasClass ? (
            <div className="student-grid">
              {students.map((student, index) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  isActive={phase !== 'idle' && student.id === activeStudent?.id}
                  isWinner={winners.some((winner) => winner.id === student.id)}
                  style={{ animationDelay: `${index * 35}ms` }}
                  selectionMode={selectionMode}
                  selected={selectedIds.has(student.id)}
                  onToggleSelect={() => toggleSelectStudent(student.id)}
                  onDelete={() => removeStudent(student.id)}
                  onAdjustScore={(delta) => adjustScore(student.id, delta)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>🎒</span>
              <p>左側加入學生後，這裡會出現每位同學的頭像卡片。</p>
            </div>
          )}
        </section>
      </section>

      <footer className="roll-call-bar">
        <div>
          <strong>{phase === 'idle' ? '準備開始點名' : phase === 'finished' ? '點名完成' : '點名進行中'}</strong>
          <span>{hasClass ? `目前將抽出 ${pickCount} 位` : '請先建立班級'}</span>
        </div>
        <button
          className={phase === 'spinning' ? 'danger-button' : 'primary-button'}
          type="button"
          disabled={!hasClass || phase === 'slowing'}
          onClick={phase === 'spinning' ? stopRollCall : startRollCall}
        >
          {phase === 'spinning' ? '停！' : phase === 'slowing' ? '鎖定中...' : '開始點名'}
        </button>
      </footer>

      {phase === 'finished' && (
        <div className="modal-backdrop" role="button" tabIndex={0} onClick={closeResult} onKeyDown={closeResult}>
          <div className="result-modal" onClick={(event) => event.stopPropagation()}>
            <p className="eyebrow">芯芽 · 點名結果</p>
            <h2>恭喜中選同學</h2>
            <div className="winner-grid">
              {winners.map((winner) => (
                <StudentCard
                  key={winner.id}
                  student={winner}
                  isWinner
                  size="large"
                  onDelete={() => {}}
                  onAdjustScore={() => {}}
                  hideControls
                />
              ))}
            </div>
            <button className="primary-button" type="button" onClick={closeResult}>
              回到班級
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function StudentCard({
  student,
  isActive = false,
  isWinner = false,
  size = 'normal',
  style,
  selectionMode = false,
  selected = false,
  onToggleSelect,
  onDelete,
  onAdjustScore,
  hideControls = false,
}: {
  student: Student;
  isActive?: boolean;
  isWinner?: boolean;
  size?: 'normal' | 'large';
  style?: React.CSSProperties;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
  onDelete: () => void;
  onAdjustScore: (delta: number) => void;
  hideControls?: boolean;
}) {
  return (
    <article
      className={`student-card ${isActive ? 'is-active' : ''} ${isWinner ? 'is-winner' : ''} ${selected ? 'is-selected' : ''} ${size}`}
      style={style}
    >
      {!hideControls && selectionMode && (
        <label className="card-select">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect?.()}
            aria-label={`選取 ${student.name}`}
          />
        </label>
      )}
      {!hideControls && (
        <button
          type="button"
          className="card-delete"
          aria-label={`刪除 ${student.name}`}
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`確定移除「${student.name}」嗎？`)) onDelete();
          }}
        >
          ×
        </button>
      )}
      <div className="avatar-ring">
        <img src={student.avatarUrl} alt={`${student.name} 的頭像`} />
      </div>
      <h3>{student.name}</h3>
      <div className={`score-badge ${student.score > 0 ? 'positive' : student.score < 0 ? 'negative' : ''}`}>
        積分 {student.score > 0 ? '+' : ''}
        {student.score}
      </div>
      {!hideControls && (
        <div className="card-score-actions">
          <button type="button" className="score-btn score-btn--minus" onClick={() => onAdjustScore(-1)}>
            −1
          </button>
          <button type="button" className="score-btn score-btn--plus" onClick={() => onAdjustScore(1)}>
            +1
          </button>
        </div>
      )}
    </article>
  );
}

function XinyaSproutGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 56"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path fill="currentColor" d="M19.5 26L17.5 51Q24 55.5 30.5 51L28.5 26Q24 22 19.5 26Z" />
      <path fill="currentColor" d="M24 27C9 25 0 12 10 4 14 0 22 10 23 18 23.5 22 24 25 24 27Z" />
      <path fill="currentColor" d="M24 27C39 25 48 12 38 4 34 0 26 10 25 18 24.5 22 24 25 24 27Z" />
      <circle fill="currentColor" cx="24" cy="26" r="3.2" opacity="0.9" />
    </svg>
  );
}

function announceWinners(selected: Student[]) {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const names = selected.map((student) => student.name).join('、');
  const utterance = new SpeechSynthesisUtterance(`恭喜 ${names} 同學`);
  utterance.lang = 'zh-TW';
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

export default App;
