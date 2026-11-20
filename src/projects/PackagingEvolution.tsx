import { optimizedAsset } from '../assetDelivery';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import CardSwap, { Card } from '../components/react-bits/CardSwap/CardSwap';
import FadeContent from '../components/react-bits/FadeContent/FadeContent';
import { packagingUnits, packagingReference, conceptCharacters, conceptProduct } from './packagingEvolutionData';
import './packaging-evolution.css';
type RenderMedia = (id: string, className?: string, autoPreview?: boolean) => ReactNode;
type LightboxCopy = { label?: string; title?: string; body?: string; keywords?: string };
type Open = (ids: string[], index?: number, copy?: LightboxCopy[]) => void;
type Image = typeof packagingReference;
const packagingVersions = [
 { label: 'STAGE 01', category: 'PRODUCT CONCEPT', title: '产品构想与方案梳理', cardTitle: '产品构想与方案梳理', assets: ['evolution-reference'] },
 { label: 'STAGE 02', category: 'VISUAL EXPLORATION', title: '蜀锦趣伴 · 初版', cardTitle: '蜀锦趣伴 · 初版', assets: ['evolution-playful-pair'] },
 { label: 'STAGE 03', category: 'FINAL DESIGN', title: '蜀锦趣伴 · 终版', cardTitle: '蜀锦趣伴 · 终版', assets: ['evolution-cultural-open'] },
];
function Photo({ item, open, ids = [item.id], className = '' }: { item: Image; open: Open; ids?: string[]; className?: string }) {
 return <button type="button" className={`panda-product-photo ${className}`} onClick={() => open(ids, ids.indexOf(item.id), ids.map(() => ({ label: 'PRODUCT EVOLUTION' })))} aria-label={`放大查看${item.title}`}><img src={item.preview} alt={item.title} loading="lazy" decoding="async" /><span>查看原图 ↗</span></button>;
}
function CharacterArtwork({ item }: { item: Image }) {
 return <div className="panda-product-photo panda-character-artwork"><img src={item.preview} alt={item.title} loading="lazy" decoding="async" /></div>;
}
function ConceptDetail({ open }: { open: Open }) {
 const poses = conceptCharacters.slice(1);
 return <div className="panda-product-story panda-concept-story">
  <header className="panda-concept-hero">
   <div><span>STAGE 01 / PRODUCT CONCEPT</span><h3 className="panda-concept-title"><span>从城市文化出发，</span><span>构想智能旅游商品。</span></h3><p>项目以成都熊猫文化为起点，探索智能互动与旅游商品的结合。围绕熊猫角色「元元」展开 IP 形象设计、硬件功能梳理与软件体验规划，为后续文旅礼盒方案奠定基础。</p></div>
   <CharacterArtwork item={conceptCharacters[0].render} />
  </header>
  <section className="panda-character-section">
   <div className="panda-character-intro"><div><h4>CHARACTER DESIGN / IP DEVELOPMENT</h4><h3>元元 YUANYUAN</h3><h5>从产品角色，到品牌 IP。</h5></div><div><p>以熊猫作为智能陪伴产品的核心角色，围绕圆润亲和的造型与不同动作姿态展开形象设计，形成具有辨识度的「元元」IP。</p><p>「元元」的命名呼应公司名称「旭创启元」，将产品角色与品牌建立联系，并通过多种姿态延展角色的视觉表现。</p></div></div>
   <div className="panda-character-mosaic">{conceptCharacters.map((item, i) => <figure key={item.label} className={`panda-character-pose pose-${i}`}><Photo item={item.sketch} open={open} ids={conceptCharacters.map(x => x.sketch.id)} /><figcaption>{item.label}</figcaption></figure>)}</div>
  </section>
  <section className="panda-realization">
   <h4>PRODUCT REALIZATION / AI 熊猫产品形象</h4><h3>从角色形象，<br />走向智能陪伴产品。</h3>
   <div className="panda-realization-grid"><Photo item={conceptProduct} open={open} className="panda-realization-main" /><div className="panda-realization-poses"><div className="panda-realization-pose-grid">{poses.map(item => <CharacterArtwork key={item.label} item={item.render} />)}</div></div><p className="panda-realization-caption">AI 熊猫 / 产品展示</p><p className="panda-realization-caption">元元 / 彩色角色与场景概念效果</p></div>
  </section>
  <section className="panda-interaction-plans" aria-label="智能交互方案">
   <div><h4>HARDWARE / 硬件方案</h4><h5>让角色具备互动能力。</h5><p>考虑开发周期、稳定性与成本，参与 ESP32-C3 方案选型，梳理 AI 熊猫的语音交互、LCD 动态表情与右手舵机动作等核心功能。</p></div>
   <div><h4>SOFTWARE / 软件体验</h4><h5>延伸个性化陪伴体验。</h5><p>参与规划小程序端的角色设定、性格描述、音色切换、互动记录及陪伴体验等功能，探索可定制的智能互动方式。</p><p className="panda-plan-status">软件内容为阶段性功能规划及开发准备，不代表所有功能均已正式上线。</p></div>
  </section>
 </div>;
}
function VisualDetail({ stage, open }: { stage: number; open: Open }) {
 const unit = packagingUnits[stage];
 const main = unit.products.find(x => x.id === (stage === 0 ? 'evolution-playful-pair' : 'evolution-cultural-open'))!;
 const detail = unit.packaging.find(x => x.id === (stage === 0 ? 'evolution-v2-back' : 'evolution-v3-front'))!;
 const packageFaces = unit.packaging.filter(x => x.id !== detail.id);
 const closedBox = unit.products.find(x => x.id === 'evolution-v2-closed');
 const surfaces = stage === 0 && closedBox
  ? [packageFaces[0], closedBox, packageFaces[2], packageFaces[1]]
  : packageFaces;
 const products = unit.products.filter(x => ['evolution-cultural-pair','evolution-cultural-travel'].includes(x.id));
 return <div className="panda-product-story">
  {stage === 0 && <section className="panda-combination-intro"><div><h4>STAGE 02 / VISUAL EXPLORATION</h4><span>01 / PRODUCT COMBINATION</span><h3>从单一角色，<br />拓展为成套旅游商品。</h3><p>以 AI 熊猫为核心起点，为形成符合旅游商品大赛要求的成套产品方案，将金丝猴纳入礼盒组合。AI 熊猫的智能语音陪伴与金丝猴的 NFC 故事互动，构成两种不同的互动体验。</p></div><Photo item={main} open={open} /></section>}
  <header><span>{stage === 0 ? '02 / VISUAL EXPLORATION' : 'STAGE 03 / FINAL DESIGN'}</span><h3>{stage === 0 ? '让城市风景，成为礼盒的一部分。' : '从城市探索，到文化表达。'}</h3><p>{stage === 0 ? '初版以明快的蓝紫色调、趣味字体与角色形象建立亲和力，并在包装背面融入人民公园、宽窄巷子、锦里、春熙路等成都代表性景点，将城市地标串联成一幅趣味地图。通过包装的多面设计，让礼盒成为可以阅读和探索的成都城市印象。' : '终版以白绿配色重新组织礼盒视觉，将竹叶、山水、传统建筑与现代城市地标等元素转化为统一的线描语言，形成更加简洁、协调的文化表达。在保留成都地域辨识度的同时，进一步统一「蜀锦趣伴」的产品主题、角色形象与礼盒视觉。'}</p></header>
  {stage === 1 && <section><h4>MAIN VISUAL / 礼盒主视觉</h4><Photo item={main} open={open} /></section>}
  <section><h4>{stage === 0 ? 'CITY MAP / 城市文化设计' : 'CULTURAL DETAILS / 文化线描'}</h4><p>{stage === 0 ? '将成都城市地图与景点插画组织进包装背面，让智能旅游商品的定位转化为可阅读的视觉内容。' : '延续相同的成都文旅主题，从鲜明色彩与城市地图，转向白底绿色与文化线描；变化的是视觉表达方式。'}</p><Photo item={detail} open={open} className="is-design" /></section>
  <section><h4>PACKAGING SURFACES / 包装多视图</h4><div className={`panda-product-surfaces${stage === 0 ? ' panda-product-surfaces--initial' : ''}`}>{surfaces.map(item => <Photo key={item.id} item={item} open={open} ids={surfaces.map(x => x.id)} />)}</div></section>
  {stage === 1 && <section><h4>PRODUCT VISUALS / 产品效果</h4><div className="panda-product-results">{products.map(item => <Photo key={item.id} item={item} open={open} ids={products.map(x => x.id)} />)}</div></section>}
 </div>;
}

export default function PackagingEvolution({ renderMedia, open }: { renderMedia: RenderMedia; open: (ids: string[], index?: number, copy?: LightboxCopy[]) => void }) {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [detailRun, setDetailRun] = useState(0);
  const detailRef = useRef<HTMLDivElement>(null);
  const current = selected === null ? null : packagingVersions[selected];

  useEffect(() => {
    if (!current) return;
    const projectOverlay = detailRef.current?.closest<HTMLElement>('.case-overlay');
    const previousOverflow = projectOverlay?.style.overflow;
    const previousScrollTop = projectOverlay?.scrollTop ?? 0;
    if (projectOverlay) projectOverlay.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => {
      detailRef.current?.focus();
      detailRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => {
      window.cancelAnimationFrame(frame);
      if (projectOverlay) {
        projectOverlay.style.overflow = previousOverflow ?? '';
        projectOverlay.scrollTop = previousScrollTop;
      }
    };
  }, [current, detailRun]);

  const openVersion = (index: number) => {
    if (index !== active) return;
    setDetailRun(run => run + 1);
    setSelected(index);
  };

  return <div className={`p02-block p02-packaging${current ? ' is-detail' : ''}`}>
    <div className="p02-block__intro p02-packaging__intro" aria-hidden={current ? true : undefined}>
      <span>PRODUCT EVOLUTION</span>
      <h3>从产品构想，<br />到最终定型。</h3>
    </div>
    <div className="p02-packaging__stage" aria-hidden={current ? true : undefined}>
      <CardSwap
        width={720}
        height={450}
        cardDistance={54}
        verticalDistance={48}
        depth={72}
        skewAmount={1}
        visibleCards={3}
        autoplay={false}
        draggable
        bounce={0.12}
        parallax={0.16}
        hoverSpread={0.05}
        dim={0.42}
        cardRadius={16}
        intro
        theme="dark"
        onChange={setActive}
        onCardClick={openVersion}
      >
        {packagingVersions.map((version, index) => <Card key={version.label} customClass="p02-packaging-card">
          <div className="p02-packaging-card__inner">
            <header><small>{version.label} / {version.category}</small><strong>{version.cardTitle}</strong></header>
            <div className="p02-packaging-card__media">{index === 0 ? <div className="project-media"><img src={optimizedAsset(`${import.meta.env.BASE_URL}assets/projects/panda-packaging/evolution/yuanyuan-concept-atlas.png`)} alt="元元熊猫 IP 诞生图鉴" /></div> : renderMedia(version.assets[0])}</div>
            <footer><span>{String(index + 1).padStart(2, '0')} / 03</span><small>{index === active ? 'CLICK FRONT CARD TO VIEW DETAIL ↘' : 'CLICK TO BRING FORWARD'}</small></footer>
          </div>
        </Card>)}
      </CardSwap>
      {selected === null && <p className="p02-packaging__hint">点击当前阶段查看详情</p>}
    </div>
    {current && <div ref={detailRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`${current.title} 阶段详情`} className="p02-packaging-detail" key={`${current.label}-${detailRun}`}>
      <div className="p02-packaging-detail__topbar">
        <button type="button" onClick={() => setSelected(null)}><ArrowLeft /><span>返回上一页</span></button>
        <span className="p02-packaging-detail__label">{current.label}</span>
      </div>
      <FadeContent container=".p02-packaging-detail" effect="develop" duration={1.0} ease="power2.out" stagger={0.14} staggerFrom="start" trigger="mount" once initialOpacity={0} className="p02-packaging-story">
        {selected === 0 ? <ConceptDetail open={open} /> : <VisualDetail stage={selected === 1 ? 0 : 1} open={open} /> }
      </FadeContent>
    </div>}
  </div>;
}
