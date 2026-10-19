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

function AiWorkflow({ project, renderMedia }: CaseProps) {
  const reduceMotion = useReducedMotion();
  const cases = [
    {
      id: '01',
      title: 'PRODUCT VISUAL TO VIDEO',
      description: '从真实产品基础素材出发，完成图像处理、视觉方向、关键帧与最终视频的完整链路。',
      steps: ['Original Product Image', 'AI Image Processing', 'Product Visual', 'Storyboard / Key Frames', 'AI Video', 'Post Production', 'Final Video'],
      media: ['workflow-original', 'workflow-process', 'workflow-result', 'workflow-frames', 'workflow-video'],
    },
    {
      id: '02',
      title: 'CONCEPT TO PRESENTATION',
      description: '从概念和 AI Persona 出发，将视觉方向推进为产品原型、页面与最终展示。',
      steps: ['Concept', 'Prompt / AI Persona', 'Visual Direction', 'Product Visual', 'Prototype / Page', 'Final Presentation'],
      media: ['workflow-concept', 'horse-hero', 'workflow-result', 'workflow-prototype'],
    },
  ];
  const [active, setActive] = useState(0);
  const current = cases[active];
  return <section className="case-section case-container smart-aigc smart-workflow">
    <SectionHeading title={<>AI IS A TOOL,<br />NOT THE RESULT.</>} note="01 / AI WORKFLOW" />
    <p className="smart-section-intro">AI 不是单独的视觉效果，而是被放进真实内容生产流程中，最终服务于产品表达与视频输出。</p>
    <div className="smart-aigc__case-picker" role="tablist" aria-label="选择 AI Workflow 案例">{cases.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={active === index} aria-controls="smart-workflow-panel" onClick={() => setActive(index)}>CASE {item.id}</button>)}</div>
    <motion.div id="smart-workflow-panel" role="tabpanel" key={current.id} initial={reduceMotion ? false : { opacity: .55, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .45, ease }}>
      <div className="smart-workflow__summary"><span>CASE {current.id}</span><h3>{current.title}</h3><p>{current.description}</p></div>
      <ol className="smart-workflow__steps">{current.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></li>)}</ol>
      <div className={`smart-workflow__gallery smart-workflow__gallery--${current.media.length}`}>{current.media.map((id, index) => <div key={id} className={`smart-workflow__media smart-workflow__media--${index}`}>{renderMedia(id)}</div>)}</div>
    </motion.div>
  </section>;
}

function AiPanda({ renderMedia }: CaseProps) {
  const experience = [
    ['PRODUCT CONCEPT', '围绕 AI 陪伴需求梳理产品概念、定位与核心体验。'],
    ['COMPANION LOGIC', '将情绪陪伴、日常互动与产品能力组织成可理解的内容。'],
    ['SOFTWARE EXPERIENCE', '参与功能规划、页面逻辑、UI、交互原型与产品协同。'],
  ];
  return <section className="case-section case-container smart-product smart-panda">
    <SectionHeading title={<>AI PANDA.<br />COMPANION EXPERIENCE.</>} note="02 / AI PANDA" />
    <p className="smart-section-intro">PROJECT 02 中最完整的产品案例：从产品概念与陪伴逻辑，到视觉、软件体验、宣传内容和产品视频。</p>
    <div className="smart-product__hero">{renderMedia('panda-hero')}</div>
    <div className="smart-product__story"><div><h3>FROM PRODUCT<br />TO EXPERIENCE.</h3><p>产品表达不只停留在硬件外观，而是同时梳理陪伴逻辑、使用场景和软件体验，让产品在内容与交互中形成一致认知。</p></div><div className="smart-product__facts">{experience.map(([name, detail]) => <div key={name}><span>{name}</span><p>{detail}</p></div>)}</div></div>
    <div className="smart-product__mosaic"><div className="smart-product__mosaic-main">{renderMedia('panda-scene')}</div><div>{renderMedia('panda-campaign')}</div><div>{renderMedia('panda-video')}</div></div>
    <div className="smart-software"><div><span>MINI PROGRAM / SOFTWARE</span><h3>软件体验也属于产品体验。</h3><p>原本安家兔相关的小程序工作被归入 AI PANDA，集中呈现功能规划、页面逻辑、UI、交互原型与跨团队产品协同。</p></div><div className="smart-software__media">{renderMedia('panda-mini-program')}</div><div className="smart-software__media">{renderMedia('panda-prototype')}</div></div>
  </section>;
}

function WaiWai({ project, renderMedia }: CaseProps) {
  const reduceMotion = useReducedMotion();
  const items = [
    ['AI TECHNOLOGY', '理解模型、智能体与业务之间的关系。', 'waiwai-hero'],
    ['ENTERPRISE AGENT', '将企业能力组织为可感知、可使用的智能服务。', 'waiwai-hero'],
    ['KNOWLEDGE BASE', '围绕企业知识沉淀、检索与场景调用进行内容表达。', 'waiwai-knowledge'],
    ['SCENARIO APPLICATION', '把技术能力转译到具体企业服务与业务场景。', 'waiwai-knowledge'],
    ['BUSINESS CONTENT', '完成产品能力、商业价值与宣传内容之间的连接。', 'waiwai-campaign'],
  ];
  const [active, setActive] = useState(0);
  return <section className="case-section case-container smart-waiwai">
    <SectionHeading title={<>WAIWAI.<br />ENTERPRISE AI AGENT.</>} note="03 / WAIWAI" />
    <p className="smart-section-intro">以企业智能体、知识库和场景应用为核心，将 AI 技术理解转译为企业服务能力与商业表达。</p>
    <div className="smart-matrix__layout"><div className="smart-matrix__list">{items.map((item, index) => <div key={item[0]} className={`smart-matrix__row ${active === index ? 'is-active' : ''}`}><button type="button" onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} aria-expanded={active === index}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item[0]}</strong><small>{item[1]}</small></button><div className="smart-matrix__mobile-detail">{renderMedia(item[2])}</div></div>)}</div><div className="smart-matrix__display"><motion.div className="smart-matrix__image" key={items[active][2]} initial={reduceMotion ? false : { opacity: .55, scale: .985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduceMotion ? 0 : .4, ease }}>{renderMedia(items[active][2])}</motion.div><p className="smart-waiwai__note">{items[active][1]}</p></div></div>
  </section>;
}

function TourGuide({ renderMedia }: CaseProps) {
  const steps = [['PRODUCT', '移动电源与 AI 导游能力的产品组合'], ['NEED', '游客补能、导览与即时信息需求'], ['SCENARIO', '景区 / 城市漫游 / 文旅服务点'], ['BUSINESS', '设备服务、场景合作与方案包装']];
  return <section className="case-section case-container smart-tour">
    <SectionHeading title={<>AI TOUR GUIDE.<br />SCENE TO BUSINESS.</>} note="04 / AI TOUR GUIDE" />
    <p className="smart-section-intro">一个更紧凑的产品案例，重点体现产品理解、商业分析与文旅场景转化。</p>
    <div className="smart-tour__layout"><div className="smart-tour__hero">{renderMedia('tour-guide-hero')}</div><div className="smart-tour__copy"><p>从游客真实需求出发，将设备能力、文旅服务与商业模式组织成可对外沟通的产品方案。</p>{steps.map(([name, detail], index) => <div key={name}><span>{String(index + 1).padStart(2, '0')} / {name}</span><strong>{detail}</strong></div>)}</div></div>
    <div className="smart-tour__support"><div>{renderMedia('tour-guide-scene')}</div><div>{renderMedia('tour-guide-video')}</div></div>
  </section>;
}

function FiveElementsHorse({ project, renderMedia }: CaseProps) {
  const reduceMotion = useReducedMotion();
  const personas = project.smart!.personas!;
  const [active, setActive] = useState(0);
  const current = personas[active];
  return <section className="case-section case-container smart-horse">
    <SectionHeading title={<>FIVE ELEMENTS<br />HORSE.</>} note="05 / FIVE ELEMENTS HORSE" />
    <p className="smart-section-intro">原创产品概念以马年生肖与五行文化为起点，建立五组人格映射、心理锚点与 AI Persona，并延伸至众筹策划。</p>
    <div className="smart-horse__hero">{renderMedia('horse-hero')}</div>
    <ol className="smart-horse__concept"><li>马年生肖</li><li>五行文化</li><li>人格映射</li><li>心理锚点</li><li>AI Persona</li></ol>
    <div className="smart-horse__picker" role="tablist" aria-label="选择五行马角色">{personas.map((persona, index) => <button key={persona.name} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, '0')}</span>{persona.name}<small>{persona.chinese}</small></button>)}</div>
    <motion.div className="smart-horse__persona" key={current.name} role="tabpanel" initial={reduceMotion ? false : { opacity: .55, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .45, ease }}><div>{renderMedia(current.mediaId)}</div><dl><div><dt>ELEMENT / MATERIAL</dt><dd>{current.element} · {current.material}</dd></div><div><dt>PERSONALITY</dt><dd>{current.personality}</dd></div><div><dt>PROMPT DIRECTION</dt><dd>{current.prompt}</dd></div><div><dt>INTERACTION STYLE</dt><dd>{current.interaction}</dd></div><div><dt>TARGET SCENARIO</dt><dd>{current.scenario}</dd></div></dl></motion.div>
    <div className="smart-crowdfunding"><div><span>CROWDFUNDING</span><h3>真实众筹详情页预留</h3><p>后续上传长图后可直接替换，不需要重新调整页面结构。当前区域仅标示正确的纵向浏览比例。</p></div><div className="smart-crowdfunding__scroll" tabIndex={0} aria-label="众筹详情页滚动预览">{renderMedia('horse-crowdfunding')}</div></div>
  </section>;
}

function BrandWork({ renderMedia }: CaseProps) {
  const execution = ['设计', '对接打印厂家', '与厂家设计师沟通', '制作跟进', '物料到场', '现场安装 / 张贴'];
  const media = ['brand-logo', 'brand-brochure', 'brand-wall', 'brand-exhibition', 'brand-event', 'brand-visit'];
  return <section className="case-section case-container smart-brand">
    <SectionHeading title={<>BRAND WORK.<br />FROM SCREEN TO SITE.</>} note="06 / BRAND WORK" />
    <p className="smart-section-intro">从品牌识别、宣传手册和线下空间，到展会、活动、来访记录与公众号内容，持续完成线上与线下的品牌表达。</p>
    <div className="smart-brand__gallery">{media.map((id, index) => <div key={id} className={`smart-brand__media smart-brand__media--${index}`}>{renderMedia(id)}</div>)}</div>
    <div className="smart-brand__execution"><h3>OFFLINE EXECUTION</h3><ol>{execution.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></li>)}</ol></div>
    <div className="smart-brand__content"><div><span>CONTENT & SOCIAL</span><h3>品牌内容不止于物料。</h3><p>老板 IP：产品介绍 / 招聘 / 商务合作 / 技术合作</p><p>品牌账号：产品测评 / 开箱 / 功能介绍</p></div><div><span>MY ROLE</span><p>选题 / 脚本 / 拍摄 / 剪辑 / 发布</p><strong>招聘类代表内容｜单条 10W+ 播放</strong></div></div>
  </section>;
}

function SelectedProductVideos({ project, renderMedia }: CaseProps) {
  return <section className="case-section case-container smart-videos"><SectionHeading title={<>SELECTED PRODUCT<br />VIDEOS.</>} note="07 / SELECTED PRODUCT VIDEOS" /><p className="smart-section-intro">没有单独展开为完整案例，但确实参与制作的产品视频。</p><div className="smart-videos__grid">{project.smart!.selectedVideos!.map((video, index) => <article key={video.mediaId} className={`smart-videos__item smart-videos__item--${index}`}><div>{renderMedia(video.mediaId)}</div><span>{String(index + 1).padStart(2, '0')} / {video.type}</span><h3>{video.product}</h3><p>{video.role}</p></article>)}</div></section>;
}

function HardwareSelectedWork({ project, renderMedia }: CaseProps) {
  return <section className="case-section case-container smart-selected"><SectionHeading title="SELECTED WORK" note="04 / MEDIA" /><div className="selected-work-grid">{project.selectedIds.map((id, index) => <div key={id} className={`selected-work-grid__item selected-work-grid__item--${index % 7} smart-selected__item`}>{renderMedia(id)}</div>)}</div></section>;
}

export function HardwareCase({ project, renderMedia }: CaseProps) {
  return <><HardwareOverview project={project} /><AiWorkflow project={project} renderMedia={renderMedia} /><AiPanda project={project} renderMedia={renderMedia} /><WaiWai project={project} renderMedia={renderMedia} /><TourGuide project={project} renderMedia={renderMedia} /><FiveElementsHorse project={project} renderMedia={renderMedia} /><BrandWork project={project} renderMedia={renderMedia} /><SelectedProductVideos project={project} renderMedia={renderMedia} /></>;
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
