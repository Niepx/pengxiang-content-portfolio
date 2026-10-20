import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Maximize2, Play, X } from 'lucide-react';
import { PortfolioProject } from './data';
import './project-02-case.css';

type RenderMedia = (id: string, className?: string, autoPreview?: boolean) => ReactNode;
type Props = { project: PortfolioProject; renderMedia: RenderMedia };
type LightboxCopy = { label?: string; title?: string; body?: string; keywords?: string };
type LightboxState = { ids: string[]; index: number; copy?: LightboxCopy[] } | null;
type GalleryState = {
  type: 'circular' | 'accordion';
  ids: string[];
  title: string;
  copy?: LightboxCopy[];
} | null;

const ease = [0.16, 1, 0.3, 1] as const;
const wrap = (value: number, length: number) => (value + length) % length;

function Enter({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0.35, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduce ? 0 : 0.7, ease }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({
  number,
  english,
  chinese,
  title,
  intro,
}: {
  number: string;
  english: string;
  chinese: string;
  title: ReactNode;
  intro?: string;
}) {
  return (
    <header className="p02-head">
      <div className="p02-head__marker">
        <b>{number}</b>
        <span>{english}</span>
        <small>{chinese}</small>
      </div>
      <div className="p02-head__copy">
        <h2>{title}</h2>
        {intro && <p>{intro}</p>}
      </div>
    </header>
  );
}

function Media({
  id,
  renderMedia,
  title,
  label,
  onOpen,
  video = false,
  className = '',
}: {
  id: string;
  renderMedia: RenderMedia;
  title: string;
  label: string;
  onOpen: () => void;
  video?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | null>(null);
  const resetPreview = () => {
    if (timer.current) window.clearTimeout(timer.current);
    const player = ref.current?.querySelector('video');
    if (player) {
      player.pause();
      player.currentTime = 0;
    }
  };
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  return (
    <button
      ref={ref}
      type="button"
      className={`p02-media ${video ? 'is-video' : ''} ${className}`}
      onClick={onOpen}
      onMouseEnter={() => {
        if (!video || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(resetPreview, 3200);
      }}
      onMouseLeave={() => video && resetPreview()}
      aria-label={`${video ? '播放' : '查看'} ${title}`}
    >
      {renderMedia(id)}
      <span className="p02-media__control">
        {video ? <><Play size={15} fill="currentColor" /> PLAY</> : <><Maximize2 size={15} /> VIEW</>}
      </span>
      <span className="p02-media__caption"><small>{label}</small><strong>{title}</strong></span>
    </button>
  );
}

function Lightbox({ project, renderMedia, state, setState, onClose }: Props & {
  state: NonNullable<LightboxState>;
  setState: (next: LightboxState) => void;
  onClose: () => void;
}) {
  const item = project.media.find(media => media.id === state.ids[state.index]);
  const copy = state.copy?.[state.index];
  const move = (delta: number) => setState({ ...state, index: wrap(state.index + delta, state.ids.length) });

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });

  if (!item) return null;
  return (
    <motion.div className="p02-lightbox" role="dialog" aria-modal="true" aria-label={copy?.title || item.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onPointerDown={onClose}>
      <button type="button" className="p02-close" onClick={onClose} aria-label="关闭"><X /></button>
      {state.ids.length > 1 && <button type="button" className="p02-arrow is-left" onClick={event => { event.stopPropagation(); move(-1); }} aria-label="上一项"><ArrowLeft /></button>}
      <div className="p02-lightbox__panel" onPointerDown={event => event.stopPropagation()}>
        <div className="p02-lightbox__media">
          {item.kind === 'video' && item.src
            ? <video key={item.src} src={item.src} poster={item.poster} controls autoPlay playsInline />
            : item.kind === 'image' && item.src
              ? <img src={item.src} alt={copy?.title || item.title} />
              : renderMedia(item.id)}
        </div>
        <footer>
          <div><span>{copy?.label || item.type}</span><h3>{copy?.title || item.title}</h3></div>
          <div className="p02-lightbox__description">{copy?.body && <p>{copy.body}</p>}{copy?.keywords && <small>{copy.keywords}</small>}</div>
          <small>{String(state.index + 1).padStart(2, '0')} / {String(state.ids.length).padStart(2, '0')}</small>
        </footer>
      </div>
      {state.ids.length > 1 && <button type="button" className="p02-arrow is-right" onClick={event => { event.stopPropagation(); move(1); }} aria-label="下一项"><ArrowRight /></button>}
    </motion.div>
  );
}

function Gallery({ gallery, renderMedia, onClose, onOpen, paused }: {
  gallery: NonNullable<GalleryState>;
  renderMedia: RenderMedia;
  onClose: () => void;
  onOpen: (ids: string[], index?: number, copy?: LightboxCopy[]) => void;
  paused: boolean;
}) {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, left: 0, moved: false, index: -1 });
  const raf = useRef<number | null>(null);

  const scrollTo = (index: number) => {
    const next = wrap(index, gallery.ids.length);
    setActive(next);
    stageRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const syncNearest = () => {
    if (gallery.type !== 'circular' || !stageRef.current) return active;
    const stageCenter = stageRef.current.getBoundingClientRect().left + stageRef.current.clientWidth / 2;
    const children = Array.from(stageRef.current.children) as HTMLElement[];
    let nearest = active;
    let distance = Number.POSITIVE_INFINITY;
    children.forEach((child, index) => {
      const box = child.getBoundingClientRect();
      const nextDistance = Math.abs(box.left + box.width / 2 - stageCenter);
      if (nextDistance < distance) {
        distance = nextDistance;
        nearest = index;
      }
    });
    setActive(nearest);
    return nearest;
  };

  useEffect(() => {
    if (paused) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') scrollTo(active - 1);
      if (event.key === 'ArrowRight') scrollTo(active + 1);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [active, paused]);

  useEffect(() => () => { if (raf.current) window.cancelAnimationFrame(raf.current); }, []);

  return (
    <motion.div className={`p02-gallery is-${gallery.type}`} role="dialog" aria-modal="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <header>
        <div><span>{gallery.type === 'circular' ? 'CIRCULAR GALLERY' : 'DETAIL PAGES'}</span><h3>{gallery.title}</h3></div>
        <small>{String(active + 1).padStart(2, '0')} / {String(gallery.ids.length).padStart(2, '0')}</small>
        <button type="button" onClick={onClose} aria-label="关闭画廊"><X /></button>
      </header>
      <div
        ref={stageRef}
        className="p02-gallery__stage"
        onScroll={() => {
          if (gallery.type !== 'circular') return;
          if (raf.current) window.cancelAnimationFrame(raf.current);
          raf.current = window.requestAnimationFrame(syncNearest);
        }}
        onWheel={event => {
          if (gallery.type !== 'circular' || !stageRef.current) return;
          event.preventDefault();
          stageRef.current.scrollLeft += event.deltaY || event.deltaX;
        }}
        onPointerDown={event => {
          if (gallery.type !== 'circular' || !stageRef.current) return;
          const target = (event.target as HTMLElement).closest('button');
          const index = target ? Array.from(stageRef.current.children).indexOf(target) : -1;
          drag.current = { active: true, x: event.clientX, left: stageRef.current.scrollLeft, moved: false, index };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          if (!drag.current.active || !stageRef.current) return;
          const delta = event.clientX - drag.current.x;
          if (Math.abs(delta) >= 7) drag.current.moved = true;
          stageRef.current.scrollLeft = drag.current.left - delta;
        }}
        onPointerUp={event => {
          if (gallery.type !== 'circular') return;
          const { moved, index } = drag.current;
          drag.current.active = false;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          if (!moved && index >= 0) {
            if (index === active) onOpen(gallery.ids, active, gallery.copy);
            else scrollTo(index);
            return;
          }
          const nearest = syncNearest();
          window.setTimeout(() => scrollTo(nearest), 0);
        }}
        onPointerCancel={() => { drag.current.active = false; }}
      >
        {gallery.ids.map((id, index) => (
          <button
            key={`${id}-${index}`}
            type="button"
            className={index === active ? 'is-active' : ''}
            onMouseEnter={() => gallery.type === 'accordion' && setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => {
              if (gallery.type === 'circular') return;
              if (drag.current.moved) {
                drag.current.moved = false;
                return;
              }
              if (index === active) onOpen(gallery.ids, active, gallery.copy);
              else setActive(index);
            }}
          >
            {renderMedia(id)}
            <span>{String(index + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
      <nav><button type="button" onClick={() => scrollTo(active - 1)} aria-label="上一页"><ArrowLeft /></button><button type="button" onClick={() => scrollTo(active + 1)} aria-label="下一页"><ArrowRight /></button></nav>
    </motion.div>
  );
}

const workflowGroups = [
  { number: '01', title: 'PRODUCT VISUAL → VIDEO', text: '从基础产品素材出发，把 AI 嵌入图像处理、视觉确定、关键帧与视频后期。', steps: ['Original Product', 'AI Processing', 'Product Visual', 'Key Frames', 'AI Video', 'Post Production', 'Final Video'], media: ['workflow-original', 'workflow-process', 'workflow-result', 'workflow-frames', 'workflow-video', 'video', 'workflow-video'] },
  { number: '02', title: 'REAL PRODUCT → AI FILM', text: '以真实产品为起点，将实拍、视觉扩展、AI 动态与剪辑整合为产品影片。', steps: ['Real Product', 'Product Shoot', 'Visual Expansion', 'AI Motion', 'Edit', 'Final Film'], media: ['video-hardware', 'workflow-original', 'workflow-result', 'workflow-frames', 'video-ai-product', 'workflow-video'] },
  { number: '03', title: 'CONCEPT → PRESENTATION', text: '从文化概念和人格方向出发，建立视觉、原型页面与最终展示。', steps: ['Concept', 'Persona / Prompt', 'Visual Direction', 'Product Visual', 'Prototype', 'Presentation'], media: ['workflow-concept', 'horse-metal', 'aigc', 'workflow-result', 'workflow-prototype', 'presentation'] },
];

function WorkflowFlow({ flow, renderMedia, open }: { flow: typeof workflowGroups[number]; renderMedia: RenderMedia; open: (ids: string[], index?: number) => void }) {
  const [stepHovered, setStepHovered] = useState<number | null>(null);
  const [mediaHovered, setMediaHovered] = useState<number | null>(null);
  const [locked, setLocked] = useState(0);
  const active = stepHovered ?? locked;
  const highlighted = mediaHovered ?? active;
  return (
    <article className="p02-flow">
      <div className="p02-flow__intro"><span>WORKFLOW {flow.number}</span><h3>{flow.title}</h3><p>{flow.text}</p></div>
      <div className="p02-flow__body">
        <div className="p02-flow__steps">
          {flow.steps.map((step, index) => <button type="button" key={step} className={highlighted === index ? 'is-active' : ''} onMouseEnter={() => setStepHovered(index)} onMouseLeave={() => setStepHovered(null)} onFocus={() => setStepHovered(index)} onBlur={() => setStepHovered(null)} onClick={() => setLocked(index)} aria-pressed={locked === index}><i>{String(index + 1).padStart(2, '0')}</i><span>{step}</span></button>)}
        </div>
        <div className="p02-linked-media">
          {flow.media.map((id, index) => {
            const offset = index - active;
            return <button type="button" key={`${id}-${index}`} className={`${index === active ? 'is-active' : ''} ${index === mediaHovered ? 'is-hovered' : ''}`} data-distance={Math.abs(offset)} style={{ '--offset': offset } as CSSProperties} onMouseEnter={() => setMediaHovered(index)} onMouseLeave={() => setMediaHovered(null)} onFocus={() => setMediaHovered(index)} onBlur={() => setMediaHovered(null)} onClick={() => { setLocked(index); open(flow.media, index); }} aria-label={`查看 ${flow.steps[index]}`}>{renderMedia(id)}<span><small>{String(index + 1).padStart(2, '0')}</small><strong>{flow.steps[index]}</strong></span></button>;
          })}
        </div>
      </div>
    </article>
  );
}

function LogoLoop() {
  const tools = ['ChatGPT', 'Codex', 'Workbuddy', 'Gemini', 'Pinterest', 'GitHub', 'Canva', 'Photoshop', '剪映', 'Kling AI', '即梦', 'Camera'];
  return <div className="p02-logo-loop" aria-label="创作工具"><div>{[...tools, ...tools].map((tool, index) => <span key={`${tool}-${index}`}>{tool}</span>)}</div></div>;
}

function Workflow({ renderMedia, open }: { renderMedia: RenderMedia; open: (ids: string[], index?: number) => void }) {
  return <section className="p02-section p02-workflow"><SectionHead number="01" english="AI WORKFLOW" chinese="AI 工作流" title="AI IS A TOOL, NOT THE RESULT." intro="AI 被放进真实内容生产流程中，最终服务于产品表达与可交付成果。" />{workflowGroups.map((flow, index) => <div key={flow.number}><WorkflowFlow flow={flow} renderMedia={renderMedia} open={open} />{index < workflowGroups.length - 1 && <LogoLoop />}</div>)}</section>;
}

function AiPanda({ renderMedia, open, openGallery }: { renderMedia: RenderMedia; open: (ids: string[], index?: number, copy?: LightboxCopy[]) => void; openGallery: (state: GalleryState) => void }) {
  const [pack, setPack] = useState(0);
  const [board, setBoard] = useState(0);
  const [evidence, setEvidence] = useState(0);
  const packs = ['panda-package-v1', 'panda-package-v2', 'panda-package-v3'];
  const packCopy = [['V1 / COMPANION', '熊猫主体 + 故事手环', '从陪伴与文化造型开始建立产品识别。'], ['V2 / CITY GIFT', '城市礼物 / 成都 / 旅行', '把产品放入城市礼赠与旅行场景。'], ['V3 / FINAL', '蜀锦趣伴', '白盒与自然绿色共同形成最终交付版本。']];
  const boards = ['panda-mini-program', 'panda-prototype', 'panda-ui-flow', 'panda-ui-device', 'panda-mini-program', 'panda-prototype', 'panda-ui-flow', 'panda-ui-device', 'panda-mini-program', 'panda-prototype'];
  const evidenceItems = [
    { id: 'panda-scene', label: '四川省金奖', en: 'SICHUAN GOLD AWARD', body: '项目在四川省赛事中获得金奖。' },
    { id: 'panda-campaign', label: '全国银奖', en: 'NATIONAL SILVER AWARD', body: '项目在全国赛事中获得银奖。' },
    { id: 'panda-hero', label: '获奖证书', en: 'AWARD CERTIFICATE', body: '项目获奖与成果记录。' },
    { id: 'panda-package-v3', label: '奖牌记录', en: 'MEDAL RECORD', body: '项目交付成果与获奖记录。' },
  ];
  const evidenceIds = evidenceItems.map(item => item.id);
  const evidenceCopy = evidenceItems.map(item => ({ label: item.en, title: item.label, body: item.body }));

  return (
    <section className="p02-section p02-panda">
      <SectionHead number="02" english="AI PANDA" chinese="AI 熊猫项目" title="AWARD-WINNING AI PANDA" />
      <div className="p02-panda__lead"><Media id="panda-hero" renderMedia={renderMedia} label="FINAL PRODUCT / PACKAGING" title="AI Panda 整体视觉" onOpen={() => open(['panda-hero', 'panda-scene', 'panda-campaign'])} /><div className="p02-panda__role"><span>MY ROLE</span><h3>在 20 天窗口内，参与产品方向、视觉迭代与传播表达的推进。</h3><p>从概念梳理到包装更新，再到手册、软件与视频内容输出，推动 AI Panda 快速进入可沟通、可交付状态。</p>{['方向梳理 / 定位与陪伴体验理解', '视觉推进 / 产品视觉与包装迭代', '传播输出 / 手册、软件与视频表达'].map((item, index) => <div key={item}><b>0{index + 1}</b><span>{item}</span></div>)}</div></div>
      <div className="p02-block p02-packaging"><div className="p02-block__intro"><span>PACKAGING EVOLUTION</span><h3>三次版本，把“产品是什么”逐渐说清楚。</h3><nav>{packs.map((_, index) => <button key={index} type="button" className={pack === index ? 'is-active' : ''} onClick={() => setPack(index)}>V{index + 1}</button>)}</nav></div><button type="button" className="p02-packaging__visual" onClick={() => openGallery({ type: 'circular', ids: [packs[pack]], title: `AI PANDA PACKAGING / V${pack + 1}`, copy: [{ label: packCopy[pack][0], title: packCopy[pack][1], body: packCopy[pack][2] }] })}>{renderMedia(packs[pack])}<span><small>{packCopy[pack][0]}</small><strong>{packCopy[pack][1]}</strong><p>{packCopy[pack][2]}</p></span></button></div>
      <div className="p02-block p02-manual"><div className="p02-block__intro"><span>PRODUCT MANUAL</span><h3>复杂信息，重新组织为清晰路径。</h3><p>围绕开机、下载、配对、角色设定、NFC 与参数信息建立阅读秩序。</p><button type="button" onClick={() => open(['panda-manual'])}>VIEW MANUAL ↗</button></div><button type="button" className="p02-manual__visual" onClick={() => open(['panda-manual'])}>{renderMedia('panda-manual')}</button></div>
      <div className="p02-block p02-software"><div className="p02-block__intro"><span>SOFTWARE EXPERIENCE</span><h3>启元陪伴小程序</h3><p>参与功能规划、页面逻辑、交互原型与技术沟通。</p><strong>{String(board + 1).padStart(2, '0')} / 10</strong></div><div className="p02-board-swap">{boards.map((id, index) => { const offset = (index - board + boards.length) % boards.length; return offset < 4 ? <button key={index} type="button" className={`offset-${offset}`} onClick={() => offset ? setBoard(index) : open(boards, board)}>{renderMedia(id)}<span>{String(index + 1).padStart(2, '0')}</span></button> : null; })}<nav><button type="button" onClick={() => setBoard(wrap(board - 1, boards.length))} aria-label="上一页"><ArrowLeft /></button><button type="button" onClick={() => setBoard(wrap(board + 1, boards.length))} aria-label="下一页"><ArrowRight /></button></nav></div></div>
      <div className="p02-panda__outcome"><Media id="panda-video" renderMedia={renderMedia} video label="PRODUCT DEMO VIDEO" title="AI Panda 产品演示" onOpen={() => open(['panda-video'])} /><div className="p02-awards"><span>RESULT / RECOGNITION</span><h3>从交付，到被看见。</h3>{evidenceItems.map((item, index) => <button type="button" key={item.label} className={evidence === index ? 'is-active' : ''} onMouseEnter={() => setEvidence(index)} onFocus={() => setEvidence(index)} onClick={() => open(evidenceIds, index, evidenceCopy)}><b>{item.label}</b><small>{item.en}</small></button>)}</div></div>
      <div className="p02-evidence" aria-label="获奖证据">{evidenceItems.map((item, index) => <button type="button" key={item.id} className={`${evidence === index ? 'is-active' : ''} item-${index + 1}`} onMouseEnter={() => setEvidence(index)} onFocus={() => setEvidence(index)} onClick={() => open(evidenceIds, index, evidenceCopy)}>{renderMedia(item.id)}<span>{item.label}</span></button>)}</div>
    </section>
  );
}

function WaiWai({ renderMedia, open }: { renderMedia: RenderMedia; open: (ids: string[], index?: number) => void }) {
  const [method, setMethod] = useState(0);
  const [capability, setCapability] = useState(0);
  const methods = [['UNDERSTAND', '理解产品'], ['ANALYZE', '分析能力'], ['POSITION', '定位场景'], ['COMMUNICATE', '完成表达']];
  const map = [['企业知识库', '自然语言交互', '内部问答 / 信息检索'], ['自动化能力', '企业微信 / 钉钉', '企业协作 / 流程辅助'], ['对话与提醒', '消息与任务连接', 'EAP / 轻量关怀']];
  return <section className="p02-section p02-waiwai"><SectionHead number="03" english="WAIWAI" chinese="歪歪企业智能体" title="THINK FIRST. THEN COMMUNICATE." intro="基于已有产品能力，参与应用方向与卖点分析，并将产品思考进一步转化为图文与视频表达。" /><div className="p02-waiwai__opening"><Media id="waiwai-hero" renderMedia={renderMedia} label="PRODUCT / WAIWAI" title="企业智能体" onOpen={() => open(['waiwai-hero'])} /><div><article><span>01 / EXPLORATION</span><h3>企业协作自动化</h3><p>探索接入企业微信、钉钉等工具后的自动化工作流价值，并非已交付功能。</p></article><article><span>02 / EXPLORATION</span><h3>EAP 职场关怀</h3><p>探索压力自评、休息提醒与轻量互动等辅助场景，并非已交付功能。</p></article></div></div><div className="p02-method">{methods.map(([en, cn], index) => <button key={en} type="button" className={method === index ? 'is-active' : ''} onMouseEnter={() => setMethod(index)} onFocus={() => setMethod(index)} onClick={() => setMethod(index)}><small>0{index + 1}</small><strong>{en}</strong><span>{cn}</span></button>)}</div><div className="p02-capability-map"><div className="p02-capability-map__head"><span>CAPABILITY</span><span>CONNECTOR</span><span>SCENARIO</span></div>{map.map(([cap, connector, scene], index) => <button key={cap} type="button" className={capability === index ? 'is-active' : ''} onMouseEnter={() => setCapability(index)} onFocus={() => setCapability(index)} onClick={() => setCapability(index)}><b>{cap}</b><i>{connector}</i><span>{scene}</span></button>)}</div><div className="p02-waiwai__video"><div className="p02-position"><span>POSITION</span><h3>不是功能堆叠，而是把能力放进有意义的场景。</h3><p>MY ROLE / 场景分析 · 卖点梳理 · 视频策划 · 拍摄 · 剪辑</p></div><Media id="waiwai-video" renderMedia={renderMedia} video label="COMMUNICATE" title="Product Demo Video" onOpen={() => open(['waiwai-video'])} /></div></section>;
}

function TourWords() {
  const reduce = useReducedMotion();
  return <span className="p02-tour-words">{['NEED', 'EXPERIENCE', 'BUSINESS'].map((word, index) => <motion.i key={word} initial={reduce ? false : { opacity: 0, y: 18, clipPath: 'inset(0 0 100% 0)' }} whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0)' }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : index * 0.12, ease }}>{word}</motion.i>)}<motion.em initial={reduce ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.42 }}>需求 · 体验 · 商业</motion.em></span>;
}

function TourGuide({ renderMedia, open }: { renderMedia: RenderMedia; open: (ids: string[], index?: number) => void }) {
  const cards = ['tour-guide-hero', 'tour-guide-scene', 'tour-guide-report', 'tour-guide-video'];
  const [active, setActive] = useState(0);
  const start = useRef<number | null>(null);
  return <section className="p02-section p02-tour"><SectionHead number="04" english="AI TOUR GUIDE" chinese="AI 文旅导游机" title={<TourWords />} intro="用游客充电刚需作为入口，用 AI 导览问答提升体验，再通过租赁运营和数据反馈形成商业闭环。" /><div className="p02-tour__body"><div><div className="p02-tour__facts">{[['POSITION', 'AI 文旅随身导览解决方案'], ['SCENARIO', '景区 / 博物馆 / 文旅街区 / 研学'], ['BUSINESS LOGIC', '设备 + 知识库 + 租赁运营 + 数据反馈']].map(([label, value], index) => <p key={label}><small>0{index + 1} / {label}</small><strong>{value}</strong></p>)}</div><div className="p02-tour__role"><span>MY ROLE</span><h3>从产品定位到可行性分析，参与形成完整业务判断。</h3><p>围绕产品定位、目标用户、应用场景、商业可行性与核心卖点，参与分析并整理为对外沟通内容。</p><ol><li>产品定位与目标客群</li><li>应用场景与可行性</li><li>卖点提炼与内容结构</li><li>宣传物料与视频表达</li></ol></div></div><div className="p02-tour__swap" onPointerDown={event => { start.current = event.clientX; }} onPointerUp={event => { if (start.current !== null && Math.abs(event.clientX - start.current) > 24) setActive(wrap(active + (event.clientX < start.current ? 1 : -1), cards.length)); start.current = null; }}>{cards.map((id, index) => { const offset = (index - active + cards.length) % cards.length; return offset < 3 ? <button type="button" key={id} className={`offset-${offset}`} onClick={() => offset ? setActive(index) : open(cards, active)}>{renderMedia(id)}<span>{String(index + 1).padStart(2, '0')}</span></button> : null; })}<nav><button type="button" onClick={() => setActive(wrap(active - 1, cards.length))} aria-label="上一页"><ArrowLeft /></button><small>{String(active + 1).padStart(2, '0')} / 04</small><button type="button" onClick={() => setActive(wrap(active + 1, cards.length))} aria-label="下一页"><ArrowRight /></button></nav></div></div></section>;
}

function Personas({ project, renderMedia }: Props) {
  const personas = project.smart?.personas || [];
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dragX, setDragX] = useState(0);
  const start = useRef(0);
  const dragged = useRef(false);
  const blockClick = useRef(0);
  const go = (index: number) => { setActive(wrap(index, personas.length)); setFlipped(false); };
  const down = (event: ReactPointerEvent<HTMLDivElement>) => { start.current = event.clientX; dragged.current = false; event.currentTarget.setPointerCapture(event.pointerId); };
  const move = (event: ReactPointerEvent<HTMLDivElement>) => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) return; const delta = event.clientX - start.current; setDragX(delta); if (Math.abs(delta) >= 7) dragged.current = true; };
  const up = () => { if (dragged.current) { if (Math.abs(dragX) > 44) go(active + (dragX < 0 ? 1 : -1)); blockClick.current = Date.now() + 140; } setDragX(0); };
  return <div className="p02-personas"><header><span>FIVE PERSONAS</span><h3>五种元素，五种面对世界的方式。</h3></header><div className="p02-personas__stage" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ '--drag': `${dragX}px` } as CSSProperties}>{personas.map((persona, index) => { let offset = index - active; if (offset > 2) offset -= personas.length; if (offset < -2) offset += personas.length; return <button type="button" key={persona.name} className={`${offset === 0 ? 'is-center' : 'is-side'} ${offset === 0 && flipped ? 'is-flipped' : ''}`} style={{ '--offset': offset } as CSSProperties} onClick={() => { if (Date.now() < blockClick.current || offset !== 0) return; setFlipped(value => !value); }}><span className="p02-persona__front">{renderMedia(persona.mediaId)}<i>{persona.element}</i><b>{persona.chinese}</b><small>{persona.name}</small></span><span className="p02-persona__back"><i>{persona.element}</i><b>{persona.chinese}</b><p>{persona.personality}</p><small>{persona.interaction}<br />{persona.scenario}</small></span></button>; })}</div><nav><button type="button" onClick={() => go(active - 1)} aria-label="上一个角色"><ArrowLeft /></button><span>{String(active + 1).padStart(2, '0')} / 05</span><button type="button" onClick={() => go(active + 1)} aria-label="下一个角色"><ArrowRight /></button></nav></div>;
}

function Wuxing({ project, renderMedia, open, openGallery }: Props & { open: (ids: string[], index?: number, copy?: LightboxCopy[]) => void; openGallery: (state: GalleryState) => void }) {
  const [concept, setConcept] = useState(0);
  const nodes = [['生肖意象', '马年文化起点'], ['五行系统', '金木水火土'], ['角色人格', '五种性格原型'], ['情绪支持', '不同陪伴方式'], ['AI PERSONA', '可持续对话角色']];
  return <section className="p02-section p02-wuxing"><SectionHead number="05" english="WUXING LINGJI" chinese="五行灵骥" title="五行灵骥 / WUXING LINGJI" intro="从马年生肖与五行文化出发，将传统文化意象转译为人格、情绪陪伴与 AI Persona。" /><Media id="horse-hero" renderMedia={renderMedia} label="PRODUCT CONCEPT" title="五行灵骥整体视觉" onOpen={() => open(['horse-hero'])} className="p02-wuxing__hero" /><div className="p02-concept"><div><span>CONCEPT</span><h3>从文化意象，到可被感知的角色系统。</h3><p>马年生肖 + 五行文化 → 五种人格 → 情绪支持 + AI Persona</p></div><div>{nodes.map(([title, detail], index) => <button type="button" key={title} className={concept === index ? 'is-active' : ''} onMouseEnter={() => setConcept(index)} onFocus={() => setConcept(index)} onClick={() => setConcept(index)}><small>0{index + 1}</small><strong>{title}</strong><span>{detail}</span></button>)}</div></div><p className="p02-anchor">在高度不确定的时代，人们需要确定的心理锚点。</p><Personas project={project} renderMedia={renderMedia} /><div className="p02-funding"><header><span>CROWDFUNDING PREPARATION</span><h3>众筹前期筹备</h3><p>项目尚未正式上线，以下为项目 PPT 与众筹详情页的前期内容输出。</p></header><div><button type="button" onClick={() => openGallery({ type: 'circular', ids: Array.from({ length: 8 }, () => 'horse-presentation'), title: '项目 PPT / PRESENTATION' })}>{renderMedia('horse-presentation')}<span><small>16:9 / CIRCULAR GALLERY</small><strong>项目 PPT</strong></span></button><button type="button" onClick={() => openGallery({ type: 'accordion', ids: Array.from({ length: 10 }, () => 'horse-crowdfunding'), title: '众筹详情页 / DETAIL PAGE' })}>{renderMedia('horse-crowdfunding')}<span><small>10 PAGES / ACCORDION</small><strong>众筹详情页</strong></span></button></div></div></section>;
}

function BrandWork({ renderMedia, open }: { renderMedia: RenderMedia; open: (ids: string[], index?: number, copy?: LightboxCopy[]) => void }) {
  const base = [['brand-logo', 'BRAND IDENTITY', 'WarmView 品牌识别'], ['brand-brochure', 'EDITORIAL', '公司宣传手册'], ['brand-wall', 'OFFLINE SPACE', '文化墙'], ['brand-exhibition', 'EXHIBITION', '展会与展台'], ['brand-event', 'EVENT', '现场活动'], ['brand-visit', 'DOCUMENTATION', '企业来访']];
  const wall = Array.from({ length: 14 }, (_, index) => base[index % base.length]);
  const ids = wall.map(item => item[0]);
  const copy = wall.map(([, label, title]) => ({ label, title, body: '从屏幕内容延伸到线下场景，覆盖设计、沟通、制作与落地。', keywords: 'DESIGN / PRODUCTION / ON-SITE' }));
  return <section className="p02-section p02-brand"><SectionHead number="06" english="BRAND WORK" chinese="品牌工作" title="FROM SCREEN TO SITE." intro="把品牌表达延伸到手册、空间、展会与真实活动现场。" /><div className="p02-drift">{wall.map(([id, label], index) => <button type="button" key={`${id}-${index}`} className={`item-${index + 1}`} onClick={() => open(ids, index, copy)}>{renderMedia(id)}<span>{label}</span></button>)}</div></section>;
}

function VideoReveal({ kind, children }: { kind: 'left' | 'soft' | 'right'; children: ReactNode }) {
  const reduce = useReducedMotion();
  const initial = kind === 'left' ? { clipPath: 'inset(0 100% 0 0)' } : kind === 'right' ? { clipPath: 'inset(0 0 0 100%)' } : { opacity: 0, filter: 'blur(10px)', scale: 0.98 };
  return <motion.div className="p02-film__media" initial={reduce ? false : initial} whileInView={{ clipPath: 'inset(0)', opacity: 1, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: reduce ? 0 : 0.75, ease }}>{children}</motion.div>;
}

function VideoWork({ renderMedia, open }: { renderMedia: RenderMedia; open: (ids: string[], index?: number, copy?: LightboxCopy[]) => void }) {
  const films = [{ id: 'video-hardware', number: '01', cn: 'AI机芯盒', en: 'FROM PRODUCT TO AI FILM', reveal: 'left' as const }, { id: 'video-ai-product', number: '02', cn: 'AI陪伴毛绒玩偶', en: 'COMPANION DEMO', reveal: 'soft' as const }, { id: 'video-intercom', number: '03', cn: '视频通话对讲机', en: 'PRODUCT DEMO', reveal: 'right' as const }];
  const ids = films.map(film => film.id);
  const copy = films.map(film => ({ label: film.en, title: film.cn }));
  return <section className="p02-section p02-videos"><SectionHead number="07" english="VIDEO WORK" chinese="视频作品" title="MY PRODUCT VIDEOS" />{films.map((film, index) => <div className={`p02-film ${index % 2 ? 'is-right' : ''}`} key={film.id}><VideoReveal kind={film.reveal}><Media id={film.id} renderMedia={renderMedia} video label={film.en} title={film.cn} onOpen={() => open(ids, index, copy)} /></VideoReveal><div><span>{film.number}</span><small>{film.en}</small><h3>{film.cn}</h3></div></div>)}</section>;
}

export function Project02Case({ project, renderMedia }: Props) {
  const reduce = useReducedMotion();
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [gallery, setGallery] = useState<GalleryState>(null);
  const open = (ids: string[], index = 0, copy?: LightboxCopy[]) => setLightbox({ ids, index, copy });
  const capabilities = project.smart?.capabilities || [];

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (lightbox) setLightbox(null);
      else if (gallery) setGallery(null);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [lightbox, gallery]);

  return <main className="project-02-case"><section className="p02-hero" onPointerMove={event => { const box = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--mx', `${event.clientX - box.left}px`); event.currentTarget.style.setProperty('--my', `${event.clientY - box.top}px`); }}><motion.div className="p02-hero__identity" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.75, ease }}><span>PROJECT / 02</span><h1 className="p02-stroke-title">AI SMART<br />HARDWARE</h1><p>{project.company}</p><small>{project.period}</small></motion.div><motion.div className="p02-hero__intro" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.18, ease }}><p>{project.overview}</p><div>{capabilities.map(([en, cn], index) => <motion.div key={en} initial={reduce ? false : { opacity: 0.25 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 0.35 + index * 0.1 }}><span>{en}</span><small>{cn}</small></motion.div>)}</div></motion.div></section><Enter><Workflow renderMedia={renderMedia} open={open} /></Enter><Enter><AiPanda renderMedia={renderMedia} open={open} openGallery={setGallery} /></Enter><Enter><WaiWai renderMedia={renderMedia} open={open} /></Enter><Enter><TourGuide renderMedia={renderMedia} open={open} /></Enter><Enter><Wuxing project={project} renderMedia={renderMedia} open={open} openGallery={setGallery} /></Enter><Enter><BrandWork renderMedia={renderMedia} open={open} /></Enter><VideoWork renderMedia={renderMedia} open={open} /><AnimatePresence>{gallery && <Gallery gallery={gallery} renderMedia={renderMedia} onClose={() => setGallery(null)} onOpen={open} paused={Boolean(lightbox)} />}</AnimatePresence><AnimatePresence>{lightbox && <Lightbox project={project} renderMedia={renderMedia} state={lightbox} setState={setLightbox} onClose={() => setLightbox(null)} />}</AnimatePresence></main>;
}

export default Project02Case;
