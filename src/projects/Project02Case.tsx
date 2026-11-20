import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Maximize2, Play, X } from 'lucide-react';
import { PortfolioProject } from './data';
import CursorGrid from './CursorGrid';
import HardwareClosing from './HardwareClosing';
import './project-02-case.css';
import ProductManual from './ProductManual';
import PackagingEvolution from './PackagingEvolution';
import BrandWork from './BrandWork';
import SoftwareExperience from './SoftwareExperience';
import './award-archive.css';
import PandaReflection, { pandaAwardRecords } from './PandaReflection';
import { RecognitionHero } from './RecognitionMotion';

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
      // Sections can be taller than the viewport; never require a fraction of their full height.
      viewport={{ once: true, amount: "some" }}
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
  const modalRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const overlay = modalRef.current?.closest<HTMLElement>('.case-overlay');
    if (!overlay) return;
    // The project and stage details scroll independently of the already-locked body.
    // Keep this lock for the modal's entire mounted lifetime, including its exit.
    const targets = [overlay, ...overlay.querySelectorAll<HTMLElement>('.p02-packaging-detail, .p02-gallery')];
    const previous = targets.map(element => ({
      element, overflow: element.style.overflow,
      top: element.scrollTop, left: element.scrollLeft,
    }));
    targets.forEach(element => { element.style.overflow = 'hidden'; });
    return () => previous.forEach(({ element, overflow, top, left }) => {
      element.style.overflow = overflow;
      element.scrollTo({ top, left, behavior: 'instant' });
    });
  }, []);
  const item = project.media.find(media => media.id === state.ids[state.index]);
  const copy = state.copy?.[state.index];
  const packagingGallery = state.ids.some(id => /^evolution-(?:v2-|v3-|playful-|cultural-)/.test(id));
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const reduced = useReducedMotion();
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
    <motion.div ref={modalRef} className={`p02-lightbox${item.id.startsWith('panda-software-') ? ' p02-lightbox--software' : ''}`} role="dialog" aria-modal="true" aria-label={copy?.title || item.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <button type="button" className="p02-close" onClick={onClose} aria-label="关闭"><X /></button>
      {state.ids.length > 1 && <button type="button" className="p02-arrow is-left" onClick={event => { event.stopPropagation(); move(-1); }} aria-label="上一项"><ArrowLeft /></button>}
      <div className="p02-lightbox__panel" onPointerDown={event => event.stopPropagation()}>
        <div className="p02-lightbox__media" style={packagingGallery ? { touchAction: 'pan-y' } : undefined}
          onTouchStart={event => { if (packagingGallery && event.touches.length === 1) swipe.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
          onTouchEnd={event => {
            const start = swipe.current; swipe.current = null;
            if (!packagingGallery || !start || !event.changedTouches.length) return;
            const dx = event.changedTouches[0].clientX - start.x, dy = event.changedTouches[0].clientY - start.y;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
          }}>
          {item.kind === 'video' && item.src
            ? <video key={item.src} src={item.src} poster={item.poster} controls autoPlay playsInline />
            : item.kind === 'image' && item.src
              ? packagingGallery
                ? <motion.img key={item.src} src={item.src} alt={copy?.title || item.title} initial={reduced ? false : { opacity: .25 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .25 }} />
                : <img src={item.src} alt={copy?.title || item.title} />
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
  {
    number: '01', primary: 'Product Visual', secondary: 'to Video', text: '从真实产品素材出发，通过 Prompt 驱动视觉生成，并进一步延展至关键帧与视频内容。',
    steps: [
      { title: 'Product Source', description: '以真实产品素材作为基础，明确需要保持一致的外观、结构、材质与关键信息。' },
      { title: 'Prompt & Visual Generation', description: '通过 Prompt 控制场景、构图、光线与风格，完成产品视觉生成、筛选与必要修正。' },
      { title: 'Key Frames & AI Video', description: '确定关键画面并设计对应 Prompt，将静态视觉进一步转化为动态镜头。' },
      { title: 'Post & Final Video', description: '完成镜头筛选、节奏、字幕、声音与画面修正，整合为最终可传播视频。' },
    ],
    media: [['workflow-original'], ['workflow-process', 'workflow-result'], ['workflow-frames'], ['workflow-video']],
  },
  {
    number: '02', primary: 'Real Product', secondary: 'to AI Film', text: '以 AI 机芯盒真实产品为起点，结合外观特征分析、AI 视觉生成、图生视频与后期剪辑，完成产品宣传影片的制作。',
    steps: [
      { title: 'Real Product & Visual Traits', description: '以真实 AI 机芯盒为视觉基础，明确机身轮廓、电子眼、交互组件、接口与扬声器等关键特征，为后续 AI 生成建立一致的产品参考。' },
      { title: 'AI Visual Generation', description: '基于真实机芯盒的外观与结构特征，通过 AI 生成产品结构展示、科技感场景与视频首尾帧，统一画面风格并保持产品形象一致。' },
      { title: 'Image-to-Video Clips', description: '以 AI 生成的产品画面和关键帧为基础，通过图生视频制作动态镜头，并筛选运动自然、画面连贯且产品形象稳定的视频片段。' },
      { title: 'Edit & Final Film', description: '对生成的视频片段进行筛选与编排，通过剪辑、节奏调整及必要的后期处理，整合为完整的 AI 机芯盒产品宣传影片。' },
    ],
    media: [['core-product-traits'], ['core-keyframe-visual-03', 'core-keyframe-visual-06', 'core-keyframe-visual-01', 'core-keyframe-visual-05', 'core-keyframe-visual-04', 'core-keyframe-visual-02'], ['core-keyframe-clip-03', 'core-keyframe-clip-06', 'core-keyframe-clip-01', 'core-keyframe-clip-05', 'core-keyframe-clip-04', 'core-keyframe-clip-02'], ['core-quick-edit', 'video-hardware']],
    // Optional production evidence can be connected without adding placeholder panels.
    pendingMedia: { annotatedProductBoard: 'core-product-traits', generationCanvas: null, editingTimeline: null },
  },
  {
    number: '03', primary: 'Concept', secondary: 'to Presentation', text: '从文化概念和人格方向出发，建立视觉、原型页面与最终展示。',
    steps: [
      { title: 'Concept', description: '从产品主题、文化概念或目标场景出发，明确项目的核心表达方向与基本逻辑。' },
      { title: 'Persona & Prompt', description: '将概念拆解成人格、关键词与 Prompt 规则，建立统一的 AI 生成语境。' },
      { title: 'Visual Development', description: '通过 Prompt 持续测试风格、色彩、材质与场景，逐步确定产品视觉与整体方向。' },
      { title: 'Prototype & Presentation', description: '将视觉成果组织进页面、原型或展示结构，形成最终可用于沟通和汇报的方案。' },
    ],
    media: [['workflow-concept'], ['horse-metal'], ['aigc', 'workflow-result'], ['workflow-prototype', 'presentation']],
  },
];

function WorkflowFlow({ flow, renderMedia, open }: { flow: typeof workflowGroups[number]; renderMedia: RenderMedia; open: (ids: string[], index?: number) => void }) {
  const [mediaHovered, setMediaHovered] = useState<number | null>(null);
  const [locked, setLocked] = useState(0);
  const [activeMedia, setActiveMedia] = useState(() => flow.media.map(() => 0));
  const active = locked;
  const highlighted = mediaHovered ?? active;
  return (
    <article className={`p02-flow${flow.number === '02' ? ' is-mirrored' : ''}`}>
      <header className="p02-flow__header">
        <div className="p02-flow__title"><span>AIGC WORKFLOW</span><h3>{flow.primary}</h3><p>{flow.secondary}</p></div>
        <p className="p02-flow__description">{flow.text}</p>
      </header>
      <div className="p02-flow__body">
        <div className="p02-flow__steps">
          {flow.steps.map((step, index) => <button type="button" key={step.title} className={highlighted === index ? 'is-active' : ''} onMouseEnter={() => setLocked(index)} onFocus={() => setLocked(index)} onClick={() => setLocked(index)} aria-pressed={locked === index}><i>{String(index + 1).padStart(2, '0')}</i><span className="p02-flow__step-copy"><strong>{step.title}</strong><span className="p02-flow__step-description"><span>{step.description}</span></span></span></button>)}
        </div>
        <div className="p02-linked-media">
          {flow.media.map((ids, index) => {
            const offset = index - active;
            const currentMedia = activeMedia[index] ?? 0;
            return <div key={`${flow.number}-${index}`} className={`p02-linked-media__group ${index === active ? 'is-active' : ''} ${index === mediaHovered ? 'is-hovered' : ''}`} data-distance={Math.abs(offset)} style={{ '--offset': offset, '--media-direction': flow.number === '02' ? -1 : 1 } as CSSProperties} onMouseEnter={() => { if (index === active) setMediaHovered(index); }} onMouseLeave={() => setMediaHovered(null)} onFocus={() => { if (index === active) setMediaHovered(index); }} onBlur={() => setMediaHovered(null)}>{ids.map((id, mediaIndex) => {
              const depth = wrap(mediaIndex - currentMedia, ids.length);
              const isCurrent = depth === 0;
              return <button type="button" className={`p02-linked-media__asset ${isCurrent ? 'is-active-media' : 'is-secondary-media'}`} data-media-depth={depth} key={`${id}-${mediaIndex}`} onClick={() => {
                setLocked(index);
                if (isCurrent) open(ids, currentMedia);
              }} aria-label={isCurrent ? `查看 ${flow.steps[index].title} 当前素材` : undefined} aria-hidden={!isCurrent} tabIndex={isCurrent ? 0 : -1}>{renderMedia(id, '', index === active && isCurrent)}</button>;
            })}{ids.length > 1 && <nav className="p02-linked-media__switch" aria-label={`${flow.steps[index].title} 素材切换`}>{ids.map((_, mediaIndex) => <button type="button" key={mediaIndex} className={currentMedia === mediaIndex ? 'is-active' : ''} onClick={() => {
              setLocked(index);
              setActiveMedia(current => current.map((value, stepIndex) => stepIndex === index ? mediaIndex : value));
            }} aria-label={`显示素材 ${mediaIndex + 1}`} aria-pressed={currentMedia === mediaIndex} />)}</nav>}<span className="p02-linked-media__caption"><small>{String(index + 1).padStart(2, '0')}</small><strong>{flow.steps[index].title}</strong></span></div>;
          })}
        </div>
      </div>
    </article>
  );
}

type LogoTool = {
  name: string;
  file: string;
  scale?: number;
  inverse?: boolean;
  brighten?: boolean;
};

const logoAsset = (file: string) => `${import.meta.env.BASE_URL}assets/projects/workflow-logos/${file}`;
const logoTools: LogoTool[] = [
  { name: 'ChatGPT', file: 'chatgpt.svg', scale: 1.25, inverse: true },
  { name: 'Codex', file: 'codex.svg', scale: 1.55 },
  { name: 'Workbuddy', file: 'workbuddy.svg', scale: 0.94 },
  { name: 'Gemini', file: 'gemini.svg', scale: 1.85 },
  { name: 'Pinterest', file: 'pinterest.svg', scale: 1.08 },
  { name: 'GitHub', file: 'github.svg', scale: 1.16, inverse: true },
  { name: 'Canva', file: 'canva.svg', scale: 1.08 },
  { name: 'Photoshop', file: 'photoshop.svg', scale: 0.76 },
  { name: '剪映', file: 'capcut.svg', scale: 1.6, inverse: true },
  { name: 'Kling AI', file: 'kling.svg', scale: 1.55 },
  { name: '即梦', file: 'jimeng.svg', scale: 1.5 },
  { name: 'Camera', file: 'camera.svg', scale: 0.76, brighten: true },
];

function LogoIcon({ tool }: { tool: LogoTool }) {
  return <img className={`p02-logo-loop__icon${tool.inverse ? ' is-inverse' : ''}${tool.brighten ? ' is-brightened' : ''}`} style={{ '--p02-logo-scale': tool.scale || 1 } as CSSProperties} src={logoAsset(tool.file)} alt="" loading="lazy" decoding="async" />;
}

function LogoLoop() {
  return <div className="p02-logo-loop" aria-label="创作工具"><div>{[...logoTools, ...logoTools].map((tool, index) => <span key={`${tool.name}-${index}`}><LogoIcon tool={tool} /><b>{tool.name}</b></span>)}</div></div>;
}

function Workflow({ renderMedia, open }: { renderMedia: RenderMedia; open: (ids: string[], index?: number) => void }) {
  return <section className="p02-section p02-workflow"><SectionHead number="01" english="AI WORKFLOW" chinese="AI 工作流" title="AI IS A TOOL, NOT THE RESULT." intro="AI 被放进真实内容生产流程中，最终服务于产品表达与可交付成果。" />{workflowGroups.map((flow, index) => <div className="p02-workflow__group" key={flow.number}><WorkflowFlow flow={flow} renderMedia={renderMedia} open={open} />{index < workflowGroups.length - 1 && <LogoLoop />}</div>)}</section>;
}

function AiPanda({ renderMedia, open }: { renderMedia: RenderMedia; open: (ids: string[], index?: number, copy?: LightboxCopy[]) => void }) {

  return (
    <section className="p02-section p02-panda">
      <SectionHead number="03" english="AI PANDA" chinese="AI 熊猫项目" title="AWARD-WINNING AI PANDA" />
      <div className="p02-panda__lead"><Media id="panda-hero" renderMedia={renderMedia} label="FINAL PRODUCT / PACKAGING" title="AI Panda 整体视觉" onOpen={() => open(['panda-hero', 'panda-scene', 'panda-campaign'])} /><div className="p02-panda__role"><span>MY ROLE</span><h3><span>20 天，从产品梳理</span><span>到最终呈现。</span></h3><p>围绕「蜀锦趣伴」文创礼盒，参与产品定位、组合方案与功能体验的梳理，并推进包装视觉迭代，以及说明书、小程序与宣传视频等配套内容的制作。</p>{['产品梳理 / 定位、组合与功能体验', '视觉设计 / 产品呈现与包装迭代', '内容制作 / 说明书、软件展示与视频'].map((item, index) => <div key={item}><b>0{index + 1}</b><span>{item}</span></div>)}</div></div>
      <PackagingEvolution renderMedia={renderMedia} open={open} />
      <ProductManual />
      <SoftwareExperience open={open} />
      <RecognitionHero awards={pandaAwardRecords} video={<Media id="panda-video" renderMedia={renderMedia} video label="PRODUCT DEMO VIDEO" title="AI Panda 产品演示" onOpen={() => open(['panda-video'])} />} />
      <PandaReflection onOpenDocument={(ids, index) => open(ids, index)} />
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

function VideoReveal({ kind, children }: { kind: 'left' | 'soft' | 'right'; children: ReactNode }) {
  const reduce = useReducedMotion();
  const revealRef = useRef<HTMLDivElement>(null);
  const visible = useInView(revealRef, { once: true, amount: 0.3 });
  const initial = kind === 'left' ? { clipPath: 'inset(0 100% 0 0)' } : kind === 'right' ? { clipPath: 'inset(0 0 0 100%)' } : { opacity: 0, filter: 'blur(10px)', scale: 0.98 };
  return <div ref={revealRef} className="p02-film__media"><motion.div initial={reduce ? false : initial} animate={reduce || visible ? { clipPath: 'inset(0)', opacity: 1, filter: 'blur(0px)', scale: 1 } : initial} transition={{ duration: reduce ? 0 : 0.75, ease }}>{children}</motion.div></div>;
}

function VideoWork({ renderMedia, open }: { renderMedia: RenderMedia; open: (ids: string[], index?: number, copy?: LightboxCopy[]) => void }) {
  const films = [{ id: 'video-hardware', number: '01', cn: 'AI机芯盒', en: 'FROM PRODUCT TO AI FILM', reveal: 'left' as const }, { id: 'video-intercom', number: '02', cn: '视频通话对讲机', en: 'PRODUCT DEMO', reveal: 'soft' as const }, { id: 'video-ai-product', number: '03', cn: 'AI陪伴毛绒玩偶', en: 'COMPANION DEMO', reveal: 'right' as const }, { id: 'waiwai-video', number: '04', cn: '歪歪桌面ClawBot', en: 'WAIWAI / PRODUCT PROMO', reveal: 'soft' as const }];
  const ids = films.map(film => film.id);
  const copy = films.map(film => ({ label: film.en, title: film.cn }));
  return <section className="p02-section p02-videos"><SectionHead number="02" english="VIDEO WORK" chinese="视频作品" title="MY PRODUCT VIDEOS" />{films.map((film, index) => <div className={`p02-film ${index % 2 ? 'is-right' : ''}`} key={film.id}><VideoReveal kind={film.reveal}><Media id={film.id} renderMedia={renderMedia} video label={film.en} title={film.cn} onOpen={() => open(ids, index, copy)} /></VideoReveal><div><span>{film.number}</span><small>{film.en}</small><h3>{film.cn}</h3></div></div>)}<div className="p02-workflow p02-video-workflow" aria-label="AI 机芯盒影片制作方法"><LogoLoop /><div className="p02-workflow__group"><WorkflowFlow flow={workflowGroups[1]} renderMedia={renderMedia} open={open} /></div></div></section>;
}

function ProjectHero({ project, capabilities, reduce }: { project: PortfolioProject; capabilities: [string, string][]; reduce: boolean }) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const render = () => {
      frame = 0;
      current.x += (target.x - current.x) * 0.095;
      current.y += (target.y - current.y) * 0.095;
      hero.style.setProperty('--p02-title-x', `${(current.x * 6).toFixed(2)}px`);
      hero.style.setProperty('--p02-title-y', `${(current.y * 4).toFixed(2)}px`);
      hero.style.setProperty('--p02-meta-x', `${(current.x * 2.4).toFixed(2)}px`);
      hero.style.setProperty('--p02-meta-y', `${(current.y * 1.5).toFixed(2)}px`);
      hero.style.setProperty('--p02-intro-x', `${(current.x * -2.8).toFixed(2)}px`);
      hero.style.setProperty('--p02-intro-y', `${(current.y * -1.8).toFixed(2)}px`);
      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.002) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const wake = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
      target.y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
      wake();
    };
    const leave = () => {
      target.x = 0;
      target.y = 0;
      wake();
    };

    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', leave);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <section ref={heroRef} className="p02-hero">
      <CursorGrid
        className="p02-hero__grid"
        cellSize={68}
        color="#b8c7cf"
        gridColor="#6f7c84"
        radius={165}
        gridOpacity={0.05}
        highlightOpacity={0.18}
      />
      <motion.div
        className="p02-hero__identity"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.75, ease }}
      >
        <span>PROJECT / 01</span>
        <h1 className="p02-stroke-title">AI SMART<br />HARDWARE</h1>
        <div className="p02-hero__company">
          <p>{project.company}</p>
          <small>{project.period}</small>
        </div>
      </motion.div>
      <motion.div
        className="p02-hero__intro"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.18, ease }}
      >
        <p>{project.overview}</p>
        <div>{capabilities.map(([en, cn], index) => (
          <motion.div
            className="p02-hero__capability"
            key={en}
            initial={reduce ? false : { opacity: 0.25 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.35 + index * 0.1 }}
          >
            <span>{en}</span>
            <small>{cn}</small>
          </motion.div>
        ))}</div>
      </motion.div>
    </section>
  );
}

export function Project02Case({ project, renderMedia, onBack }: Props & { onBack: () => void }) {
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

  return <main className="project-02-case"><ProjectHero project={project} capabilities={capabilities} reduce={Boolean(reduce)} /><Enter><BrandWork heading={<SectionHead number="01" english="VISUAL WORK" chinese="视觉作品" title="VISUALS IN PRACTICE" intro="从品牌传播到产品展示，以实际作品呈现不同场景下的视觉表达。" />} /></Enter><VideoWork renderMedia={renderMedia} open={open} /><Enter><AiPanda renderMedia={renderMedia} open={open} /></Enter><HardwareClosing onBack={onBack} /><AnimatePresence>{gallery && <Gallery gallery={gallery} renderMedia={renderMedia} onClose={() => setGallery(null)} onOpen={open} paused={Boolean(lightbox)} />}</AnimatePresence><AnimatePresence>{lightbox && <Lightbox project={project} renderMedia={renderMedia} state={lightbox} setState={setLightbox} onClose={() => setLightbox(null)} />}</AnimatePresence></main>;
}

export default Project02Case;
