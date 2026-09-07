'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Box, BrainCircuit, Check, CheckCheck, ChevronLeft, ChevronRight, CircleHelp, Code2, Compass, Expand, ExternalLink, Focus, Layers3, Lightbulb, ListTree, MousePointer2, Pause, Play, RotateCcw, RotateCw, ScanLine, ShieldCheck, Sparkles, Terminal, ZoomIn, ZoomOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { lessons, sources, TOTAL_STEPS, clampStep, stepPosition } from '@/lib/agent-content';
import AgentScene, { type SceneCommand } from '@/components/agent-scene';

const pad = (n: number) => String(n).padStart(2, '0');

export default function AgentExplorer() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [exploded, setExploded] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [labels, setLabels] = useState(true);
  const [tab, setTab] = useState('lesson');
  const [help, setHelp] = useState(false);
  const [finished, setFinished] = useState(false);
  const [command, setCommand] = useState<SceneCommand | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { chapter, point } = stepPosition(step);
  const lesson = lessons[chapter];
  const progress = Math.round(step / (TOTAL_STEPS - 1) * 100);
  const navigate = useCallback((next: number, pause = true) => { setStep(clampStep(next)); setFinished(false); if (pause) setPlaying(false); }, []);
  const jumpToChapter = useCallback((index: number) => { navigate(index * 3); setTab('lesson'); }, [navigate]);
  const advance = useCallback(() => {
    if (step === TOTAL_STEPS - 1) { setPlaying(false); setFinished(true); }
    else navigate(step + 1, false);
  }, [step, navigate]);
  const togglePlaying = useCallback(() => {
    if (finished) { setFinished(false); setStep(0); }
    setPlaying(p => !p);
  }, [finished]);
  useEffect(() => {
    if (!playing || help) return;
    const timer = setTimeout(advance, 16000 / speed);
    return () => clearTimeout(timer);
  }, [playing, step, speed, help, advance]);
  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 0;
  }, [chapter, tab]);
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || tab !== 'lesson' || point === 0 || panel.scrollHeight <= panel.clientHeight) return;
    const active = panel.querySelector<HTMLElement>('.knowledge-step.current');
    if (!active) return;
    const top = active.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
    panel.scrollTo({ top: Math.max(0, top - 20), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [step, point, tab]);
  useEffect(() => {
    const element = chapterRefs.current[chapter];
    if (!element) return;
    const parent = element.parentElement;
    if (parent) parent.scrollTo({ left: Math.max(0, element.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 + element.clientWidth / 2), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [chapter]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (help || target.closest('button, input, textarea, select, [role="slider"], [role="tab"], [contenteditable="true"]') || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.code === 'ArrowRight') { event.preventDefault(); navigate(step + 1); }
      if (event.code === 'ArrowLeft') { event.preventDefault(); navigate(step - 1); }
      if (event.code === 'Space') { event.preventDefault(); togglePlaying(); }
    };
    const visibility = () => { if (document.hidden) setPlaying(false); };
    window.addEventListener('keydown', handler); document.addEventListener('visibilitychange', visibility);
    return () => { window.removeEventListener('keydown', handler); document.removeEventListener('visibilitychange', visibility); };
  }, [step, help, navigate, togglePlaying]);
  const sceneCommand = (type: SceneCommand['type']) => setCommand({ type, id: Date.now() });

  return <main className="explorer" style={{ '--lesson-color': lesson.color } as CSSProperties}>
    <header className="app-header">
      <a href="/" className="brand" aria-label="Agent Atlas 首页"><span className="brand-mark"><Box size={23} strokeWidth={1.4} /></span><span>Agent<span className="brand-light">Atlas</span><small>智能体解剖室</small></span></a>
      <div className="header-breadcrumb"><span>AI 知识实验室</span><ChevronRight size={13}/><strong>从内部理解 Agent</strong></div>
      <div className="header-actions"><span className="local-badge"><i/>本地交互课堂</span><button className="icon-button" title="操作指南" aria-label="操作指南" onClick={() => setHelp(true)}><CircleHelp size={19}/></button></div>
    </header>

    <div className="workbench">
      <section className="model-panel" aria-label="Agent 三维架构探索">
        <div className="scene-heading"><div className="eyebrow"><span className="mini-line"/> ANATOMY OF AN AGENT</div><h1>走进 Agent 的内部<span>。</span></h1><p>一个模型，如何成为一个能够行动的系统。</p></div>
        <div className="scene-status"><i/><span>{lesson.part === 'all' ? '整体架构' : lesson.short}</span><span className="status-divider"/>3D LIVE</div>
        <AgentScene active={lesson.part} exploded={exploded} rotate={rotate} labels={labels} command={command} onSelect={jumpToChapter}/>
        <div className="model-mode"><button className={!exploded ? 'is-selected' : ''} onClick={() => setExploded(false)} aria-pressed={!exploded}><Box size={15}/>整体视图</button><button className={exploded ? 'is-selected' : ''} onClick={() => setExploded(true)} aria-pressed={exploded}><Expand size={15}/>拆解视图</button></div>
        <div className="scene-tools" aria-label="模型控制">
          <button className="icon-button" onClick={() => sceneCommand('in')} aria-label="放大模型" title="放大"><ZoomIn size={18}/></button>
          <button className="icon-button" onClick={() => sceneCommand('out')} aria-label="缩小模型" title="缩小"><ZoomOut size={18}/></button>
          <span/>
          <button className={`icon-button ${rotate ? 'is-selected' : ''}`} onClick={() => setRotate(!rotate)} aria-label="自动旋转" aria-pressed={rotate} title="自动旋转"><RotateCw size={17}/></button>
          <button className={`icon-button ${labels ? 'is-selected' : ''}`} onClick={() => setLabels(!labels)} aria-label="显示部件标签" aria-pressed={labels} title="显示标签"><ScanLine size={17}/></button>
          <button className="icon-button" onClick={() => { sceneCommand('reset'); setExploded(false); setRotate(false); }} aria-label="重置视角" title="重置视角"><Focus size={18}/></button>
        </div>
        <button className={`guardrail-label ${chapter === 11 ? 'is-selected' : ''}`} onClick={() => jumpToChapter(11)}><ShieldCheck size={14}/>安全与运行边界<span>贯穿全过程</span></button>
        <div className="scene-bottom"><div className="scene-hint"><MousePointer2 size={14}/><span>拖动旋转<span className="hint-separator">·</span>滚轮缩放<span className="hint-separator">·</span>点击部件探索</span></div><span className="model-note">概念架构模型</span></div>
        <div className="axis" aria-hidden="true"><span className="axis-y">Y</span><span className="axis-x">X</span><span className="axis-z">Z</span><i/><b/><em/></div>
      </section>

      <aside className="lesson-panel" aria-label="逐步讲解">
        <div className="lesson-panel-top"><span><BookOpen size={16}/>探索指南</span><span className="chapter-counter">{pad(chapter + 1)}<span> / {lessons.length}</span></span></div>
        <Tabs value={tab} onValueChange={value => setTab(String(value))} className="lesson-tabs">
          <TabsList className="lesson-tab-list" variant="line"><TabsTrigger value="lesson"><ListTree size={15}/>逐步讲解</TabsTrigger><TabsTrigger value="example"><Terminal size={15}/>运行案例</TabsTrigger><TabsTrigger value="details"><Code2 size={15}/>深入理解</TabsTrigger></TabsList>
          <div className="lesson-scroll" ref={panelRef}>
            <div className="lesson-title" key={chapter}><div className="eyebrow">CHAPTER {pad(chapter + 1)}<span> / </span>{lesson.en}</div><h2>{lesson.title}</h2><p>{lesson.description}</p></div>
            <TabsContent value="lesson" className="lesson-content">
              <div className="lesson-steps">{lesson.steps.map((item, i) => <button className={`knowledge-step ${i === point ? 'current' : ''} ${i < point ? 'past' : ''}`} key={item.title} onClick={() => navigate(chapter * 3 + i)} aria-current={i === point ? 'step' : undefined}>
                <span className="step-dot">{i < point ? <Check size={13}/> : pad(i + 1)}</span><span className="knowledge-copy"><strong>{item.title}</strong><span>{item.text}</span>{i === point && <span className="reading-label"><span/>正在探索</span>}</span>
              </button>)}</div>
              <div className="analogy-card"><Lightbulb size={18}/><div><span>换个角度理解</span><p>{lesson.analogy}</p></div></div>
              <div className="flow-strip"><div><span>输入</span><p>{lesson.input}</p></div><ArrowDown size={16}/><div><span>输出</span><p>{lesson.output}</p></div></div>
              <button className="inline-link" onClick={() => setTab('example')}>看看这个部件如何参与销售分析<ArrowRight size={15}/></button>
            </TabsContent>
            <TabsContent value="example" className="example-content">
              <div className="simulation-label"><i/>教学模拟<span>无外部调用</span></div>
              <div className="example-terminal"><div className="terminal-title"><Terminal size={15}/><span>{lesson.example.title}</span></div>{lesson.example.lines.map((line, i) => <div className="terminal-line" key={line}><span>{pad(i + 1)}</span><p>{line}</p></div>)}</div>
              <div className="result-card"><Sparkles size={18}/><div><strong>这一步的结果</strong><p>{lesson.example.result}</p></div></div>
              {chapter >= 8 && <div className="sales-chart"><div><strong>销售额对比</strong><span>教学数据 · 万元</span></div><div className="chart-row"><span>7 月</span><div><i style={{ width: '100%' }}/></div><b>100</b></div><div className="chart-row"><span>8 月</span><div><i style={{ width: '88%' }}/></div><b>88</b></div><p>环比变化 <strong>−12%</strong><span>线上 −15 / 线下 +3</span></p></div>}
              <div className="mini-flow"><span>目标</span><ChevronRight size={12}/><span className="active">{lesson.short}</span><ChevronRight size={12}/><span>下一步</span></div>
            </TabsContent>
            <TabsContent value="details" className="details-content">
              <div className="code-card"><div><Code2 size={14}/>概念伪代码</div><pre><code>{lesson.code}</code></pre></div>
              <Accordion defaultValue={[lesson.details[0].title]} className="detail-accordion" key={chapter}>{lesson.details.map(item => <AccordionItem value={item.title} key={item.title}><AccordionTrigger>{item.title}</AccordionTrigger><AccordionContent><p>{item.text}</p></AccordionContent></AccordionItem>)}</Accordion>
              <div className="takeaway"><BrainCircuit size={19}/><p>{lesson.takeaway}</p></div>
              <div className="sources"><span>延伸阅读 · 一手资料</span>{sources.map(source => <a key={source.href} href={source.href} target="_blank" rel="noreferrer"><span>{source.label}<small>{source.author}</small></span><ExternalLink size={13}/></a>)}</div>
            </TabsContent>
          </div>
        </Tabs>
        <div className="lesson-panel-bottom"><div className="lesson-dots">{[0,1,2].map(i => <button key={i} className={point === i ? 'active' : ''} onClick={() => navigate(chapter * 3 + i)} aria-label={`本章知识点 ${i + 1}`} aria-current={point === i ? 'step' : undefined}/>)}</div><span>本章知识点 {point + 1} / 3</span><button onClick={() => { setPlaying(false); advance(); }} className="next-point">{step === TOTAL_STEPS - 1 ? '完成学习' : '下一步'}<ArrowRight size={16}/></button></div>
      </aside>
    </div>

    <footer className="course-player" aria-label="课程总体进度">
      <div className="player-top"><div className="player-controls"><button className="icon-button" disabled={step === 0} onClick={() => navigate(step - 1)} aria-label="上一个知识点"><ChevronLeft size={20}/></button><button className="play-button" onClick={togglePlaying} aria-label={playing ? '暂停自动讲解' : '开始自动讲解'} title={playing ? '暂停讲解 · 空格' : '自动讲解 · 空格'}>{playing ? <Pause size={19} fill="currentColor"/> : <Play size={19} fill="currentColor"/>}</button><button className="icon-button" disabled={finished} onClick={() => { setPlaying(false); advance(); }} aria-label="下一个知识点"><ChevronRight size={20}/></button></div><div className="now-playing"><strong>{playing ? '自动讲解中' : finished ? '探索完成' : '跟随讲解，逐步探索'}</strong><span>{pad(chapter + 1)} · {lesson.short}<i/>知识点 {pad(step + 1)} / {TOTAL_STEPS}</span></div><div className="player-options"><button className="speed-button" onClick={() => setSpeed(speed === 1 ? 1.5 : speed === 1.5 ? .5 : 1)} title={`每个知识点停留 ${16 / speed} 秒，点击切换速度`} aria-label={`讲解速度 ${speed} 倍，点击切换`}>{speed}×<span>速度</span></button><button className="icon-button" aria-label="从头学习" title="从头学习" onClick={() => navigate(0)}><RotateCcw size={16}/></button><div className="total-progress"><span>总体进度</span><strong>{progress}<small>%</small></strong></div></div></div>
      <div className="timeline"><span className="sr-only" id="course-position-label">总体学习进度：第 {chapter + 1} 章，{lesson.short}，本章知识点 {point + 1}，共 42 个知识点</span><Slider value={[step + 1]} min={1} max={TOTAL_STEPS} step={1} onValueChange={value => navigate((Array.isArray(value) ? value[0] : value) - 1)} aria-labelledby="course-position-label"/></div>
      <nav className="chapter-track" aria-label="课程章节">{lessons.map((item, i) => <button key={item.short} ref={element => { chapterRefs.current[i] = element; }} className={`chapter-stop ${i === chapter ? 'active' : ''} ${i < chapter ? 'past' : ''}`} onClick={() => jumpToChapter(i)} aria-current={i === chapter ? 'step' : undefined}><span>{i < chapter ? <Check size={11}/> : pad(i + 1)}</span><strong>{item.short}</strong></button>)}</nav>
    </footer>

    <Dialog open={help} onOpenChange={setHelp}><DialogContent className="help-dialog"><DialogHeader><DialogTitle><Compass size={22}/>探索指南</DialogTitle><DialogDescription>按照讲解逐步学习，或者自由拆解这个 Agent。</DialogDescription></DialogHeader><div className="help-grid"><div><MousePointer2/><strong>操作 3D 模型</strong><p>按住并拖动旋转，滚轮缩放。触摸屏可单指旋转、双指缩放。点击部件或标签，跳转到对应章节。</p></div><div><Layers3/><strong>切换观察方式</strong><p>“拆解视图”展开各个部件。右侧工具栏可以开关标签、自动旋转和重置视角。</p></div><div><BookOpen/><strong>按自己的节奏学习</strong><p>14 章、42 个知识点。通过讲解、案例与深入理解三个面板，逐层理解一个部件。</p></div><div><Play/><strong>播放与跳转</strong><p>自动讲解默认每个知识点停留 16 秒，无语音。底部进度条可拖动，也可以直接点击章节。</p></div></div><div className="keyboard-help"><span><kbd>←</kbd><kbd>→</kbd>切换知识点</span><span><kbd>Space</kbd>播放 / 暂停</span></div><p className="help-note">模型是软件架构的概念展示；案例均为模拟数据，不会调用真实模型或外部工具。</p></DialogContent></Dialog>
    <Dialog open={finished} onOpenChange={setFinished}><DialogContent className="finish-dialog"><div className="finish-icon"><CheckCheck size={30}/></div><DialogHeader><DialogTitle>你已走过 Agent 的完整闭环</DialogTitle><DialogDescription>14 个章节，42 个知识点。从目标到行动，再从反馈回到决策。</DialogDescription></DialogHeader><p>模型 + 上下文 + 工具 + 受控循环</p><button className="finish-action" onClick={() => { setFinished(false); navigate(0); }}>回到全景，再看一遍<ArrowRight size={16}/></button></DialogContent></Dialog>
  </main>;
}
