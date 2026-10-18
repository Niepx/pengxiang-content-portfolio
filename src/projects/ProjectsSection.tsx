import { CSSProperties, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus, X } from 'lucide-react';
import { MediaItem, PortfolioProject, projects } from './data';
import { HardwareCase, PersonalCase } from './CaseVariants';
import { RobotCase } from './RobotCase';
import './projects.css';
import './case-variants.css';

const ease = [0.16, 1, 0.3, 1] as const;

function placeholder() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760"><rect width="1200" height="760" fill="#171b1f"/><path d="M0 190H1200M0 570H1200M220 0V760M980 0V760" stroke="#63707a" stroke-opacity=".22"/><circle cx="600" cy="380" r="190" fill="#283139"/><circle cx="600" cy="380" r="146" fill="none" stroke="#98a7b1" stroke-opacity=".3"/><circle cx="600" cy="380" r="54" fill="none" stroke="#98a7b1" stroke-opacity=".22"/><path d="M525 380h150M600 305v150" stroke="#98a7b1" stroke-opacity=".38"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const getMedia = (project: PortfolioProject, id: string) => project.media.find(item => item.id === id)!;
const mediaPoster = (item: MediaItem) => item.poster || item.src && item.kind === 'image' && item.src || placeholder();

function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [active]);
}

type MediaOpen = (item: MediaItem, trigger: HTMLElement) => void;

function MediaTile({ item, onOpen, className = '', priority = false, autoPreview = false }: { item: MediaItem; onOpen: MediaOpen; className?: string; priority?: boolean; autoPreview?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverRef = useRef(false);
  const autoVisibleRef = useRef(false);
  const hasVideo = item.kind === 'video' && Boolean(item.src);
  const [nearViewport, setNearViewport] = useState(!hasVideo);
  const tileRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!hasVideo || nearViewport || !tileRef.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNearViewport(true); observer.disconnect(); }
    }, { rootMargin: '420px 0px' });
    observer.observe(tileRef.current);
    return () => observer.disconnect();
  }, [hasVideo, nearViewport]);
  useEffect(() => {
    if (!autoPreview || !hasVideo || !tileRef.current) return;
    const canAutoPlay = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canAutoPlay) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .55);
      autoVisibleRef.current = visible;
      if (visible) { setNearViewport(true); videoRef.current?.play().catch(() => {}); }
      else videoRef.current?.pause();
    }, { threshold: [.1, .55, .9] });
    observer.observe(tileRef.current);
    return () => { observer.disconnect(); autoVisibleRef.current = false; videoRef.current?.pause(); };
  }, [autoPreview, hasVideo]);
  const preview = () => { if (window.matchMedia('(hover: hover)').matches) { hoverRef.current = true; setNearViewport(true); videoRef.current?.play().catch(() => {}); } };
  const stopPreview = () => { hoverRef.current = false; if (videoRef.current && !autoVisibleRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } };
  return <button ref={tileRef} type="button" className={`project-media group/media ${className}`} onClick={event => onOpen(item, event.currentTarget)} onMouseEnter={preview} onMouseLeave={stopPreview} aria-label={`${item.title}，打开作品查看器`}>
    {hasVideo ? <video ref={videoRef} src={nearViewport ? item.src : undefined} poster={mediaPoster(item)} muted loop playsInline preload="metadata" onCanPlay={() => { if (hoverRef.current || autoVisibleRef.current) videoRef.current?.play().catch(() => {}); }} aria-hidden="true" /> : <img className={item.mirrored ? 'is-mirrored' : undefined} src={mediaPoster(item)} alt="" loading={priority ? 'eager' : 'lazy'} />}
    <span className="project-media__shade" />
    {!item.hideMeta && <span className="project-media__meta"><span>{item.type}</span><span>{item.src ? item.title : '素材待替换'}</span></span>}
    <span className="project-media__view" aria-hidden="true">VIEW <Plus size={14} strokeWidth={2} /></span>
  </button>;
}

function ProjectGallery({ project, onOpen }: { project: PortfolioProject; onOpen: MediaOpen }) {
  const hero = getMedia(project, project.coverIds[project.coverIds.length - 1]);
  return <div className="project-cover-gallery">
    <MediaTile item={hero} onOpen={onOpen} priority className="project-cover-gallery__hero" />
  </div>;
}

function ProjectCard({ project, onOpenMedia, onOpenCase }: { project: PortfolioProject; onOpenMedia: MediaOpen; onOpenCase: (trigger: HTMLElement) => void }) {
  return <article className={`project-card project-card--${project.caseType}`}>
    <div className="project-card__content">
      <div className="project-card__head">
        <div className="project-card__index"><strong>{project.number}</strong><span>{project.label || 'PROJECT'}</span></div>
        <div className="project-card__identity"><h3>{project.title}</h3><p>{project.company ? <>{project.company} <span aria-hidden="true">·</span> </> : null}{project.year}</p></div>
        <button type="button" className="project-case-button" onClick={event => onOpenCase(event.currentTarget)}>查看项目 <ArrowUpRight size={19} strokeWidth={1.7} /></button>
      </div>
      {project.summary && <p className="project-card__summary">{project.summary}</p>}
      <div className="project-card__tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    </div>
    <ProjectGallery project={project} onOpen={onOpenMedia} />
  </article>;
}

function Lightbox({ items, activeId, setActiveId, onClose }: { items: MediaItem[]; activeId: string | null; setActiveId: (id: string) => void; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const index = items.findIndex(item => item.id === activeId);
  const current = items[index];
  const navigate = (step: number) => { if (items.length) setActiveId(items[(index + step + items.length) % items.length].id); };
  useEffect(() => {
    if (!activeId) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') navigate(-1);
      if (event.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [activeId, index, items]);
  if (!activeId || !current) return null;
  return createPortal(<div className="project-lightbox" role="dialog" aria-modal="true" aria-label="作品查看器" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="project-lightbox__top"><span>{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span><button type="button" onClick={onClose} aria-label="关闭作品查看器"><X /></button></div>
    <button type="button" className="project-lightbox__arrow" onClick={() => navigate(-1)} aria-label="上一张"><ArrowLeft /></button>
    <AnimatePresence mode="wait"><motion.div key={current.id} className="project-lightbox__content" initial={reduceMotion ? false : { opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .36, ease }}>
      {current.kind === 'video' && current.src ? <video src={current.src} poster={current.poster} controls autoPlay playsInline /> : <img className={current.mirrored ? 'is-mirrored' : undefined} src={mediaPoster(current)} alt={current.title} />}
      {!current.hideMeta && <div><strong>{current.title}</strong><span>{current.type}{current.src ? '' : ' · 素材待替换'}</span></div>}
    </motion.div></AnimatePresence>
    <button type="button" className="project-lightbox__arrow" onClick={() => navigate(1)} aria-label="下一张"><ArrowRight /></button>
  </div>, document.body);
}

const capabilities = [
  ['CONTENT', '卖点梳理 / 内容策划 / 脚本'],
  ['VIDEO', '拍摄 / 分镜 / 剪辑'],
  ['VISUAL', '产品视觉 / 电商物料 / 众筹素材'],
  ['SOCIAL', '小红书 / 抖音 / 视频号 / B站'],
];

function CaseOverview({ project }: { project: PortfolioProject }) {
  return <section className="case-overview case-container">
    <p className="case-section-label">PROJECT / {project.number}</p>
    <h2>{project.title}<br />CONTENT PROJECT</h2>
    <div className="case-overview__details"><span>{project.company}</span><span>{project.period}</span></div>
    <p className="case-overview__intro">{project.overview}</p>
    <div className="case-capabilities">{capabilities.map(([name, detail]) => <div key={name}><h3>{name}</h3><p>{detail}</p></div>)}</div>
  </section>;
}

function SelectedWork({ project, onOpen }: { project: PortfolioProject; onOpen: MediaOpen }) {
  const media = project.selectedIds.map(id => getMedia(project, id));
  return <section className="case-section case-container"><div className="case-section__heading"><h2>SELECTED WORK</h2><span>01 / PROJECT MEDIA</span></div><div className="selected-work-grid">{media.map((item, index) => <MediaTile key={item.id} item={item} onOpen={onOpen} className={`selected-work-grid__item selected-work-grid__item--${index % 7}`} />)}</div></section>;
}

function HighlightCase({ project, onOpen }: { project: PortfolioProject; onOpen: MediaOpen }) {
  const highlight = project.highlight!;
  const media = getMedia(project, highlight.mediaId);
  const reduceMotion = useReducedMotion();
  return <section className="case-highlight case-container"><p className="case-section-label">HIGHLIGHT CASE</p><h2>{highlight.title}</h2><p className="case-highlight__subtitle">{highlight.subtitle}</p>
    <div className="case-highlight__context"><div><span>BACKGROUND</span><p>{highlight.background}</p></div><div><span>IDEA</span><p>{highlight.idea.map((line, index) => <span key={line} className={index ? 'block' : ''}>{line}</span>)}</p></div></div>
    <div className="case-highlight__story"><div className="case-highlight__visual"><MediaTile item={media} onOpen={onOpen} /><small>产品画面 · 真实素材待替换</small></div><div className="case-highlight__steps">{highlight.keywords.map((word, index) => <motion.div key={word} className="case-highlight__step" initial={reduceMotion ? false : { opacity: .45, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: .5 }} transition={{ duration: reduceMotion ? 0 : .5, ease }}><span>{String(index + 1).padStart(2, '0')}</span><h3>{word}</h3></motion.div>)}<motion.p className="case-highlight__end" initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: .7 }} transition={{ duration: reduceMotion ? 0 : .55, ease }}>{highlight.subtitle}</motion.p></div></div>
  </section>;
}

const execution = [
  ['STRATEGY', '传播主题', '功能场景化表达'],
  ['SCRIPT', '发布会执行脚本', '宣传视频分镜'],
  ['VIDEO', '拍摄', '后期剪辑'],
  ['VISUAL', '功能长图', '演示 PPT', '宣传折页'],
];

function ExecutionGrid() {
  const reduceMotion = useReducedMotion();
  return <section className="case-section case-container"><div className="case-section__heading"><h2>EXECUTION</h2><span>02 / PROCESS</span></div><div className="case-execution">{execution.map(([name, ...items], index) => <motion.div key={name} initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: reduceMotion ? 0 : .55, delay: reduceMotion ? 0 : index * .1, ease }}><h3>{name}</h3>{items.map(item => <p key={item}>{item}</p>)}</motion.div>)}</div></section>;
}

function OutputGallery({ project, onOpen }: { project: PortfolioProject; onOpen: MediaOpen }) {
  return <section className="case-section case-container case-output"><div className="case-section__heading"><h2>OUTPUT</h2><span>03 / DELIVERABLES</span></div><div className="output-grid">{project.outputIds.map((id, index) => <MediaTile key={id} item={getMedia(project, id)} onOpen={onOpen} className={`output-grid__item output-grid__item--${index % 6}`} />)}</div></section>;
}

function CaseStudyOverlay({ project, onClose, onOpenMedia }: { project: PortfolioProject | null; onClose: () => void; onOpenMedia: MediaOpen }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!project) return;
    overlayRef.current?.focus();
    const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape' && !document.querySelector('.project-lightbox')) onClose(); };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [project]);
  if (!project) return null;
  const renderMedia = (id: string, className = '', autoPreview = false) => <MediaTile item={getMedia(project, id)} onOpen={onOpenMedia} className={className} autoPreview={autoPreview} />;
  return createPortal(<div ref={overlayRef} tabIndex={-1} className={`case-overlay ${project.caseType === 'personal' ? 'case-overlay--personal' : ''}`} role="dialog" aria-modal="true" aria-label={`${project.title} 项目详情`}>
    <header className="case-overlay__bar"><button type="button" onClick={onClose}><ArrowLeft size={19} /> BACK TO PROJECTS</button><button type="button" onClick={onClose} aria-label="关闭项目详情"><X size={24} /></button></header>
    {project.caseType === 'robot' ? <RobotCase project={project} renderMedia={renderMedia} /> : project.caseType === 'hardware' ? <HardwareCase project={project} renderMedia={renderMedia} /> : <PersonalCase project={project} renderMedia={renderMedia} />}
    <footer className="case-overlay__footer">{project.title} <span>{project.company ? `${project.company} · ` : ''}{project.year}</span></footer>
  </div>, document.body);
}

export default function ProjectsSection({ footer }: { footer: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [activeCase, setActiveCase] = useState<PortfolioProject | null>(null);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(null);
  const caseTriggerRef = useRef<HTMLElement | null>(null);
  const mediaTriggerRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef(0);
  const currentProject = activeCase || previewProject || projects[0];
  useScrollLock(Boolean(activeCase || activeMediaId));
  const openCase = (project: PortfolioProject, trigger: HTMLElement) => { caseTriggerRef.current = trigger; scrollRef.current = window.scrollY; setActiveCase(project); };
  const closeCase = () => { setActiveCase(null); requestAnimationFrame(() => { window.scrollTo({ top: scrollRef.current, behavior: 'instant' }); caseTriggerRef.current?.focus(); }); };
  const openMedia: MediaOpen = (item, trigger) => { document.querySelectorAll('video').forEach(video => video.pause()); mediaTriggerRef.current = trigger; setPreviewProject(projects.find(project => project.media.includes(item)) || activeCase || projects[0]); setActiveMediaId(item.id); };
  const closeMedia = () => { setActiveMediaId(null); requestAnimationFrame(() => mediaTriggerRef.current?.focus()); };
  return <section id="projects" className="projects-section">
    <div className="projects-section__intro">
      <motion.h2 initial={reduceMotion ? false : { opacity: 0, y: 34, clipPath: 'inset(0 0 22% 0)', filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', filter: 'blur(0px)' }} viewport={{ once: true, amount: .35 }} transition={{ duration: reduceMotion ? 0 : .72, ease }}>SELECTED PROJECTS</motion.h2>
      <motion.p initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: reduceMotion ? 0 : .55, delay: reduceMotion ? 0 : .12, ease }}>一些我真正参与过的产品项目与个人内容实践。</motion.p>
    </div>
    <div className="projects-section__list">{projects.map((project, index) => <motion.div key={project.id} className="project-stack-item" style={{ '--stack-offset': `${index * 32}px`, zIndex: index + 1 } as CSSProperties} initial={reduceMotion ? false : { opacity: 0, y: 38, scale: .992, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }} viewport={{ once: true, amount: .14 }} transition={{ duration: reduceMotion ? 0 : .68, delay: reduceMotion ? 0 : index * .05, ease }}><ProjectCard project={project} onOpenMedia={openMedia} onOpenCase={trigger => openCase(project, trigger)} /></motion.div>)}</div>
    {footer}
    <CaseStudyOverlay project={activeCase} onClose={closeCase} onOpenMedia={openMedia} />
    <Lightbox items={currentProject.media} activeId={activeMediaId} setActiveId={setActiveMediaId} onClose={closeMedia} />
  </section>;
}
