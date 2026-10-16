import { CSSProperties, ReactNode, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PortfolioProject } from './data';

type RenderMedia = (id: string, className?: string) => ReactNode;
type CaseProps = { project: PortfolioProject; renderMedia: RenderMedia };
const ease = [0.16, 1, 0.3, 1] as const;

function SectionHeading({ title, note }: { title: ReactNode; note?: string }) {
  return <div className="case-section__heading"><h2>{title}</h2>{note && <span>{note}</span>}</div>;
}

function HardwareOverview({ project }: { project: PortfolioProject }) {
  return <section className="case-overview case-container smart-overview">
    <p className="case-section-label">PROJECT / {project.number}</p>
    <h2>AI SMART<br />HARDWARE</h2>
    <div className="case-overview__details"><span>{project.company}</span><span>{project.period}</span></div>
    <p className="case-overview__intro">{project.overview}</p>
    <div className="case-capabilities">{project.smart!.capabilities.map(([name, detail]) => <div key={name}><h3>{name}</h3><p>{detail}</p></div>)}</div>
  </section>;
}

function ProductMatrix({ project, renderMedia }: CaseProps) {
  const matrix = project.smart!.matrix;
  const [activeId, setActiveId] = useState(matrix[0].id);
  const active = matrix.find(item => item.id === activeId) || matrix[0];
  return <section className="case-section case-container smart-matrix">
    <SectionHeading title={<>DIFFERENT PRODUCTS.<br />DIFFERENT STORIES.</>} note="01 / PRODUCT MATRIX" />
    <p className="smart-section-intro">不同产品，需要不同的内容表达。</p>
    <div className="smart-matrix__layout"><div className="smart-matrix__list">
      {matrix.map((item, index) => <div key={item.id} className={`smart-matrix__row ${activeId === item.id ? 'is-active' : ''}`}>
        <button type="button" onMouseEnter={() => setActiveId(item.id)} onFocus={() => setActiveId(item.id)} onClick={() => setActiveId(item.id)} aria-expanded={activeId === item.id}>
          <span>{String(index + 1).padStart(2, '0')}</span><strong>{item.name}</strong><small>{item.chinese}</small>
        </button>
        <div className="smart-matrix__mobile-detail"><dl><div><dt>USER</dt><dd>{item.user}</dd></div><div><dt>SCENARIO</dt><dd>{item.scenario}</dd></div><div><dt>CONTENT</dt><dd>{item.content}</dd></div></dl>{renderMedia(item.mediaId)}</div>
      </div>)}
    </div><div className="smart-matrix__display"><div className="smart-matrix__image" key={active.mediaId}>{renderMedia(active.mediaId)}</div><dl><div><dt>USER</dt><dd>{active.user}</dd></div><div><dt>SCENARIO</dt><dd>{active.scenario}</dd></div><div><dt>CONTENT</dt><dd>{active.content}</dd></div></dl></div></div>
  </section>;
}

function FunctionToContent({ project }: { project: PortfolioProject }) {
  const [active, setActive] = useState(0);
  const flow = project.smart!.flow;
  return <section className="case-section case-container smart-flow">
    <SectionHeading title={<>FROM FUNCTION<br />TO CONTENT</>} note="02 / CONTENT TRANSLATION" />
    <p className="smart-section-intro">从产品功能，到用户真正能理解的内容表达。</p>
    <div className="smart-flow__desktop"><div className="smart-flow__scale"><span>TECH</span><span>CONTENT</span></div>
      <input type="range" min="0" max="3" step="1" value={active} onChange={event => setActive(Number(event.target.value))} aria-label="选择功能到内容的转译阶段" style={{ '--flow-progress': `${active / 3 * 100}%` } as CSSProperties} />
      <div className="smart-flow__tabs">{flow.map((step, index) => <button type="button" key={step.name} aria-pressed={active === index} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, '0')}</span>{step.name}</button>)}</div>
      <motion.div key={active} className="smart-flow__focus" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, ease }}><div><small>{flow[active].subtitle}</small><h3>{flow[active].name}</h3></div><p>{flow[active].items.join(' / ')}</p></motion.div>
      <div className="smart-flow__translations">{project.smart!.translations.map(pair => <div key={pair.tech}><span>{pair.tech}</span><ArrowRight size={20} /><strong>{pair.content}</strong></div>)}</div>
    </div>
    <div className="smart-flow__mobile">{flow.map((step, index) => <div key={step.name}><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.name}</h3><small>{step.subtitle}</small><p>{step.items.join(' / ')}</p></div>)}</div>
  </section>;
}

function AigcWorkflow({ project }: { project: PortfolioProject }) {
  const cases = project.smart!.aigcCases;
  const [caseIndex, setCaseIndex] = useState(0);
  const defaultSplit = () => window.matchMedia('(max-width: 700px)').matches ? 100 : 50;
  const [split, setSplit] = useState(defaultSplit);
  const active = cases[caseIndex];
  return <section className="case-section case-container smart-aigc">
    <SectionHeading title={<>AI IS A TOOL,<br />NOT THE RESULT.</>} note="03 / AIGC WORKFLOW" />
    <p className="smart-section-intro">AI 是内容生产流程的一部分，而不是最终结果。</p>
    <div className="smart-aigc__steps">{project.smart!.aigcSteps.map((step, index) => <div key={step.name}><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.name}</h3><p>{step.detail}</p></div>)}</div>
    <div className="smart-aigc__case-picker" role="group" aria-label="选择 AIGC 案例">{cases.map((item, index) => <button key={item.id} type="button" aria-pressed={caseIndex === index} onClick={() => { setCaseIndex(index); setSplit(defaultSplit()); }}>CASE {item.id}</button>)}</div>
    <div className="smart-aigc__compare" aria-label={`案例 ${active.id} 前后对比`}>
      <div className="smart-aigc__panel smart-aigc__panel--before">{active.beforeSrc && <img src={active.beforeSrc} alt="" />}<span>BEFORE</span><p>{active.before}</p><small>真实素材待替换</small></div>
      <div className="smart-aigc__panel smart-aigc__panel--after" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>{active.afterSrc && <img src={active.afterSrc} alt="" />}<span>AFTER</span><p>{active.after}</p><small>真实素材待替换</small></div>
      <div className="smart-aigc__divider" style={{ left: `${split}%` }} aria-hidden="true"><span>↔</span></div>
      <input className="smart-aigc__range" type="range" min="0" max="100" value={split} onChange={event => setSplit(Number(event.target.value))} aria-label="拖动查看原始素材与完成画面的对比" />
    </div>
    <div className="smart-aigc__mobile-switch" role="group" aria-label="切换前后画面"><button type="button" aria-pressed={split === 100} onClick={() => setSplit(100)}>BEFORE</button><button type="button" aria-pressed={split === 0} onClick={() => setSplit(0)}>AFTER</button></div>
  </section>;
}

function HardwareSelectedWork({ project, renderMedia }: CaseProps) {
  return <section className="case-section case-container smart-selected"><SectionHeading title="SELECTED WORK" note="04 / MEDIA" /><div className="selected-work-grid">{project.selectedIds.map((id, index) => <div key={id} className={`selected-work-grid__item selected-work-grid__item--${index % 7} smart-selected__item`}>{renderMedia(id)}</div>)}</div></section>;
}

export function HardwareCase({ project, renderMedia }: CaseProps) {
  return <><HardwareOverview project={project} /><ProductMatrix project={project} renderMedia={renderMedia} /><FunctionToContent project={project} /><AigcWorkflow project={project} /><HardwareSelectedWork project={project} renderMedia={renderMedia} /></>;
}

function PersonalOverview({ project }: { project: PortfolioProject }) {
  return <section className="case-overview case-container personal-overview"><h2>PERSONAL<br />MEDIA</h2><p className="personal-overview__statement">工作之外，我也持续进行个人内容创作。</p><p className="personal-overview__copy">目前主要包括长期运营的 Bilibili 音乐内容，以及正在尝试的抖音 / 小红书美食内容。不同题材的创作让我持续接触选题、画面表达、内容包装和平台内容逻辑。</p><div className="case-capabilities">{project.personal!.capabilities.map(([name, detail]) => <div key={name}><h3>{name}</h3><p>{detail}</p></div>)}</div></section>;
}

function MusicProject({ project, renderMedia }: CaseProps) {
  return <section className="case-section case-container personal-music"><SectionHeading title={<>BILIBILI<br />MUSIC PROJECT</>} /><p className="personal-section-intro">以音乐和情绪表达为核心的个人内容项目。</p><div className="personal-music__body"><div className="personal-music__hero">{renderMedia('music')}</div><div className="personal-music__details">{project.personal!.music.map(([name, detail]) => <div key={name}><h3>{name}</h3><p>{detail}</p></div>)}</div></div>
    <div className="personal-posts"><h3>SELECTED POSTS</h3><div>{project.personal!.posts.map(post => <article key={post.id}><div className="personal-posts__image">{renderMedia(post.mediaId)}</div><span>{post.id} / {post.type}</span><h4>{post.title}</h4><p>{post.description}</p></article>)}</div></div>
  </section>;
}

function FoodContent({ project, renderMedia }: CaseProps) {
  return <section className="case-section case-container personal-food"><div className="personal-food__intro"><div><SectionHeading title="FOOD CONTENT" /><span className="personal-food__status">ONGOING PROJECT</span><p>DOUYIN<br />XIAOHONGSHU / REDNOTE</p></div><p>目前正在尝试新的美食内容方向，从菜品研发、选题、拍摄方式、画面风格到账号内容形式都还在持续探索。</p></div><div className="personal-food__themes">{project.personal!.food.map(([name, detail]) => <div key={name}><strong>{name}</strong><span>{detail}</span></div>)}</div><div className="personal-food__diary">{project.personal!.diaryIds.map((id, index) => <div key={id} className={`personal-food__diary-item personal-food__diary-item--${index}`}>{renderMedia(id)}<span>{['EXPERIMENT', 'PROCESS', 'ONGOING', 'VISUAL NOTES'][index]}</span></div>)}</div></section>;
}

function CreativePractice({ project, renderMedia }: CaseProps) {
  const reduceMotion = useReducedMotion();
  return <section className="case-section case-container personal-practice"><SectionHeading title={<>KEEP MAKING.<br />KEEP TESTING.</>} /><p>个人项目对我来说也是持续测试内容方向、视觉表达和平台反馈的一部分。</p><div className="personal-practice__rows">{project.personal!.practice.map(([name, detail], index) => <motion.div key={name} initial={reduceMotion ? false : { opacity: .55, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: reduceMotion ? 0 : .5, delay: reduceMotion ? 0 : index * .09, ease }}><strong>{name}</strong><span>{detail}</span><div>{renderMedia(['post-1', 'food-1', 'food-2', 'cover'][index])}</div></motion.div>)}</div></section>;
}

export function PersonalCase({ project, renderMedia }: CaseProps) {
  return <><PersonalOverview project={project} /><MusicProject project={project} renderMedia={renderMedia} /><FoodContent project={project} renderMedia={renderMedia} /><CreativePractice project={project} renderMedia={renderMedia} /></>;
}
