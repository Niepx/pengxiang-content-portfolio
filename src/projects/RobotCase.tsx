import { ReactNode, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PortfolioProject } from './data';
import './robot-case.css';

type RenderMedia = (id: string, className?: string, autoPreview?: boolean) => ReactNode;
type RobotCaseProps = { project: PortfolioProject; renderMedia: RenderMedia; openMedia: (id: string, trigger: HTMLElement) => void };

const ease = [0.16, 1, 0.3, 1] as const;
const chapters = [
  ['robot-product', 'THE PRODUCT'],
  ['robot-role', 'MY ROLE'],
  ['robot-system', 'CONTENT SYSTEM'],
  ['robot-maker', 'MAKER SERIES'],
  ['robot-launch', 'LAUNCH FILM'],
  ['robot-visual', 'VISUAL RECONSTRUCTION'],
  ['robot-other', 'OTHER CONTENT'],
] as const;

function RobotOutline({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 260 260" fill="none" aria-hidden="true">
    <path d="M78 42h104l25 24v59l-25 22H78l-25-22V66L78 42Z" />
    <path d="M91 42V20m78 22V20M79 81h102v43H79zM107 101h.1m46 0h.1" />
    <path d="M88 147h84l20 24v45H68v-45l20-24Zm-9 69-19 25m121-25 19 25M86 216v24m88-24v24" />
  </svg>;
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: reduceMotion ? 0 : .58, delay: reduceMotion ? 0 : delay, ease }}>{children}</motion.div>;
}

function RobotHeading({ index, title, statement }: { index: string; title: string; statement?: ReactNode }) {
  return <div className="robot-heading">
    <span>{index}</span>
    <h2>{title}</h2>
    {statement && <p>{statement}</p>}
  </div>;
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
    <RobotHeading index="01" title="THE PRODUCT" statement={<>XIAOXICAI PRO</>} />
    <div className="robot-product__layout">
      <div className="robot-product__capabilities">
        {data.productCapabilities.map((item, index) => <button key={item.title} type="button" className={active === index ? 'is-active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} aria-pressed={active === index}>
          <span>{item.number}</span><strong>{item.title}</strong><small>{item.chinese}</small><p>{item.description}</p>
        </button>)}
      </div>
      <div className={`robot-product__visual robot-product__visual--${active}`}>
        <div className="robot-product__visual-head"><span>PORTFOLIO RECONSTRUCTION · 2026</span><strong>CONCEPT EXPLODED VIEW</strong><small>产品结构视觉化示意</small></div>
        {renderMedia('concept-exploded-view', 'robot-product__board')}
        <RobotOutline className="robot-outline robot-outline--product" />
      </div>
    </div>
  </motion.section>;
}

function RoleSection({ project, onEnter }: { project: PortfolioProject; onEnter: () => void }) {
  return <motion.section id="robot-role" className="robot-section robot-role case-container" onViewportEnter={onEnter} viewport={{ amount: .22 }}>
    <RobotHeading index="02" title="MY ROLE" statement={<>这段工作中，我从早期以拍摄剪辑和物料执行为主，逐渐承担更多产品内容策划、卖点梳理和完整内容制作。</>} />
    <div className="robot-role__grid">{project.robot!.roles.map((role, index) => <Reveal key={role.title} delay={index * .08}><h3>{role.title}</h3>{role.items.map(item => <p key={item}>{item}</p>)}</Reveal>)}</div>
    <p className="robot-role__note">VISUAL 为真实工作职责；因历史作品未留存，本项目不展示虚构案例。</p>
  </motion.section>;
}

function ContentSystem({ project, renderMedia, onEnter }: RobotCaseProps & { onEnter: () => void }) {
  const reduceMotion = useReducedMotion();
  const stages = project.robot!.contentStages;
  const [active, setActive] = useState(0);
  return <motion.section id="robot-system" className={`robot-system case-container ${reduceMotion ? 'is-reduced' : ''}`} onViewportEnter={onEnter} viewport={{ amount: .08 }}>
    <div className="robot-system__intro"><RobotHeading index="03" title="CONTENT SYSTEM" statement={<>HOW THE CONTENT<br />EVOLVED.</>} /><p>内容从回答“它有什么”，逐渐延伸到“怎么使用、怎么玩、怎么开发，以及为什么值得关注”。</p></div>
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
  const videos = project.robot!.makerVideos;
  const [active, setActive] = useState(0);
  return <motion.section id="robot-maker" className={`robot-section robot-maker case-container ${reduceMotion ? 'is-reduced' : ''}`} onViewportEnter={onEnter} viewport={{ amount: .12 }}>
    <RobotHeading index="04" title="MAKER SERIES" statement={<>BUILD A ROBOT<br />FROM ZERO.</>} />
    <p className="robot-maker__intro">将机器人开发过程拆解为系列化教程，面向对 AI、硬件和创客开发感兴趣的用户，同时探索编程教育与线上课程内容方向。</p>
    <div className="robot-maker__layout">
      <div className="robot-maker__sticky"><h3>BUILD A ROBOT<br />FROM ZERO.</h3><span>MAKER SERIES<br />01 — 05</span></div>
      <div className="robot-maker__videos">{videos.map((video, index) => <motion.article key={video.mediaId} className={active === index ? 'is-active' : ''} onViewportEnter={() => setActive(index)} viewport={{ amount: .55 }}><div>{renderMedia(video.mediaId)}</div><span>{video.number} / MAKER</span><h3>{video.title}</h3><p>{video.chinese}</p></motion.article>)}</div>
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

function VisualReconstruction({ project, renderMedia, openMedia, onEnter }: RobotCaseProps & { onEnter: () => void }) {
  return <motion.section id="robot-visual" className="robot-section robot-visual" onViewportEnter={onEnter} viewport={{ amount: .16 }}>
    <div className="case-container">
      <RobotHeading index="06" title="VISUAL RECONSTRUCTION" statement={<>PRODUCT CONTENT<br />REIMAGINED.</>} />
      <div className="robot-visual__copy">
        <h3>产品内容视觉重构</h3>
        <p>基于过往产品内容经验，重新整理小喜财 Pro 的产品卖点、功能结构与应用场景，并尝试以更适合当前作品集的视觉方式重新呈现。</p>
        <p>该部分为作品集重新整理与视觉重构，不是当年公司的原始详情页物料。</p>
      </div>
      <div className="robot-visual__layout">
        <div className="robot-visual__lead">
          {renderMedia('visual-reconstruction-long', 'robot-visual__preview')}
          <p>PORTFOLIO RECONSTRUCTION · 2026</p>
          <small>基于过往工作内容重新整理与视觉呈现。</small>
        </div>
        <div className="robot-visual__details">
          {['FEATURES', 'STRUCTURE', 'USE CASES'].map((label, index) => <div className={`robot-visual__detail robot-visual__detail--${index + 1}`} key={label}>{renderMedia('visual-reconstruction-long', `robot-visual__crop robot-visual__crop--${index + 1}`)}<span>{label}</span></div>)}
          <button type="button" className="robot-visual__full" onClick={event => openMedia('visual-reconstruction-long', event.currentTarget)}>VIEW FULL IMAGE <span aria-hidden="true">+</span></button>
        </div>
      </div>
      <RobotOutline className="robot-outline robot-outline--visual" />
    </div>
  </motion.section>;
}

function OtherContent({ project, renderMedia, onEnter }: RobotCaseProps & { onEnter: () => void }) {
  return <motion.section id="robot-other" className="robot-section robot-other case-container" onViewportEnter={onEnter} viewport={{ amount: .18 }}>
    <RobotHeading index="07" title="OTHER CONTENT" />
    <div className="robot-other__gallery">{project.robot!.otherVideos.map((item, index) => <article key={`${item.mediaId}-${index}`} className={`robot-other__item robot-other__item--${index}`}><div>{renderMedia(item.mediaId)}</div><span>{item.category}</span><h3>{item.title}</h3></article>)}</div>
  </motion.section>;
}

export function RobotCase({ project, renderMedia, openMedia }: RobotCaseProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return <div className="robot-case">
    <RobotHero project={project} renderMedia={renderMedia} openMedia={openMedia} />
    <ProductSection project={project} renderMedia={renderMedia} openMedia={openMedia} onEnter={() => setActiveChapter(0)} />
    <RoleSection project={project} onEnter={() => setActiveChapter(1)} />
    <ContentSystem project={project} renderMedia={renderMedia} openMedia={openMedia} onEnter={() => setActiveChapter(2)} />
    <MakerSeries project={project} renderMedia={renderMedia} openMedia={openMedia} onEnter={() => setActiveChapter(3)} />
    <LaunchFilm project={project} renderMedia={renderMedia} openMedia={openMedia} onEnter={() => setActiveChapter(4)} />
    <VisualReconstruction project={project} renderMedia={renderMedia} openMedia={openMedia} onEnter={() => setActiveChapter(5)} />
    <OtherContent project={project} renderMedia={renderMedia} openMedia={openMedia} onEnter={() => setActiveChapter(6)} />
    <nav className="robot-progress" aria-label="AI ROBOT 项目章节">{chapters.map(([id, title], index) => <button key={id} type="button" className={activeChapter === index ? 'is-active' : ''} onClick={() => jumpTo(id)} aria-label={`跳转到 ${title}`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong></button>)}</nav>
  </div>;
}
