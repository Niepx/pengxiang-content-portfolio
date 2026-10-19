import { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Maximize2, Play, X } from 'lucide-react';
import { PortfolioProject } from './data';
import './project-02-case.css';

type RenderMedia = (id: string, className?: string, autoPreview?: boolean) => ReactNode;
type Project02Props = { project: PortfolioProject; renderMedia: RenderMedia };
type Meta = { eyebrow?: string; title?: string; description?: string; keywords?: string };
type OpenMedia = (ids: string[], index?: number, meta?: Meta[]) => void;
type Gallery = { mode: 'circular' | 'accordion'; ids: string[]; title: string } | null;
const ease = [0.16, 1, 0.3, 1] as const;

function Reveal({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }} transition={{ duration: reduce ? 0 : .65, ease }}>{children}</motion.div>;
}

function Header({ number, label, chinese, title, intro }: { number: string; label: string; chinese: string; title: ReactNode; intro: string }) {
  return <header className="p02-header"><div className="p02-header__index"><b>{number}</b><span>{label}</span><small>{chinese}</small></div><div className="p02-header__copy"><h2>{title}</h2><p>{intro}</p></div></header>;
}

function Caption({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <span className="p02-caption"><small>{eyebrow}</small><strong>{title}</strong></span>;
}

function MediaButton({ id, renderMedia, eyebrow, title, onOpen, video = false, className = '' }: { id: string; renderMedia: RenderMedia; eyebrow: string; title: string; onOpen: () => void; video?: boolean; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | null>(null);
  const resetPreview = () => { if (timer.current) window.clearTimeout(timer.current); const player = ref.current?.querySelector('video'); if (player) { player.pause(); player.currentTime = 0; } };
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  return <button ref={ref} type="button" className={`p02-media ${video ? 'is-video' : ''} ${className}`} onClick={onOpen} onMouseEnter={() => { if (video && window.matchMedia('(hover:hover) and (pointer:fine)').matches) { if (timer.current) window.clearTimeout(timer.current); timer.current = window.setTimeout(resetPreview, 3200); } }} onMouseLeave={() => video && resetPreview()} aria-label={`${video ? '播放' : '查看'} ${title}`}>{renderMedia(id)}<span className="p02-media__action">{video ? <><Play size={16} fill="currentColor" /> PLAY ↗</> : <><Maximize2 size={16} /> VIEW</>}</span><Caption eyebrow={eyebrow} title={title} /></button>;
}

function Lightbox({ project, renderMedia, state, onIndex, onClose }: Project02Props & { state: { ids: string[]; index: number; meta: Meta[] }; onIndex: (index: number) => void; onClose: () => void }) {
  const item = project.media.find(media => media.id === state.ids[state.index])!;
  const copy = state.meta[state.index] || {};
  return <motion.div className="p02-lightbox" role="dialog" aria-modal="true" aria-label={copy.title || item.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <button className="p02-overlay-close" type="button" onClick={onClose} aria-label="关闭预览"><X /></button>
    {state.ids.length > 1 && <button className="p02-overlay-arrow is-left" type="button" onClick={e => { e.stopPropagation(); onIndex((state.index - 1 + state.ids.length) % state.ids.length); }} aria-label="上一项"><ArrowLeft /></button>}
    <div className="p02-lightbox__body" onClick={e => e.stopPropagation()}><div className="p02-lightbox__media">{item.kind === 'video' && item.src ? <video key={item.src} src={item.src} poster={item.poster} controls autoPlay playsInline /> : item.kind === 'image' && item.src ? <img src={item.src} alt={copy.title || item.title} /> : renderMedia(item.id)}</div><div className="p02-lightbox__copy"><span>{copy.eyebrow || item.type}</span><h3>{copy.title || item.title}</h3>{copy.description && <p>{copy.description}</p>}{copy.keywords && <small>{copy.keywords}</small>}</div></div>
    {state.ids.length > 1 && <button className="p02-overlay-arrow is-right" type="button" onClick={e => { e.stopPropagation(); onIndex((state.index + 1) % state.ids.length); }} aria-label="下一项"><ArrowRight /></button>}
  </motion.div>;
}

function GalleryOverlay({ gallery, renderMedia, onOpen, onClose }: { gallery: NonNullable<Gallery>; renderMedia: RenderMedia; onOpen: OpenMedia; onClose: () => void }) {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, left: 0 });
  const move = (next: number) => {
    const index = (next + gallery.ids.length) % gallery.ids.length;
    setActive(index);
    stageRef.current?.children[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };
  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') move(active + 1);
      if (event.key === 'ArrowLeft') move(active - 1);
    };
    window.addEventListener('keydown', keys);
    return () => window.removeEventListener('keydown', keys);
  }, [active]);
  return <motion.div className={`p02-gallery-overlay is-${gallery.mode}`} role="dialog" aria-modal="true" aria-label={gallery.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><header><span>{gallery.mode === 'circular' ? 'CIRCULAR GALLERY' : 'ACCORDION GALLERY'}</span><h3>{gallery.title}</h3><button type="button" onClick={onClose} aria-label="关闭画廊"><X /></button></header><div ref={stageRef} className="p02-gallery-overlay__stage" onWheel={event => { if (gallery.mode === 'circular' && stageRef.current) { stageRef.current.scrollLeft += event.deltaY; } }} onPointerDown={event => { if (gallery.mode === 'circular' && stageRef.current) drag.current = { active: true, x: event.clientX, left: stageRef.current.scrollLeft }; }} onPointerMove={event => { if (drag.current.active && stageRef.current) stageRef.current.scrollLeft = drag.current.left - (event.clientX - drag.current.x); }} onPointerUp={() => { drag.current.active = false; }} onPointerLeave={() => { drag.current.active = false; }}>{gallery.ids.map((id, index) => <button type="button" key={`${id}-${index}`} className={active === index ? 'is-active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => gallery.mode === 'accordion' && active !== index ? setActive(index) : onOpen(gallery.ids, index)} style={{ '--i': index } as CSSProperties}>{renderMedia(id)}<span>{String(index + 1).padStart(2, '0')}</span></button>)}</div></motion.div>;
}

const workflows = [
  { number: '01', title: 'PRODUCT VISUAL → VIDEO', text: '从基础产品素材出发，把 AI 嵌入图像处理、视觉确定、关键帧与视频后期。', steps: ['Original', 'AI Processing', 'Product Visual', 'Key Frames', 'AI Video', 'Post', 'Final'], media: ['workflow-original', 'workflow-process', 'workflow-result', 'workflow-frames', 'workflow-video', 'workflow-video', 'workflow-result'] },
  { number: '02', title: 'REAL PRODUCT → AI FILM', text: '以 AI 机芯盒为例，将真实产品画面推进为有节奏、有叙事的 AI 产品影片。', steps: ['Brief', 'Product Shoot', 'Visual Frame', 'AI Motion', 'Edit', 'Delivery'], media: ['hero', 'workflow-original', 'workflow-result', 'workflow-video', 'video-ai-product', 'workflow-video'] },
  { number: '03', title: 'CONCEPT → PRESENTATION', text: '从文化概念和人格方向出发，建立视觉、原型页面与最终展示。', steps: ['Concept', 'AI Persona', 'Visual Direction', 'Product Visual', 'Prototype', 'Presentation'], media: ['workflow-concept', 'horse-metal', 'horse-hero', 'workflow-result', 'workflow-prototype', 'horse-presentation'] },
];

function Workflow({ flow, renderMedia, onOpen }: { flow: typeof workflows[number]; renderMedia: RenderMedia; onOpen: OpenMedia }) {
  const [hover, setHover] = useState<number | null>(null);
  const [locked, setLocked] = useState(0);
  const active = hover ?? locked;
  return <article className="p02-workflow"><div className="p02-workflow__intro"><span>WORKFLOW {flow.number}</span><h3>{flow.title}</h3><p>{flow.text}</p></div><div className="p02-workflow__steps">{flow.steps.map((step, index) => <button type="button" key={step} className={active === index ? 'is-active' : ''} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(index)} onBlur={() => setHover(null)} onClick={() => setLocked(index)} aria-pressed={locked === index}><small>{String(index + 1).padStart(2, '0')}</small><strong>{step}</strong></button>)}</div><div className="p02-media-rail">{flow.media.map((id, index) => <button type="button" key={`${id}-${index}`} className={active === index ? 'is-active' : ''} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)} onClick={() => { setLocked(index); onOpen(flow.media, index); }}>{renderMedia(id, '', id.includes('video'))}<span>{String(index + 1).padStart(2, '0')}</span></button>)}</div></article>;
}

function LogoLoop() {
  const names = ['MIDJOURNEY', 'RUNWAY', 'KLING', 'CHATGPT', 'PREMIERE', 'PHOTOSHOP'];
  return <div className="p02-logo-loop"><div>{[...names, ...names].map((name, index) => <span key={`${name}-${index}`}>{name}</span>)}</div></div>;
}

function AiWorkflow({ renderMedia, onOpen }: { renderMedia: RenderMedia; onOpen: OpenMedia }) {
  return <Reveal><section className="p02-section"><Header number="01" label="AI WORKFLOW" chinese="AI 工作流" title={<>AI IS A TOOL,<br />NOT THE RESULT.</>} intro="AI 被放进真实内容生产流程，最终服务于产品表达与可交付成果。" />{workflows.map((flow, index) => <div key={flow.number}><Workflow flow={flow} renderMedia={renderMedia} onOpen={onOpen} />{index < workflows.length - 1 && <LogoLoop />}</div>)}</section></Reveal>;
}

const packages = [
  { id: 'panda-package-v1', version: 'V1', title: '定位与信息框架', note: '建立产品定位、核心卖点和基础信息层级。' },
  { id: 'panda-package-v2', version: 'V2', title: '视觉语言推进', note: '统一角色气质、包装视觉和沟通语气。' },
  { id: 'panda-package-v3', version: 'V3', title: '交付版本', note: '整合视觉、信息与生产约束，形成最终方向。' },
];

function Packaging({ renderMedia, onOpen }: { renderMedia: RenderMedia; onOpen: OpenMedia }) {
  const [active, setActive] = useState(0);
  const current = packages[active];
  const ids = Array.from({ length: 4 }, () => current.id);
  return <div className="p02-packaging"><div className="p02-kicker"><span>PACKAGING ITERATION</span><h3>V1 → V2 → V3</h3><p>三个版本分别保留独立画廊，呈现包装方向如何逐步收敛。</p><nav>{packages.map((item, index) => <button type="button" key={item.version} aria-pressed={active === index} onClick={() => setActive(index)}>{item.version}</button>)}</nav></div><div className="p02-packaging__gallery">{ids.map((id, index) => <button type="button" key={`${id}-${index}`} onClick={() => onOpen(ids, index)}>{renderMedia(id)}<span>{current.version} / {String(index + 1).padStart(2, '0')}</span></button>)}</div><div className="p02-packaging__note"><span>{current.version}</span><strong>{current.title}</strong><p>{current.note}</p></div></div>;
}

function UiSwap({ renderMedia, onOpen }: { renderMedia: RenderMedia; onOpen: OpenMedia }) {
  const base = ['panda-mini-program', 'panda-prototype', 'panda-ui-flow', 'panda-ui-device'];
  const boards = Array.from({ length: 10 }, (_, index) => base[index % base.length]);
  const [active, setActive] = useState(0);
  return <div className="p02-ui-swap"><div className="p02-ui-swap__stage">{boards.map((id, index) => { const offset = (index - active + boards.length) % boards.length; return offset < 4 ? <button type="button" key={`${id}-${index}`} className={`offset-${offset}`} onClick={() => offset ? setActive(index) : onOpen(boards, active)}>{renderMedia(id)}<span>{String(index + 1).padStart(2, '0')}</span></button> : null; })}</div><div className="p02-ui-swap__controls"><button type="button" onClick={() => setActive(value => (value - 1 + boards.length) % boards.length)} aria-label="上一页"><ArrowLeft /></button><span>{String(active + 1).padStart(2, '0')} / 10</span><button type="button" onClick={() => setActive(value => (value + 1) % boards.length)} aria-label="下一页"><ArrowRight /></button></div><p>围绕设备连接、角色设定、使用路径和状态反馈，完成 10 个关键界面的逻辑与表达。</p></div>;
}

function AiPanda({ renderMedia, onOpen }: { renderMedia: RenderMedia; onOpen: OpenMedia }) {
  const evidence = ['panda-hero', 'panda-package-v3', 'panda-manual', 'panda-video'];
  return <Reveal><section className="p02-section"><Header number="02" label="AI PANDA" chinese="AI 熊猫" title={<>AWARD-WINNING<br />AI PANDA.</>} intro="FROM DIRECTION TO DELIVERY — 在约 20 天内，将产品方向推进为可沟通、可交付的视觉与内容系统。" /><div className="p02-panda-hero"><MediaButton id="panda-hero" renderMedia={renderMedia} eyebrow="20 DAYS / 0 → 1" title="AI Panda / 快速交付窗口" onOpen={() => onOpen(['panda-hero'])} /><div><span>MY ROLE</span><h3>20 DAYS.<br />3 ROLES.</h3><dl><div><dt>01</dt><dd>方向与体验理解</dd></div><div><dt>02</dt><dd>视觉与包装迭代</dd></div><div><dt>03</dt><dd>传播内容与交付</dd></div></dl></div></div><Packaging renderMedia={renderMedia} onOpen={onOpen} /><div className="p02-manual"><div className="p02-kicker"><span>PRODUCT MANUAL</span><h3>复杂信息，重新组织为清晰路径。</h3><p>围绕开机、下载、配对、角色设定、NFC 与参数信息，建立清晰的信息结构与版式节奏。</p></div><MediaButton id="panda-manual" renderMedia={renderMedia} eyebrow="EDITORIAL / MANUAL" title="产品说明手册" onOpen={() => onOpen(['panda-manual'])} /></div><div className="p02-software"><div className="p02-kicker"><span>SOFTWARE EXPERIENCE</span><h3>启元陪伴小程序</h3><p>参与功能规划、页面逻辑、交互原型与技术沟通。</p></div><UiSwap renderMedia={renderMedia} onOpen={onOpen} /></div><div className="p02-demo"><div><span>VIDEO / VISUAL OUTPUT</span><h3>PRODUCT DEMO VIDEO</h3><p>内容策划 / 视觉方向 / 图形物料 / 视频规划与制作</p></div><MediaButton id="panda-video" renderMedia={renderMedia} eyebrow="PRODUCT DEMO VIDEO" title="AI Panda 产品演示" video onOpen={() => onOpen(['panda-video'])} /></div><div className="p02-recognition"><div><span>RESULT / RECOGNITION</span><h3>从交付，到被看见。</h3><p>四川省金奖 · 全国银奖</p></div><div>{evidence.map((id, index) => <button type="button" key={id} onClick={() => onOpen(evidence, index)}>{renderMedia(id)}<span>{String(index + 1).padStart(2, '0')}</span></button>)}</div></div></section></Reveal>;
}

function MethodBar() {
  const items = [['THINK', '理解能力边界'], ['ANALYZE', '映射真实场景'], ['POSITION', '形成价值判断'], ['COMMUNICATE', '转译为可见内容']];
  const [active, setActive] = useState(0);
  return <div className="p02-method">{items.map(([name, detail], index) => <button type="button" key={name} className={active === index ? 'is-active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span>{name}</span><small>{detail}</small></button>)}</div>;
}

function CapabilityMap() {
  const rows = [['主动提醒', '协作自动化'], ['自然语言交互', '职场关怀'], ['企业知识库', '信息查询与服务']];
  const [active, setActive] = useState(0);
  return <div className="p02-capability-map"><span>CAPABILITY</span><span>SCENARIO</span>{rows.map(([capability, scenario], index) => <button type="button" key={capability} className={active === index ? 'is-active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><strong>{capability}</strong><i>→</i><strong>{scenario}</strong></button>)}</div>;
}

function WaiWai({ renderMedia, onOpen }: { renderMedia: RenderMedia; onOpen: OpenMedia }) {
  return <Reveal><section className="p02-section"><Header number="03" label="WAIWAI" chinese="歪歪企业智能体" title={<>THINK FIRST.<br />THEN COMMUNICATE.</>} intro="基于已有产品能力，探索应用方向与卖点，再把判断转译为清晰的产品表达。" /><div className="p02-directions"><article><span>01 / EXPLORATORY DIRECTION</span><h3>企业协作自动化</h3><p>探索接入企业微信、钉钉等协同工具后的自动化工作流价值，并非已落地功能。</p></article><article><span>02 / EXPLORATORY DIRECTION</span><h3>EAP · 职场关怀</h3><p>探索压力自评、休息提醒与轻量互动等辅助场景，并非已落地功能。</p></article></div><MethodBar /><CapabilityMap /><div className="p02-position"><span>POSITION</span><h3>不是功能堆叠，<br />而是把能力放进有意义的场景。</h3></div><div className="p02-demo"><div><span>COMMUNICATE</span><h3>PRODUCT DEMO VIDEO</h3><p>MY ROLE / 场景分析 · 卖点梳理 · 视频策划 · 拍摄 · 剪辑</p></div><MediaButton id="waiwai-video" renderMedia={renderMedia} eyebrow="PRODUCT DEMO VIDEO" title="WaiWai 产品演示" video onOpen={() => onOpen(['waiwai-video'])} /></div></section></Reveal>;
}

function TourGuide({ renderMedia, onOpen }: { renderMedia: RenderMedia; onOpen: OpenMedia }) {
  const cards = ['tour-guide-hero', 'tour-guide-scene', 'tour-guide-video', 'tour-guide-scene', 'tour-guide-hero'];
  const [active, setActive] = useState(0);
  const dragX = useRef<number | null>(null);
  const move = (next: number) => setActive((next + cards.length) % cards.length);
  return <Reveal><section className="p02-section"><Header number="04" label="AI TOUR GUIDE" chinese="AI 移动电源导游机" title={<span className="p02-stagger-title"><i>NEED ↘</i><i>EXPERIENCE ↘</i><i>BUSINESS.</i></span>} intro="从游客刚需进入体验，再以租赁运营与数据反馈形成可持续的商业闭环。" /><div className="p02-tour-position"><MediaButton id="tour-guide-hero" renderMedia={renderMedia} eyebrow="PRODUCT POSITIONING" title="AI 移动电源导游机" onOpen={() => onOpen(['tour-guide-hero'])} /><div>{[['POSITION', 'AI 文旅随身导览解决方案'], ['SCENARIO', '景区 / 博物馆 / 文旅街区 / 研学'], ['BUSINESS', '设备 + 知识库 + 租赁运营 + 数据反馈']].map(([name, value], index) => <div key={name}><span>0{index + 1} / {name}</span><strong>{value}</strong></div>)}</div></div><div className="p02-tour-role"><div><span>MY ROLE</span><h3>从判断到沟通输出。</h3><ol><li>产品定位与目标客群</li><li>应用场景与可行性</li><li>卖点提炼与内容结构</li><li>宣传物料与视频表达</li></ol><p>COMMUNICATION OUTPUT / 图片物料 · 宣传手册 · 演示视频</p></div><div className="p02-role-swap" onPointerDown={event => { dragX.current = event.clientX; }} onPointerUp={event => { if (dragX.current !== null) { const delta = event.clientX - dragX.current; if (delta < -24) move(active + 1); if (delta > 24) move(active - 1); } dragX.current = null; }}>{cards.map((id, index) => { const offset = (index - active + cards.length) % cards.length; return offset < 3 ? <button type="button" key={`${id}-${index}`} className={`offset-${offset}`} onClick={() => offset ? setActive(index) : onOpen(cards, active)}>{renderMedia(id)}<span>{String(index + 1).padStart(2, '0')}</span></button> : null; })}<nav><button type="button" onClick={() => move(active - 1)}><ArrowLeft /></button><span>{String(active + 1).padStart(2, '0')} / 05</span><button type="button" onClick={() => move(active + 1)}><ArrowRight /></button></nav></div></div></section></Reveal>;
}

function Personas({ project, renderMedia }: Project02Props) {
  const personas = project.smart!.personas!;
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const dragged = useRef(false);
  const keywords: Record<string, string> = { METAL: '理性 / 决策 / 执行', WOOD: '成长 / 韧性 / 长期主义', WATER: '共情 / 倾听 / 情绪支持', FIRE: '能量 / 行动 / 鼓励', EARTH: '稳定 / 信任 / 风险意识' };
  const ordered = useMemo(() => personas.map((persona, index) => ({ persona, delta: ((index - active + personas.length + 2) % personas.length) - 2 })), [active, personas]);
  const change = (next: number) => { setActive((next + personas.length) % personas.length); setFlipped(false); };
  return <div className="p02-personas"><header><span>FIVE PERSONAS</span><h3>五种人格，一个可被选择的心理锚点。</h3></header><motion.div className="p02-personas__orbit" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={.12} dragTransition={{ bounceStiffness: 520, bounceDamping: 34 }} onDragStart={() => { dragged.current = false; setSnapping(false); }} onDrag={(_, info) => { if (Math.abs(info.offset.x) >= 7) dragged.current = true; }} onDragEnd={(_, info) => { setSnapping(true); if (info.offset.x < -44) change(active + 1); else if (info.offset.x > 44) change(active - 1); window.setTimeout(() => { dragged.current = false; setSnapping(false); }, 130); }}>{ordered.map(({ persona, delta }) => <div key={persona.name} className={`p02-persona delta-${delta + 2} ${delta === 0 ? 'is-active' : ''}`}><button type="button" className={`p02-persona__card ${delta === 0 && flipped ? 'is-flipped' : ''}`} tabIndex={delta === 0 ? 0 : -1} onClick={() => { if (delta === 0 && !dragged.current && !snapping) setFlipped(value => !value); }}><span className="p02-persona__inner"><span className="p02-persona__front">{renderMedia(persona.mediaId)}<span><small>{persona.element} / {persona.name}</small><strong>{persona.chinese}</strong></span></span><span className="p02-persona__back"><small>{persona.element} / MATERIAL</small><strong>{persona.material}</strong><p>{persona.interaction}</p><span>{keywords[persona.name]}</span></span></span></button></div>)}</motion.div><div className="p02-personas__controls"><button type="button" onClick={() => change(active - 1)}><ArrowLeft /></button><span>{String(active + 1).padStart(2, '0')} / 05 · 点击中心卡翻转</span><button type="button" onClick={() => change(active + 1)}><ArrowRight /></button></div></div>;
}

function Wuxing({ project, renderMedia, onOpen, onGallery }: Project02Props & { onOpen: OpenMedia; onGallery: (gallery: NonNullable<Gallery>) => void }) {
  const [concept, setConcept] = useState(0);
  const nodes = [['马年生肖', '文化起点'], ['五行文化', '视觉与人格框架'], ['五种人格', '不同陪伴方式'], ['心理锚点', '情绪价值'], ['AI Persona', '可持续互动']];
  return <Reveal><section className="p02-section"><Header number="05" label="WUXING LINGJI" chinese="五行灵骥" title={<>五行灵骥<br />WUXING LINGJI.</>} intro="从马年生肖与五行文化出发，将传统文化意象转译为人格、情绪陪伴与 AI Persona。" /><div className="p02-wuxing-hero"><MediaButton id="horse-hero" renderMedia={renderMedia} eyebrow="PRODUCT CONCEPT" title="五行灵骥整体视觉" onOpen={() => onOpen(['horse-hero'])} /></div><div className="p02-concept"><p>在高度不确定的时代，人们需要确定的心理锚点。</p><div>{nodes.map(([name, detail], index) => <button type="button" key={name} className={concept === index ? 'is-active' : ''} onMouseEnter={() => setConcept(index)} onFocus={() => setConcept(index)} onClick={() => setConcept(index)}><small>0{index + 1}</small><strong>{name}</strong><span>{detail}</span></button>)}</div></div><Personas project={project} renderMedia={renderMedia} /><div className="p02-funding"><div className="p02-kicker"><span>CROWDFUNDING PREPARATION</span><h3>众筹前期筹备</h3><p>项目展示聚焦两类输出：项目 PPT 与众筹详情页长图。</p></div><div><button type="button" onClick={() => onGallery({ mode: 'circular', ids: Array.from({ length: 8 }, () => 'horse-presentation'), title: 'PROJECT PRESENTATION / 项目 PPT' })}>{renderMedia('horse-presentation')}<Caption eyebrow="CIRCULAR GALLERY" title="项目 PPT" /></button><button type="button" onClick={() => onGallery({ mode: 'accordion', ids: Array.from({ length: 10 }, () => 'horse-crowdfunding'), title: 'CROWDFUNDING PAGE / 众筹长图' })}>{renderMedia('horse-crowdfunding')}<Caption eyebrow="ACCORDION / 10 PANELS" title="众筹详情页" /></button></div></div></section></Reveal>;
}

const brandBase = [['brand-logo', 'BRAND IDENTITY', 'WarmView 品牌识别'], ['brand-brochure', 'EDITORIAL', '公司宣传手册'], ['brand-wall', 'OFFLINE SPACE', '文化墙'], ['brand-exhibition', 'EXHIBITION', '展会与展台'], ['brand-event', 'EVENT', '现场活动'], ['brand-visit', 'DOCUMENTATION', '企业来访']] as const;

function BrandWork({ renderMedia, onOpen }: { renderMedia: RenderMedia; onOpen: OpenMedia }) {
  const wall = Array.from({ length: 14 }, (_, index) => brandBase[index % brandBase.length]);
  const ids = wall.map(item => item[0]);
  const meta = wall.map(([, eyebrow, title]) => ({ eyebrow, title, description: '从屏幕内容延伸到线下场景，覆盖设计、沟通、制作与落地。', keywords: 'DESIGN / PRODUCTION / ON-SITE' }));
  return <Reveal><section className="p02-section"><Header number="06" label="BRAND WORK" chinese="品牌工作" title={<>FROM SCREEN<br />TO SITE.</>} intro="从品牌识别到线下空间，完成物料设计、制作沟通和现场落地。" /><div className="p02-drift-wall">{wall.map(([id, eyebrow, title], index) => <button type="button" key={`${id}-${index}`} className={`item-${index}`} onClick={() => onOpen(ids, index, meta)}>{renderMedia(id)}<span><small>{eyebrow}</small><strong>{title}</strong></span></button>)}</div></section></Reveal>;
}

function VideoWork({ renderMedia, onOpen }: { renderMedia: RenderMedia; onOpen: OpenMedia }) {
  const films = [{ id: 'workflow-video', cn: 'AI 机芯盒', en: 'FROM PRODUCT TO AI FILM', note: '从真实产品画面到 AI 影片表达。' }, { id: 'video-ai-product', cn: 'AI 陪伴毛绒玩偶', en: 'COMPANION DEMO', note: '以陪伴场景组织功能与情绪价值。' }, { id: 'video-intercom', cn: '视频通话对讲机', en: 'PRODUCT DEMO', note: '用清晰演示降低产品理解成本。' }];
  const ids = films.map(film => film.id);
  const meta = films.map(film => ({ eyebrow: film.en, title: film.cn, description: film.note }));
  return <Reveal><section className="p02-section p02-video-work"><Header number="07" label="VIDEO WORK" chinese="视频作品" title={<>MY PRODUCT<br />VIDEOS.</>} intro="我的产品视频。" /><div className="p02-films">{films.map((film, index) => <article key={film.id} className={index % 2 ? 'is-reverse' : ''}><MediaButton id={film.id} renderMedia={renderMedia} eyebrow={`0${index + 1} / VIDEO`} title={`${film.cn} · ${film.en}`} video onOpen={() => onOpen(ids, index, meta)} /><div><span>0{index + 1}</span><h3>{film.en}</h3><strong>{film.cn}</strong><p>{film.note}</p></div></article>)}</div></section></Reveal>;
}

export function Project02Case({ project, renderMedia }: Project02Props) {
  const reduce = useReducedMotion();
  const [lightbox, setLightbox] = useState<{ ids: string[]; index: number; meta: Meta[] } | null>(null);
  const [gallery, setGallery] = useState<Gallery>(null);
  const openMedia: OpenMedia = (ids, index = 0, meta = []) => setLightbox({ ids, index, meta });
  useEffect(() => { const keydown = (event: KeyboardEvent) => { if (event.key !== 'Escape') return; if (lightbox) setLightbox(null); else if (gallery) setGallery(null); }; window.addEventListener('keydown', keydown); return () => window.removeEventListener('keydown', keydown); }, [lightbox, gallery]);
  return <main className="project-02-case"><section className="p02-hero" onPointerMove={event => { const box = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--mx', `${event.clientX - box.left}px`); event.currentTarget.style.setProperty('--my', `${event.clientY - box.top}px`); }}><div className="p02-hero__identity"><span>PROJECT 02 / AI SMART HARDWARE</span><motion.h1 className="p02-hero__title" initial={reduce ? false : { opacity: .45 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : .9, ease }}>CONTENT<br />DIRECTION</motion.h1><motion.p initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : .3 }}>从产品理解、视觉生成到内容交付，建立跨媒介的产品沟通系统。</motion.p></div><div className="p02-hero__media">{renderMedia('hero')}</div><div className="p02-hero__capabilities">{[['CONTENT', '内容策略'], ['VISUAL', '产品视觉'], ['VIDEO', '影像表达'], ['SYSTEM', '内容系统']].map(([en, cn], index) => <motion.div key={en} initial={reduce ? false : { opacity: .3 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : .25 + index * .12 }}><span>{en}</span><small>{cn}</small></motion.div>)}</div></section><AiWorkflow renderMedia={renderMedia} onOpen={openMedia} /><AiPanda renderMedia={renderMedia} onOpen={openMedia} /><WaiWai renderMedia={renderMedia} onOpen={openMedia} /><TourGuide renderMedia={renderMedia} onOpen={openMedia} /><Wuxing project={project} renderMedia={renderMedia} onOpen={openMedia} onGallery={setGallery} /><BrandWork renderMedia={renderMedia} onOpen={openMedia} /><VideoWork renderMedia={renderMedia} onOpen={openMedia} /><AnimatePresence>{gallery && <GalleryOverlay gallery={gallery} renderMedia={renderMedia} onOpen={openMedia} onClose={() => setGallery(null)} />}</AnimatePresence><AnimatePresence>{lightbox && <Lightbox project={project} renderMedia={renderMedia} state={lightbox} onIndex={index => setLightbox(current => current && { ...current, index })} onClose={() => setLightbox(null)} />}</AnimatePresence></main>;
}

export default Project02Case;
