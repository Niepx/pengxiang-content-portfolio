import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Maximize2, Play, X } from 'lucide-react';
import { MediaItem, PortfolioProject } from './data';
import './project-02-case.css';

type RenderMedia = (id: string, className?: string) => ReactNode;
type Project02Props = { project: PortfolioProject; renderMedia: RenderMedia };
const ease = [0.16, 1, 0.3, 1] as const;

function FadeContent({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: .58, y: 22, clipPath: 'inset(0 0 7% 0)' }} whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }} viewport={{ once: true, amount: .14 }} transition={{ duration: reduceMotion ? 0 : .62, delay: reduceMotion ? 0 : delay, ease }}>{children}</motion.div>;
}

function SectionHeader({ number, label, title, intro, tech = false }: { number: string; label: string; title: ReactNode; intro: string; tech?: boolean }) {
  return <header className="p02-header">
    <div className="p02-header__index"><span>{number}</span><span>{label}</span></div>
    <h2 className={tech ? 'p02-tech-text' : undefined}>{title}</h2>
    <p>{intro}</p>
  </header>;
}

function MediaCaption({ label, title }: { label: string; title: string }) {
  return <div className="p02-media-caption"><span>{label}</span><strong>{title}</strong></div>;
}

function MediaLightbox({ item, renderMedia, onClose }: { item: MediaItem; renderMedia: RenderMedia; onClose: () => void }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);
  return <motion.div className="p02-lightbox" role="dialog" aria-modal="true" aria-label={item.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <button className="p02-lightbox__close" type="button" onClick={onClose} aria-label="关闭预览"><X /></button>
    <div className="p02-lightbox__body" onClick={event => event.stopPropagation()}>
      {item.kind === 'video' && item.src ? <video src={item.src} poster={item.poster} controls autoPlay playsInline /> : item.kind === 'image' && item.src ? <img src={item.src} alt={item.title} /> : <div className="p02-lightbox__placeholder">{renderMedia(item.id)}<span>真实素材待替换</span></div>}
      <MediaCaption label={item.type} title={item.title} />
    </div>
  </motion.div>;
}

function MediaPreview({ project, id, renderMedia, label, title, className = '', video = false }: Project02Props & { id: string; label?: string; title?: string; className?: string; video?: boolean }) {
  const [open, setOpen] = useState(false);
  const item = project.media.find(media => media.id === id)!;
  return <>
    <button type="button" className={`p02-media-preview ${video ? 'is-video' : ''} ${className}`} onClick={() => setOpen(true)} aria-label={`查看 ${title || item.title}`}>
      {renderMedia(id)}
      <span className="p02-media-preview__action">{video ? <><Play size={18} fill="currentColor" /> PLAY FILM</> : <><Maximize2 size={17} /> VIEW</>}</span>
      <MediaCaption label={label || item.type} title={title || item.title} />
    </button>
    <AnimatePresence>{open && <MediaLightbox item={item} renderMedia={renderMedia} onClose={() => setOpen(false)} />}</AnimatePresence>
  </>;
}

function ScrollExpand({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={`p02-scroll-expand ${className}`} initial={reduceMotion ? false : { scale: .94, borderRadius: 24 }} whileInView={{ scale: 1, borderRadius: 4 }} viewport={{ once: true, amount: .32 }} transition={{ duration: reduceMotion ? 0 : .72, ease }}>{children}</motion.div>;
}

function CardSwap({ project, renderMedia }: Project02Props) {
  const cards = [
    { id: 'panda-package-v1', version: 'V1', title: '定位与信息框架', note: '先建立产品定位、核心卖点和基础信息层级。' },
    { id: 'panda-package-v2', version: 'V2', title: '视觉语言推进', note: '进一步统一角色气质、包装视觉和沟通语气。' },
    { id: 'panda-package-v3', version: 'V3', title: '交付版本', note: '整合信息、视觉与生产约束，形成最终交付方向。' },
  ];
  const [active, setActive] = useState(0);
  return <div className="p02-card-swap">
    <div className="p02-card-swap__stage">{cards.map((card, index) => {
      const offset = (index - active + cards.length) % cards.length;
      return <button type="button" key={card.version} className={`p02-card-swap__card offset-${offset}`} onClick={() => setActive(index)} aria-label={`查看包装迭代 ${card.version}`} aria-pressed={active === index}>
        {renderMedia(card.id)}<span>{card.version}</span>
      </button>;
    })}</div>
    <div className="p02-card-swap__copy"><span>PACKAGING ITERATION / {cards[active].version}</span><h4>{cards[active].title}</h4><p>{cards[active].note}</p><div>{cards.map((card, index) => <button key={card.version} type="button" aria-label={`切换到 ${card.version}`} aria-pressed={active === index} onClick={() => setActive(index)}>{card.version}</button>)}</div></div>
  </div>;
}

function TrueFocus() {
  const words = ['UNDERSTAND', 'ANALYZE', 'POSITION', 'COMMUNICATE'];
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: .5 });
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!visible || reduceMotion) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % words.length), 1800);
    return () => window.clearInterval(timer);
  }, [visible, reduceMotion]);
  return <div ref={ref} className="p02-true-focus" aria-label="理解、分析、定位、表达">{words.map((word, index) => <button key={word} type="button" className={active === index ? 'is-active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}>{word}<span>{index < words.length - 1 ? '→' : ''}</span></button>)}</div>;
}

function AiWorkflow({ project, renderMedia }: Project02Props) {
  const workflows = [
    { number: '01', title: 'PRODUCT VISUAL → VIDEO', text: '从基础产品素材出发，让 AI 进入图像处理、视觉确定、关键帧和视频后期，而不是把生成结果当成终点。', steps: ['Original', 'AI Processing', 'Product Visual', 'Key Frames', 'AI Video', 'Post', 'Final'], media: [['workflow-original', 'BEFORE'], ['workflow-result', 'PRODUCT VISUAL'], ['workflow-frames', 'KEY FRAMES'], ['workflow-video', 'FINAL VIDEO']] },
    { number: '02', title: 'CONCEPT → PRESENTATION', text: '以五行灵骥为例，从文化概念和人格方向出发，逐步建立视觉、原型页面与最终展示。', steps: ['Concept', 'AI Persona', 'Visual Direction', 'Product Visual', 'Prototype', 'Presentation'], media: [['workflow-concept', 'CONCEPT'], ['horse-hero', 'VISUAL DIRECTION'], ['workflow-prototype', 'PROTOTYPE'], ['workflow-result', 'PRESENTATION']] },
  ];
  return <FadeContent><section className="p02-section p02-workflow">
    <SectionHeader number="01" label="AI WORKFLOW" title={<>AI IS A TOOL,<br />NOT THE RESULT.</>} intro="AI 被放进真实内容生产流程中，最终服务于产品表达与可交付成果。" tech />
    {workflows.map(flow => <article className="p02-workflow__case" key={flow.number}>
      <div className="p02-workflow__summary"><span>WORKFLOW {flow.number}</span><h3>{flow.title}</h3><p>{flow.text}</p></div>
      <ol className="p02-workflow__line">{flow.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></li>)}</ol>
      <div className="p02-workflow__media">{flow.media.map(([id, label], index) => <MediaPreview key={id + label} project={project} renderMedia={renderMedia} id={id} label={label} className={index === 0 || index === 3 ? 'is-wide' : ''} video={id === 'workflow-video'} />)}</div>
    </article>)}
  </section></FadeContent>;
}

function AiPanda({ project, renderMedia }: Project02Props) {
  const [uiPage, setUiPage] = useState(0);
  const ui = ['panda-mini-program', 'panda-prototype', 'panda-ui-flow', 'panda-ui-device'];
  return <FadeContent><section className="p02-section p02-panda">
    <SectionHeader number="02" label="AI PANDA" title={<>FROM DIRECTION<br />TO DELIVERY.</>} intro="在约 20 天的窗口中，参与方向梳理、视觉与传播内容的快速推进，让产品从想法进入可沟通、可交付的状态。" />
    <ScrollExpand className="p02-panda__hero"><MediaPreview project={project} renderMedia={renderMedia} id="panda-hero" label="20 DAYS / 0 → 1" title="AI PANDA / 快速交付窗口" /></ScrollExpand>
    <div className="p02-panda__narrative"><p>工作从内容执行继续向前：参与产品方向、陪伴逻辑和传播表达的梳理，并在紧凑周期中完成多类视觉与内容输出。</p><dl><div><dt>DIRECTION</dt><dd>定位与陪伴体验理解</dd></div><div><dt>VISUAL</dt><dd>产品视觉与包装迭代</dd></div><div><dt>COMMUNICATION</dt><dd>手册、软件与视频表达</dd></div></dl></div>
    <div className="p02-panda__swap"><div><span>PACKAGING</span><h3>V1 → V2 → V3</h3><p>以可回看、可比较的方式呈现包装方向如何逐步收敛。</p></div><CardSwap project={project} renderMedia={renderMedia} /></div>
    <div className="p02-manual"><div><span>PRODUCT MANUAL</span><h3>复杂信息，重新组织为清晰路径。</h3><p>围绕开机、App 下载、设备配对、角色设定、NFC 与参数信息，参与信息结构与版式组织。</p></div><MediaPreview project={project} renderMedia={renderMedia} id="panda-manual" label="EDITORIAL / MANUAL" title="产品说明手册" /></div>
    <div className="p02-software"><div className="p02-software__intro"><span>SOFTWARE EXPERIENCE</span><h3>安家兔小程序</h3><p>参与功能规划、页面逻辑与交互原型梳理，并参与需求沟通与技术对接。</p></div><div className="p02-software__viewer"><AnimatePresence mode="wait"><motion.div key={ui[uiPage]} initial={{ opacity: .5, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: .3, ease }}>{renderMedia(ui[uiPage])}</motion.div></AnimatePresence><div><button type="button" onClick={() => setUiPage(value => (value - 1 + ui.length) % ui.length)} aria-label="上一页"><ArrowLeft /></button><span>{String(uiPage + 1).padStart(2, '0')} / {String(ui.length).padStart(2, '0')}</span><button type="button" onClick={() => setUiPage(value => (value + 1) % ui.length)} aria-label="下一页"><ArrowRight /></button></div></div></div>
    <div className="p02-output-film"><div><span>VIDEO / VISUAL OUTPUT</span><h3>PRODUCT DEMO VIDEO</h3><p>内容策划 / 视觉方向 / 图形物料 / 视频规划与制作</p></div><MediaPreview project={project} renderMedia={renderMedia} id="panda-video" label="PRODUCT DEMO VIDEO" title="AI Panda 产品视频" video /></div>
    <div className="p02-awards"><span>AWARD</span><strong>SICHUAN GOLD AWARD</strong><strong>NATIONAL SILVER AWARD</strong></div>
  </section></FadeContent>;
}

function WaiWai({ project, renderMedia }: Project02Props) {
  return <FadeContent><section className="p02-section p02-waiwai">
    <SectionHeader number="03" label="WAIWAI" title={<>THINK FIRST.<br />THEN COMMUNICATE.</>} intro="基于已有产品能力，参与应用方向与卖点分析，并将产品思考进一步转化为图文与视频表达。" />
    <div className="p02-waiwai__thinking"><article><span>01 / ENTERPRISE COLLABORATION</span><h3>企业协作自动化</h3><p>围绕企业办公生态，思考接入企业微信、钉钉等协同工具后的自动化工作流价值。</p></article><article><span>02 / EAP · WORKPLACE CARE</span><h3>职场关怀场景探索</h3><p>结合主动提醒与轻量互动能力，延展至压力自评、休息提醒、职场关怀等 EAP 辅助场景。</p></article></div>
    <TrueFocus />
    <div className="p02-waiwai__translation"><span>理解已有产品能力</span><span>判断潜在应用方向</span><span>提炼价值与卖点</span><span>转译为内容</span></div>
    <div className="p02-waiwai__output"><div className="p02-waiwai__visual">{renderMedia('waiwai-campaign')}<MediaCaption label="CONTENT OUTPUT" title="图文物料 / 产品视觉" /></div><MediaPreview project={project} renderMedia={renderMedia} id="waiwai-video" label="PRODUCT DEMO VIDEO" title="WaiWai 产品演示" video /></div>
    <p className="p02-role">MY ROLE / 场景分析 · 卖点梳理 · 图文制作 · 视频策划 / 拍摄 / 剪辑</p>
  </section></FadeContent>;
}

function TourGuide({ project, renderMedia }: Project02Props) {
  const points = [['01 / POSITION', 'AI 文旅随身导览解决方案'], ['02 / SCENARIO', '景区 / 博物馆 / 文旅街区 / 研学'], ['03 / BUSINESS LOGIC', '设备 + 知识库 + 租赁运营 + 数据反馈']];
  return <FadeContent><section className="p02-section p02-tour">
    <SectionHeader number="04" label="AI TOUR GUIDE" title={<>NEED → EXPERIENCE<br />→ BUSINESS.</>} intro="用游客充电刚需作为入口，用 AI 导览问答提升体验，再通过租赁运营和数据反馈形成商业闭环。" />
    <div className="p02-tour__hero"><MediaPreview project={project} renderMedia={renderMedia} id="tour-guide-hero" label="PRODUCT POSITIONING" title="AI 移动电源导游机" /><div>{points.map(([name, text]) => <div key={name}><span>{name}</span><strong>{text}</strong></div>)}</div></div>
    <div className="p02-tour__report"><div><span>ANALYSIS OUTPUT</span><h3>从报告中提取关键判断。</h3><p>完整报告保留为可打开的大图预览，页面正文只展示定位、场景与商业逻辑。</p><p className="p02-role">MY ROLE / 产品定位 · 目标客群 · 应用场景 · 可行性分析 · 卖点提炼 · 图片物料 · 宣传手册 · 视频拍摄剪辑</p></div><MediaPreview project={project} renderMedia={renderMedia} id="tour-guide-report" label="VIEW FULL ANALYSIS" title="AI Tour Guide 分析报告" /></div>
  </section></FadeContent>;
}

function FlipCard({ project, renderMedia, id, front, back }: Project02Props & { id: string; front: ReactNode; back: ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  return <button type="button" className={`p02-flip ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped(value => !value)} aria-pressed={flipped} aria-label="翻转角色卡片"><span className="p02-flip__inner"><span className="p02-flip__face p02-flip__front">{renderMedia(id)}{front}</span><span className="p02-flip__face p02-flip__back">{back}</span></span></button>;
}

function CircularCarousel({ project, renderMedia }: Project02Props) {
  const personas = project.smart!.personas!;
  const [active, setActive] = useState(0);
  const current = personas[active];
  const keywords: Record<string, string> = { METAL: 'RATIONALE / DECISION / EXECUTION', WOOD: 'GROWTH / RESILIENCE / LONG-TERM THINKING', WATER: 'EMPATHY / LISTENING / EMOTIONAL SUPPORT', FIRE: 'ENERGY / ACTION / ENCOURAGEMENT', EARTH: 'STABILITY / TRUST / RISK AWARENESS' };
  const ordered = useMemo(() => personas.map((persona, index) => ({ persona, index, delta: ((index - active + personas.length + 2) % personas.length) - 2 })), [active, personas]);
  return <div className="p02-carousel">
    <motion.div className="p02-carousel__orbit" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={.18} onDragEnd={(_, info) => { if (info.offset.x < -50) setActive(value => (value + 1) % personas.length); if (info.offset.x > 50) setActive(value => (value - 1 + personas.length) % personas.length); }}>
      {ordered.map(({ persona, index, delta }) => <motion.div key={persona.name} className={`p02-carousel__item delta-${delta + 2} ${delta === 0 ? 'is-active' : ''}`} style={{ '--delta': delta } as React.CSSProperties} onClick={() => setActive(index)}>
        <FlipCard project={project} renderMedia={renderMedia} id={persona.mediaId} front={<span className="p02-flip__label"><small>{persona.element} / {persona.name}</small><strong>{persona.chinese}</strong></span>} back={<><small>{persona.element} / MATERIAL</small><strong>{persona.material}</strong><p>{persona.interaction}</p><span>{keywords[persona.name]}</span></>} />
      </motion.div>)}
    </motion.div>
    <div className="p02-carousel__controls"><button type="button" onClick={() => setActive(value => (value - 1 + personas.length) % personas.length)} aria-label="上一个角色"><ArrowLeft /></button><span>{String(active + 1).padStart(2, '0')} / 05</span><button type="button" onClick={() => setActive(value => (value + 1) % personas.length)} aria-label="下一个角色"><ArrowRight /></button></div>
    <div className="p02-carousel__persona"><span>{current.element} / {current.name}</span><h3>{current.chinese}</h3><p>{keywords[current.name]}</p><small>{current.personality} · {current.scenario}</small></div>
  </div>;
}

function WuxingLingji({ project, renderMedia }: Project02Props) {
  return <FadeContent><section className="p02-section p02-wuxing">
    <SectionHeader number="05" label="WUXING LINGJI" title={<>五行灵骥<br />WUXING LINGJI.</>} intro="从马年生肖与五行文化出发，将传统文化意象转译为五种人格、情绪陪伴方向与 AI Persona。" />
    <div className="p02-wuxing__hero">{renderMedia('horse-hero')}</div>
    <div className="p02-wuxing__thinking"><p>在高度不确定的时代，人们需要确定的心理锚点。</p><ol><li>马年生肖</li><li>五行文化</li><li>五种人格</li><li>心理锚点</li><li>AI Persona</li></ol></div>
    <CircularCarousel project={project} renderMedia={renderMedia} />
    <div className="p02-wuxing__funding"><div><span>CROWDFUNDING PREPARATION</span><h3>众筹前期筹备</h3><p>展示众筹详情页、PPT、AI 产品视觉与 Persona 方向的部分页面。项目停留在众筹前期筹备阶段。</p></div><div className="p02-wuxing__strip">{['horse-crowdfunding', 'horse-presentation', 'horse-hero'].map((id, index) => <MediaPreview key={id} project={project} renderMedia={renderMedia} id={id} label={['SELECTED PAGE', 'PRESENTATION', 'VISUAL DIRECTION'][index]} />)}</div></div>
  </section></FadeContent>;
}

function Masonry({ project, renderMedia }: Project02Props) {
  const media = [['brand-logo', 'BRAND IDENTITY'], ['brand-brochure', 'CONTENT PUBLISHING'], ['brand-wall', 'OFFLINE MATERIALS'], ['brand-exhibition', 'EXHIBITION / EVENT'], ['brand-event', 'ON-SITE DOCUMENTATION'], ['brand-visit', 'BRAND ACCOUNT']];
  return <div className="p02-masonry">{media.map(([id, label], index) => <div className={`p02-masonry__item item-${index}`} key={id}><MediaPreview project={project} renderMedia={renderMedia} id={id} label={label} /></div>)}</div>;
}

function BrandWork({ project, renderMedia }: Project02Props) {
  const execution = ['设计', '制作方 / 供应商沟通', '制作跟进', '收货', '现场张贴 / 安装'];
  return <FadeContent><section className="p02-section p02-brand">
    <SectionHeader number="06" label="BRAND WORK" title={<>FROM SCREEN<br />TO SITE.</>} intro="从屏幕内容到线下空间，完成品牌物料的设计、制作沟通和落地执行。" />
    <Masonry project={project} renderMedia={renderMedia} />
    <div className="p02-brand__before-after"><MediaPreview project={project} renderMedia={renderMedia} id="brand-wall" label="DESIGN" title="设计稿" /><span>→</span><MediaPreview project={project} renderMedia={renderMedia} id="brand-exhibition" label="ON SITE" title="实景落地" /></div>
    <ol className="p02-brand__execution">{execution.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></li>)}</ol>
    <div className="p02-brand__account"><span>OWNER IP / BRAND ACCOUNT</span><p>参与老板 IP 与品牌账号内容运营，围绕产品、招聘、合作、测评 / 开箱等主题，参与选题、脚本、拍摄、剪辑和发布。</p><strong>招聘类代表内容单条 10W+ 播放</strong></div>
  </section></FadeContent>;
}

function SelectedFilms({ project, renderMedia }: Project02Props) {
  return <FadeContent><section className="p02-section p02-films">
    <SectionHeader number="07" label="VIDEO WORK" title="SELECTED FILMS" intro="没有独立章节，但完整参与制作的产品影像。" />
    <div className="p02-films__reel">{project.smart!.selectedVideos!.slice(0, 3).map((video, index) => <article key={video.mediaId} className={`p02-film p02-film--${index}`}>
      <MediaPreview project={project} renderMedia={renderMedia} id={video.mediaId} label={`VIDEO ${String(index + 1).padStart(2, '0')} / ${video.type}`} title={video.product} video />
      <div><span>0{index + 1} / FILM</span><h3>{video.product}</h3><p>{video.type}</p><small>{video.role}</small></div>
    </article>)}</div>
  </section></FadeContent>;
}

export default function Project02Case({ project, renderMedia }: Project02Props) {
  return <div className="project-02-case"><section className="case-overview case-container p02-overview"><p className="case-section-label">PROJECT / {project.number}</p><h2>AI SMART<br />HARDWARE</h2><div className="case-overview__details"><span>{project.company}</span><span>{project.period}</span></div><p className="case-overview__intro">{project.overview}</p><div className="case-capabilities">{project.smart!.capabilities.map(([name, detail]) => <div key={name}><h3>{name}</h3><p>{detail}</p></div>)}</div></section><div className="case-container"><AiWorkflow project={project} renderMedia={renderMedia} /><AiPanda project={project} renderMedia={renderMedia} /><WaiWai project={project} renderMedia={renderMedia} /><TourGuide project={project} renderMedia={renderMedia} /><WuxingLingji project={project} renderMedia={renderMedia} /><BrandWork project={project} renderMedia={renderMedia} /><SelectedFilms project={project} renderMedia={renderMedia} /></div></div>;
}
