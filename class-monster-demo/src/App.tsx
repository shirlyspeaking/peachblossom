import { useEffect, useMemo, useRef, useState } from 'react';

type Student = {
  id: string;
  name: string;
  avatarUrl: string;
};

type Phase = 'idle' | 'spinning' | 'slowing' | 'finished';

const STORAGE_KEY = 'class_monster_demo_students';
const DEFAULT_NAMES = ['小桃', '阿源', '春花', '青山', '白鹿', '星河', '阿竹', '小雲'];

function createId() {
  if ('crypto' in window && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createStudents(rawNames: string[]): Student[] {
  const nameCounts = new Map<string, number>();

  return rawNames.map((name) => {
    const baseName = name.trim();
    const currentCount = (nameCounts.get(baseName) ?? 0) + 1;
    nameCounts.set(baseName, currentCount);

    const finalName = currentCount > 1 ? `${baseName}${currentCount}` : baseName;

    return {
      id: createId(),
      name: finalName,
      avatarUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(finalName)}`
    };
  });
}

function parseNames(input: string) {
  return input
    .split(/[\n,，、]/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function shuffleStudents(students: Student[]) {
  return [...students].sort(() => Math.random() - 0.5);
}

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [namesInput, setNamesInput] = useState(DEFAULT_NAMES.join('\n'));
  const [pickCount, setPickCount] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [winners, setWinners] = useState<Student[]>([]);
  const [error, setError] = useState('');
  const timerRef = useRef<number | null>(null);
  const speedRef = useRef(55);

  const activeStudent = students[activeIndex] ?? students[0];
  const hasClass = students.length > 0;
  const parsedNameCount = useMemo(() => parseNames(namesInput).length, [namesInput]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const restoredStudents = JSON.parse(saved) as Student[];
      if (Array.isArray(restoredStudents) && restoredStudents.length > 0) {
        setStudents(restoredStudents);
        setNamesInput(restoredStudents.map((student) => student.name).join('\n'));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

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

  const generateClass = () => {
    const names = parseNames(namesInput);
    if (names.length === 0) {
      setError('請至少輸入一位學生。');
      return;
    }

    const nextStudents = createStudents(names);
    setStudents(nextStudents);
    setPickCount(1);
    setActiveIndex(0);
    setWinners([]);
    setPhase('idle');
    setError('');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStudents));
  };

  const resetClass = () => {
    window.speechSynthesis?.cancel();
    localStorage.removeItem(STORAGE_KEY);
    setStudents([]);
    setNamesInput(DEFAULT_NAMES.join('\n'));
    setPickCount(1);
    setWinners([]);
    setPhase('idle');
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
          <p className="eyebrow">Demo only · 不會部署到桃花源</p>
          <h1>班級小怪獸點名</h1>
          <p className="hero-copy">
            先用獨立 Demo 做出「輸入名單 → 生成怪獸卡 → 隨機點名」的互動感，再決定要不要整合到桃花源。
          </p>
        </div>
        <div className="hero-monster" aria-hidden="true">
          👾
        </div>
      </section>

      <section className="workspace">
        <aside className="setup-card">
          <div className="section-heading">
            <span>1</span>
            <div>
              <h2>建立班級</h2>
              <p>可用換行、逗號或頓號分隔姓名。</p>
            </div>
          </div>

          <textarea
            value={namesInput}
            onChange={(event) => setNamesInput(event.target.value)}
            placeholder="小桃&#10;阿源&#10;春花"
          />

          <div className="input-meta">
            <span>{parsedNameCount} 位姓名</span>
            {error && <strong>{error}</strong>}
          </div>

          <button className="primary-button" type="button" onClick={generateClass}>
            生成班級怪獸
          </button>

          {hasClass && (
            <button className="ghost-button" type="button" onClick={resetClass}>
              清空 Demo 名單
            </button>
          )}
        </aside>

        <section className="class-board">
          <div className="board-header">
            <div>
              <p className="eyebrow">Class Board</p>
              <h2>{hasClass ? `${students.length} 位小怪獸同學` : '尚未建立班級'}</h2>
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

          {hasClass ? (
            <div className="student-grid">
              {students.map((student, index) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  isActive={phase !== 'idle' && student.id === activeStudent?.id}
                  isWinner={winners.some((winner) => winner.id === student.id)}
                  style={{ animationDelay: `${index * 35}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>🎒</span>
              <p>左邊輸入名單後，這裡會出現每位同學的小怪獸卡片。</p>
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
            <p className="eyebrow">Lucky Monsters</p>
            <h2>恭喜中選同學</h2>
            <div className="winner-grid">
              {winners.map((winner) => (
                <StudentCard key={winner.id} student={winner} isWinner size="large" />
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
  style
}: {
  student: Student;
  isActive?: boolean;
  isWinner?: boolean;
  size?: 'normal' | 'large';
  style?: React.CSSProperties;
}) {
  return (
    <article className={`student-card ${isActive ? 'is-active' : ''} ${isWinner ? 'is-winner' : ''} ${size}`} style={style}>
      <div className="avatar-ring">
        <img src={student.avatarUrl} alt={`${student.name} 的小怪獸頭像`} />
      </div>
      <h3>{student.name}</h3>
    </article>
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
