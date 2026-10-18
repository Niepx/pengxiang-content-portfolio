import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { PortfolioProject } from './data';
import './robot-case.css';

type RenderMedia = (id: string, className?: string, autoPreview?: boolean) => ReactNode;
type RobotCaseProps = { project: PortfolioProject; renderMedia: RenderMedia };

const ease = [0.16, 1, 0.3, 1] as const;
const lineArtEase = [0.22, 1, 0.36, 1] as const;
const lineArtAsset = (name: string) => `${import.meta.env.BASE_URL}assets/robot-lineart/${name}.svg`;
const chapters = [
  ['robot-product', 'THE PRODUCT'],
  ['robot-role', 'MY ROLE'],
  ['robot-system', 'CONTENT SYSTEM'],
  ['robot-maker', 'MAKER SERIES'],
  ['robot-launch', 'LAUNCH FILM'],
  ['robot-other', 'OTHER CONTENT'],
] as const;

function Reveal({ children, className = '', delay = 0, distance = 24 }: { children: ReactNode; className?: string; delay?: number; distance?: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: distance }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: reduceMotion ? 0 : .58, delay: reduceMotion ? 0 : delay, ease }}>{children}</motion.div>;
}

function LineArtDecoration({ src, className = '', opacity, delay = 0, interactive = false }: { src: string; className?: string; opacity: number; delay?: number; interactive?: boolean }) {
  const reduceMotion = useReducedMotion();
  return <motion.div
    className={`robot-lineart ${interactive ? 'is-interactive' : ''} ${className}`}
    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
    whileInView={{ opacity, y: 0 }}
    whileHover={interactive && !reduceMotion ? { opacity: Math.min(opacity + .1, .28), y: -3, scale: 1.02 } : undefined}
    viewport={{ once: true, amount: className.includes('robot-sketch-cluster') ? .05 : .2 }}
    transition={{ duration: reduceMotion ? 0 : .8, delay: reduceMotion ? 0 : delay, ease: lineArtEase }}
    aria-hidden="true"
  ><img src={lineArtAsset(src)} alt="" /></motion.div>;
}

function RobotPowerState() {
  const reduceMotion = useReducedMotion();
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const powerOn = () => setIsPoweredOn(true);

  return <motion.div
    className={`robot-lineart robot-product__sketch robot-power-state ${isPoweredOn ? 'is-powered-on' : ''}`}
    role="button"
    tabIndex={0}
    aria-label={isPoweredOn ? '小喜财 Pro，已唤醒' : '小喜财 Pro，聚焦后唤醒'}
    initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 1 }}
    animate={isPoweredOn && !reduceMotion
      ? { opacity: 1, y: [0, -2, 0], scale: [1, 1.015, 1] }
      : { opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: reduceMotion ? 0 : isPoweredOn ? .52 : .72, ease: lineArtEase }}
    onPointerEnter={powerOn}
    onFocus={powerOn}
    onClick={powerOn}
  >
    <motion.img
      className="robot-head-off"
      src={lineArtAsset('head-front-off')}
      alt=""
      animate={{ opacity: isPoweredOn ? 0 : .24 }}
      transition={{ duration: reduceMotion ? 0 : .52, ease: lineArtEase }}
    />
    <motion.img
      className="robot-head-on"
      src={lineArtAsset('head-front')}
      alt=""
      animate={{ opacity: isPoweredOn ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : .52, delay: reduceMotion || !isPoweredOn ? 0 : .08, ease: lineArtEase }}
    />
  </motion.div>;
}

function RobotSketchCluster() {
  const reduceMotion = useReducedMotion();
  const updateParallax = (element: HTMLDivElement, x: number, y: number) => {
    element.style.setProperty('--robot-px-deep', `${x * 8}px`);
    element.style.setProperty('--robot-py-deep', `${y * 8}px`);
  };

  return <div
    className="robot-sketch-cluster"
    onPointerMove={event => {
      if (reduceMotion || event.pointerType === 'touch') return;
      const rect = event.currentTarget.getBoundingClientRect();
      updateParallax(event.currentTarget, (event.clientX - rect.left) / rect.width - .5, (event.clientY - rect.top) / rect.height - .5);
    }}
    onPointerLeave={event => updateParallax(event.currentTarget, 0, 0)}
    aria-hidden="true"
  >
    <LineArtDecoration src="body-perspective" className="robot-sketch-cluster__perspective" opacity={.12} interactive />
  </div>;
}

function RobotHeading({ index, title, statement }: { index: string; title: string; statement?: ReactNode }) {
  return <div className="robot-heading">
    <span>{index}</span>
    <h2>{title}</h2>
    {statement && <p>{statement}</p>}
  </div>;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

function RobotHero({ project, renderMedia }: RobotCaseProps) {
  return <section className="robot-hero case-container">
    <div className="robot-hero__copy">
      <p>01 / AI ROBOT</p>
      <h1>FROM PRODUCT<br />TO CONTENT SYSTEM.</h1>
      <div className="robot-hero__meta"><strong>小喜财 Pro<br />AI DESKTOP ROBOT</strong><span>{project.company}<br />{project.period}</span></div>
      <p className="robot-hero__intro">{project.overview}</p>
    </div>
    <motion.div className="robot-hero__visual" initial={{ opacity: 0, transform: 'translateY(22px)' }} animate={{ opacity: 1, transform: 'translateY(0)' }} transition={{ duration: .65, ease }}>{renderMedia('hero')}</motion.div>
  </section>;
}

function ProductSection({ project, renderMedia, onEnter }: RobotCaseProps & { onEnter: () => void }) {
  const data = project.robot!;
  const [active, setActive] = useState(0);
  return <motion.section id="robot-product" className="robot-section robot-product case-container" onViewportEnter={onEnter} viewport={{ amount: .18 }}>
    <RobotPowerState />
    <RobotHeading index="01" title="THE PRODUCT" statement={<>XIAOXICAI PRO</>} />
    <div className="robot-product__layout">
      <div className="robot-product__visual">{renderMedia('product')}</div>
      <div className="robot-product__capabilities">
        {data.productCapabilities.map((item, index) => <button key={item.title} type="button" className={active === index ? 'is-active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} aria-pressed={active === index}>
          <span>{item.number}</span><strong>{item.title}</strong><small>{item.chinese}</small><p>{item.description}</p>
        </button>)}
      </div>
    </div>
  </motion.section>;
}

function RoleSection({ project, onEnter }: { project: PortfolioProject; onEnter: () => void }) {
  return <motion.section id="robot-role" className="robot-section robot-role case-container" onViewportEnter={onEnter} viewport={{ amount: .22 }}>
    <RobotHeading index="02" title="MY ROLE" statement={<>这段工作中，我从早期以拍摄剪辑和物料执行为主，逐渐参与到产品卖点梳理、内容策划和完整内容制作中。</>} />
    <div className="robot-role__grid">{project.robot!.roles.map((role, index) => <Reveal key={role.title} delay={index * .08} distance={16}><h3><span>{String(index + 1).padStart(2, '0')}</span>{role.title}</h3>{role.items.map(item => <p key={item}>{item}</p>)}</Reveal>)}</div>
  </motion.section>;
}

function ContentSystem({ project, renderMedia, onEnter }: RobotCaseProps & { onEnter: () => void }) {
  const reduceMotion = useReducedMotion();
  const stages = project.robot!.contentStages;
  const [active, setActive] = useState(0);
  return <motion.section id="robot-system" className={`robot-system case-container ${reduceMotion ? 'is-reduced' : ''}`} onViewportEnter={onEnter} viewport={{ amount: .08 }}>
    <div className="robot-system__intro"><RobotSketchCluster /><RobotHeading index="03" title="CONTENT SYSTEM" statement={<>HOW THE CONTENT<br />EVOLVED.</>} /><p>内容从回答“它有什么”，逐渐延伸到“怎么使用、怎么玩、怎么开发，以及为什么值得关注”。</p></div>
    <div className="robot-system__layout">
      <div className="robot-system__sticky">
        <span>CONTENT SYSTEM</span><h3>FROM PRODUCT<br />TO CONTENT SYSTEM.</h3>
        <motion.div key={stages[active].mediaId} initial={reduceMotion ? false : { opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduceMotion ? 0 : .5, ease }}>{renderMedia(stages[active].mediaId)}</motion.div>
      </div>
      <div className="robot-system__stages">{stages.map((stage, index) => <motion.article key={stage.title} className={active === index ? 'is-active' : ''} onViewportEnter={() => setActive(index)} viewport={{ amount: .55 }}>
        <span>{stage.number}</span><h3>{stage.title}</h3><h4>{stage.question}</h4><p>{stage.items.join(' / ')}</p><p>{stage.description}</p>
      </motion.article>)}</div>
    </div>
    <Reveal className="robot-system__coda"><h3>FROM PRODUCT<br />TO CONTENT SYSTEM.</h3><p>从功能展示，到使用教程、创客内容与新品传播。</p></Reveal>
  </motion.section>;
}

function MakerSeries({ project, renderMedia, onEnter }: RobotCaseProps & { onEnter: () => void }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const videosRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 700px)');
  const videos = project.robot!.makerVideos;
  const [active, setActive] = useState(0);
  const makerProgress = useMotionValue(0);
  const robotScale = useTransform(makerProgress, isMobile ? [0, .12, 1] : [0, .25, .5, .75, 1], isMobile ? [.85, 1.05, 1.05] : [.78, .84, .9, .96, 1]);
  const robotX = useTransform(makerProgress, [0, 1], [0, isMobile ? 0 : 8]);
  const robotY = useTransform(makerProgress, [0, 1], [0, 0]);
  const robotOpacity = useTransform(makerProgress, isMobile ? [0, .12, 1] : [0, .5, 1], isMobile ? [.18, .25, .25] : [.18, .29, .48]);

  useEffect(() => {
    const section = sectionRef.current;
    const videoList = videosRef.current;
    const scroller = section?.closest<HTMLElement>('.case-overlay');
    if (!section || !videoList || !scroller || reduceMotion) return;

    const update = () => {
      const sectionRect = section.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      if (sectionRect.bottom < scrollerRect.top - scroller.clientHeight || sectionRect.top > scrollerRect.bottom + scroller.clientHeight) return;
      const firstItem = videoList.firstElementChild?.getBoundingClientRect();
      const lastItem = videoList.lastElementChild?.getBoundingClientRect();
      if (!firstItem || !lastItem) return;
      const viewportCenter = scroller.clientHeight / 2;
      const start = scroller.scrollTop + firstItem.top + firstItem.height / 2 - scrollerRect.top - viewportCenter;
      const end = scroller.scrollTop + lastItem.top + lastItem.height / 2 - scrollerRect.top - viewportCenter;
      makerProgress.set(Math.min(1, Math.max(0, (scroller.scrollTop - start) / Math.max(1, end - start))));
    };
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      scroller.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [makerProgress, reduceMotion]);

  return <motion.section ref={sectionRef} id="robot-maker" className={`robot-section robot-maker case-container ${reduceMotion ? 'is-reduced' : ''}`} onViewportEnter={onEnter} viewport={{ amount: .12 }}>
    <RobotHeading index="04" title="MAKER SERIES" statement={<>BUILD A ROBOT<br />FROM ZERO.</>} />
    <p className="robot-maker__intro">将机器人开发过程拆解为系列化教程，面向对 AI、硬件和创客开发感兴趣的用户，同时探索编程教育与线上课程内容方向。</p>
    <div className="robot-maker__layout">
      <div className="robot-maker__sticky">
        <h3>BUILD A ROBOT<br />FROM ZERO.</h3><span>MAKER SERIES<br />01 — 05</span>
        <div className="robot-maker__visual" aria-hidden="true">
          <motion.div
            className="robot-maker__approach"
            initial={reduceMotion ? false : { opacity: 0, scale: isMobile ? 1 : .923 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: .2 }}
            transition={{ duration: reduceMotion ? 0 : .5, ease: lineArtEase }}
          >
            <motion.img
              src={lineArtAsset('body-front')}
              alt=""
              style={reduceMotion ? { scale: 1, x: 0, y: 0, opacity: .25 } : { scale: robotScale, x: robotX, y: robotY, opacity: robotOpacity }}
            />
          </motion.div>
        </div>
      </div>
      <div ref={videosRef} className="robot-maker__videos">{videos.map((video, index) => <motion.article key={video.mediaId} className={active === index ? 'is-active' : ''} onViewportEnter={() => setActive(index)} viewport={{ amount: .55 }}><div>{renderMedia(video.mediaId)}</div><span>{video.number} / MAKER</span><h3>{video.title}</h3><p>{video.chinese}</p></motion.article>)}</div>
    </div>
  </motion.section>;
}

function LaunchFilm({ project, renderMedia, onEnter }: RobotCaseProps & { onEnter: () => void }) {
  const launch = project.robot!.launch;
  return <motion.section id="robot-launch" className="robot-section robot-launch case-container" onViewportEnter={onEnter} viewport={{ amount: .18 }}>
    <RobotHeading index="05" title="XIAOXICAI PRO LAUNCH FILM." />
    <p className="robot-launch__label">PRODUCT LAUNCH</p>
    <div className="robot-launch__video">{renderMedia(launch.mediaId, 'robot-launch-preview', true)}</div>
    <div className="robot-launch__facts"><div><h3>CONTEXT</h3>{launch.context.map(item => <p key={item}>{item}</p>)}</div><div><h3>MY ROLE</h3>{launch.roles.map(item => <p key={item}>{item}</p>)}</div></div>
    <p className="robot-launch__description">{launch.description}</p>
  </motion.section>;
}

function OtherContent({ project, renderMedia, onEnter }: RobotCaseProps & { onEnter: () => void }) {
  return <motion.section id="robot-other" className="robot-section robot-other case-container" onViewportEnter={onEnter} viewport={{ amount: .18 }}>
    <RobotHeading index="06" title="OTHER CONTENT" />
    <div className="robot-other__gallery">{project.robot!.otherVideos.map((item, index) => <article key={`${item.mediaId}-${index}`} className={`robot-other__item robot-other__item--${index}`}><div>{renderMedia(item.mediaId)}</div><span>{item.category}</span><h3>{item.title}</h3></article>)}</div>
  </motion.section>;
}

export function RobotCase({ project, renderMedia }: RobotCaseProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return <div className="robot-case">
    <RobotHero project={project} renderMedia={renderMedia} />
    <ProductSection project={project} renderMedia={renderMedia} onEnter={() => setActiveChapter(0)} />
    <RoleSection project={project} onEnter={() => setActiveChapter(1)} />
    <ContentSystem project={project} renderMedia={renderMedia} onEnter={() => setActiveChapter(2)} />
    <MakerSeries project={project} renderMedia={renderMedia} onEnter={() => setActiveChapter(3)} />
    <LaunchFilm project={project} renderMedia={renderMedia} onEnter={() => setActiveChapter(4)} />
    <OtherContent project={project} renderMedia={renderMedia} onEnter={() => setActiveChapter(5)} />
    <nav className="robot-progress" aria-label="AI ROBOT 项目章节">{chapters.map(([id, title], index) => <button key={id} type="button" className={activeChapter === index ? 'is-active' : ''} onClick={() => jumpTo(id)} aria-label={`跳转到 ${title}`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong></button>)}</nav>
  </div>;
}
