'use client';

import Link from 'next/link';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpLeft,
  AudioLines,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Expand,
  ExternalLink,
  Minimize,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { historyChapters, type HistoryChapter } from '@/lib/agent-history';

const total = historyChapters.length;
const pad = (n: number) => String(n).padStart(2, '0');

function ArchitectureDiagram({ chapter }: { chapter: HistoryChapter }) {
  const diagram = chapter.diagram;
  return (
    <figure
      className={`architecture architecture-${diagram.kind}`}
      aria-label={diagram.title}
    >
      <figcaption>
        <span>架构示意</span>
        <h2>{diagram.title}</h2>
      </figcaption>
      <div className="architecture-body">
        {diagram.support && (
          <div className="architecture-support">{diagram.support}</div>
        )}
        <div className="architecture-nodes">
          {diagram.nodes.map(([label, detail], i) => (
            <div className="architecture-step" key={label}>
              {i > 0 && diagram.kind !== 'parallel' && (
                <ArrowRight
                  className="architecture-arrow"
                  size={22}
                  aria-hidden="true"
                />
              )}
              <div className="architecture-node">
                <span className="node-number">{pad(i + 1)}</span>
                <strong>{label}</strong>
                <span>{detail}</span>
              </div>
            </div>
          ))}
        </div>
        {diagram.kind === 'parallel' && (
          <div className="architecture-relations">
            双向交接 · 返回结果与反馈
          </div>
        )}
        {diagram.branchLabel && (
          <div className="architecture-branch">
            <ArrowDown size={19} aria-hidden="true" />
            <span>{diagram.branchLabel}</span>
          </div>
        )}
        {diagram.returnLabel && (
          <div className="architecture-return">
            <ArrowUpLeft size={19} aria-hidden="true" />
            <span>{diagram.returnLabel}</span>
          </div>
        )}
      </div>
      <p className="architecture-caption">{diagram.caption}</p>
    </figure>
  );
}

export default function AgentHistory() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(45);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState(false);
  const [sources, setSources] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState('');
  const timelineRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const chapter = historyChapters[index];
  const last = index === total - 1;

  const resetElapsed = useCallback(() => {
    elapsedRef.current = 0;
    setElapsed(0);
  }, []);
  const navigate = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(total - 1, next)));
      resetElapsed();
      setPlaying(false);
    },
    [resetElapsed],
  );
  const togglePlay = useCallback(() => {
    if (!playing && last && elapsedRef.current >= duration) {
      setIndex(0);
      resetElapsed();
    }
    setPlaying((value) => !value);
  }, [playing, last, duration, resetElapsed]);
  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen)
        await document.documentElement.requestFullscreen();
      else setMessage('此浏览器不支持网页全屏，可使用浏览器菜单中的全屏。');
    } catch {
      setMessage('全屏未能开启，可使用浏览器菜单中的全屏。');
    }
  }, []);

  useEffect(() => {
    if (!playing || sources) return;
    const start = performance.now();
    const initial = elapsedRef.current;
    const timer = window.setInterval(() => {
      const next = Math.min(
        duration,
        initial + (performance.now() - start) / 1000,
      );
      elapsedRef.current = next;
      setElapsed(next);
      if (next >= duration) {
        clearInterval(timer);
        if (index < total - 1) {
          setIndex((i) => i + 1);
          resetElapsed();
        } else setPlaying(false);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [playing, index, duration, sources, resetElapsed]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        sources ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        target.closest(
          'input, textarea, select, [contenteditable="true"], [role="dialog"]',
        )
      )
        return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigate(index + 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigate(index - 1);
      }
      if (event.code === 'Space' && !target.closest('button, a')) {
        event.preventDefault();
        togglePlay();
      }
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        void toggleFullscreen();
      }
      if (event.key === 'Home') {
        event.preventDefault();
        navigate(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        navigate(total - 1);
      }
    };
    const onVisibility = () => {
      if (document.hidden) setPlaying(false);
    };
    const onFullscreen = () =>
      setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('fullscreenchange', onFullscreen);
    };
  }, [index, navigate, togglePlay, sources, toggleFullscreen]);

  useEffect(() => {
    const timeline = timelineRef.current;
    const active = timeline?.querySelector<HTMLElement>(
      '[aria-current="step"]',
    );
    if (timeline && active)
      timeline.scrollTo({
        left:
          active.offsetLeft - timeline.clientWidth / 2 + active.clientWidth / 2,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
  }, [index]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      className="history-app"
      style={{ '--chapter-count': total } as CSSProperties}
    >
      <header className="history-header">
        <Link className="history-brand" href="/" aria-label="返回课程目录">
          <span className="brand-symbol" aria-hidden="true">
            a.
          </span>
          <strong>第一章 · 技术架构演进</strong>
          <span className="brand-subtitle">Agent 技术课</span>
        </Link>
        <div className="header-actions">
          <Link className="course-back" href="/" aria-label="返回课程目录">
            <ChevronLeft size={17} />
            <span>课程目录</span>
          </Link>
          <button
            aria-label="参考资料"
            onClick={() => {
              setSources(true);
              setPlaying(false);
            }}
          >
            <BookOpen size={17} />
            <span>参考资料</span>
          </button>
          <button
            aria-label={fullscreen ? '退出全屏' : '全屏讲解'}
            onClick={() => void toggleFullscreen()}
            title="全屏（F）"
          >
            {fullscreen ? <Minimize size={17} /> : <Expand size={17} />}
            <span>{fullscreen ? '退出全屏' : '全屏讲解'}</span>
          </button>
        </div>
      </header>

      <main className="history-main">
        <div className="stage-meta">
          <span>{chapter.category}</span>
          <span>
            2023 — 2025 <i /> 技术架构演进
          </span>
        </div>
        <div className="history-stage" key={chapter.id}>
          <section
            className="history-narrative"
            aria-labelledby="chapter-title"
          >
            <div className="chapter-period">{chapter.period}</div>
            <h1 id="chapter-title">
              {chapter.title[0]}
              <br />
              <em>{chapter.title[1]}</em>
            </h1>
            <p className="chapter-description">{chapter.description}</p>
            <p className="chapter-milestone">{chapter.milestone}</p>
          </section>
          <ArchitectureDiagram chapter={chapter} />
        </div>
        <div className="chapter-explanation">
          <section>
            <span>原来的问题</span>
            <p>{chapter.problem}</p>
          </section>
          <section className="explanation-advance">
            <span>新增的能力</span>
            <p>{chapter.advance}</p>
          </section>
          <section>
            <span>仍然存在的边界</span>
            <p>{chapter.boundary}</p>
          </section>
        </div>
        <div className="chapter-takeaway" aria-live="polite">
          <span>记住这一句</span>
          <p>{chapter.takeaway}</p>
        </div>
        {notes && (
          <aside className="speaker-note">
            <strong>
              <AudioLines size={16} />
              讲解提示
            </strong>
            <p>{chapter.note}</p>
          </aside>
        )}
      </main>

      <nav className="history-timeline" aria-label="Agent 技术演进时间轴">
        <div className="timeline-heading">
          <strong>演进时间轴</strong>
          <span>点击小节跳转 · 按小节等距排列</span>
        </div>
        <div className="timeline-scroll" ref={timelineRef}>
          <div className="timeline-track">
            <div className="timeline-line">
              <span style={{ width: `${(index / (total - 1)) * 100}%` }} />
            </div>
            {historyChapters.map((item, i) => (
              <button
                key={item.id}
                onClick={() => navigate(i)}
                aria-label={`${item.year}，${item.label}`}
                aria-current={index === i ? 'step' : undefined}
                className={`time-stop${i < index ? ' visited' : ''}${i === index ? ' active' : ''}`}
              >
                <span className="timeline-year">{item.year}</span>
                <span className="timeline-dot" />
                <span className="timeline-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <footer className="history-controls">
        <div className="control-left">
          <button
            onClick={() => navigate(0)}
            aria-label="回到总览"
            title="回到总览"
          >
            <RotateCcw size={17} />
          </button>
          <span className="chapter-count">
            {pad(index + 1)} <span>/ {pad(total)}</span>
          </span>
          <span className="keyboard-hint">
            <kbd>←</kbd>
            <kbd>→</kbd> 切换小节
          </span>
        </div>
        <div className="transport">
          <button
            disabled={index === 0}
            onClick={() => navigate(index - 1)}
            aria-label="上一节"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            className="play-button"
            onClick={togglePlay}
            title="空格播放 / 暂停"
            aria-label={playing ? '暂停自动播放' : '开始自动播放'}
          >
            {playing ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            <span>
              {playing
                ? '暂停播放'
                : last && elapsed >= duration
                  ? '重新播放'
                  : '自动播放'}
            </span>
          </button>
          <button
            disabled={last}
            onClick={() => navigate(index + 1)}
            aria-label="下一节"
          >
            <ChevronRight size={22} />
          </button>
        </div>
        <div className="control-right">
          <button
            onClick={() => {
              setDuration((value) =>
                value === 30 ? 45 : value === 45 ? 60 : 30,
              );
              resetElapsed();
            }}
            title="切换每节播放时长"
          >
            {duration} 秒 / 节
          </button>
          <button
            className={notes ? 'selected' : ''}
            aria-pressed={notes}
            onClick={() => setNotes((value) => !value)}
          >
            <AudioLines size={17} />
            <span>讲解提示</span>
          </button>
        </div>
        <progress
          className="playback-progress"
          aria-label="当前小节播放进度"
          max={duration}
          value={Math.min(duration, elapsed)}
        />
      </footer>
      {message && <output className="history-toast">{message}</output>}
      <Dialog open={sources} onOpenChange={setSources}>
        <DialogContent className="history-source-dialog">
          <DialogHeader>
            <DialogTitle>技术节点与原始资料</DialogTitle>
            <DialogDescription>
              以 2023 年春 Auto-GPT 热潮为叙事起点，回溯必要的技术来源，讲至
              2025
              年末的长任务实践。日期对应论文、公告或代表性版本，不代表能力首次出现；各条技术路线并行发展。
            </DialogDescription>
          </DialogHeader>
          <div className="source-list">
            {historyChapters.map((item) => (
              <section key={item.id}>
                <h3>
                  <span>{item.year}</span>
                  {item.label}
                </h3>
                {item.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {source.title}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </section>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
