import { RecognitionReveal as Reveal } from './RecognitionMotion';
import './panda-reflection.css';
import { motion, useReducedMotion } from 'framer-motion';
import { recognitionEase } from './RecognitionMotion';
import PandaTakeawayMatrix from './PandaTakeawayMatrix';

type AwardRecord = { label: string; title: string; event: string; officialUrl: string | null; document?: { pdfUrl: string; previewUrl: string; previewMediaId: string; mediaIds: string[] } };
export const provincialAward: AwardRecord =
  { label: '01 / PROVINCIAL RECOGNITION', title: '四川金奖', event: '2026 四川旅游商品大赛', officialUrl: 'https://mp.weixin.qq.com/s/CWCSMpvxcEFLmxhwojw-yg',
    document: {
      pdfUrl: `${import.meta.env.BASE_URL}assets/projects/panda-awards/official/sichuan-awards-2026.pdf`,
      previewUrl: `${import.meta.env.BASE_URL}assets/projects/panda-awards/official/sichuan-awards-notice.png`,
      previewMediaId: 'panda-official-sichuan-notice',
      mediaIds: ['panda-official-sichuan-list', 'panda-official-sichuan-notice'],
    } };
export const nationalAward: AwardRecord = { label: '02 / NATIONAL RECOGNITION', title: '全国银奖', event: '2026 中国旅游商品大赛', officialUrl: 'https://www.htcea.com/nd.jsp?fromColId=2&id=96' };
export const pandaAwardRecords = [provincialAward, nationalAward];
const reflections = [
  { title: '从概念尝试，到更完整的视觉呈现。', body: '项目早期围绕熊猫 IP、地域文化元素与礼盒包装展开了多轮视觉尝试。在版本调整过程中，我参与了相关视觉内容的制作与优化，逐步理解包装设计不仅需要考虑画面效果，还需要兼顾产品定位、文化元素、信息层级与实际展示场景。', keywords: 'PACKAGING / IP VISUAL / VISUAL ITERATION' },
  { title: '让不同媒介中的产品表达保持关联。', body: '随着项目推进，我参与制作了产品展示图、产品手册、软件界面展示及相关宣传物料。面对不同尺寸、用途与传播媒介，需要重新组织内容重点，并协调视觉风格与信息表达，使各类物料既满足独立使用需求，也能够呈现相对统一的产品形象。', keywords: 'PRODUCT VISUAL / MANUAL / CONTENT PRODUCTION' },
  { title: '在实际制作中探索更高效的工作方式。', body: '项目过程中，我将 AIGC 工具运用到视觉探索、产品图片和宣传素材的辅助制作中，并结合人工调整完善最终内容。这段经历让我更加重视生成结果的准确性、视觉一致性以及实际交付质量，而不只是单纯追求生成速度。', keywords: 'AIGC / VISUAL PRODUCTION / EXECUTION' },
];
function AwardRecordDisplay({ onOpenDocument }: { onOpenDocument: (ids: string[], index?: number) => void }) {
  const reduced = useReducedMotion();
  const openDocumentPreview = () => {
    const document = provincialAward.document;
    if (!document) return;
    // Resource identity determines the target; array position is not a PDF page number.
    const previewIndex = document.mediaIds.indexOf(document.previewMediaId);
    if (previewIndex >= 0) onOpenDocument(document.mediaIds, previewIndex);
  };
  // A stationary shared viewport trigger keeps the final image reveal reliable.
  const enter = (delay: number, duration = .6, y: number | string = 18, scale = 1) => ({
    hidden: { opacity: 0, y, scale },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: recognitionEase } },
  });
  return <motion.section className="p02-panda-record p02-panda-record--honors" aria-label="奖项与荣誉展示"
    initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: .15 }}>
    <div className="p02-panda-record__copy">
      <motion.div className="p02-award-enter" variants={enter(0, .45, 12)}><span className="p02-finale-label">AWARD RECORD / 2026</span></motion.div>
      <h3>{['从地域文化创意，', '到全国赛事认可。'].map((line, index) =>
        <span className="p02-recognition-line" key={line}><motion.span className="p02-award-enter" variants={enter(.25 + index * .15, .6, '100%')}>{line}</motion.span></span>)}</h3>
      <motion.div className="p02-award-enter" variants={enter(.65, .6, 12)}><p>「蜀锦趣伴」围绕四川地域文化与熊猫 IP 展开，将文化视觉、文创礼盒和 AI 互动体验融入同一产品表达。项目先后获得四川省级金奖和全国银奖，形成了从产品设计、视觉呈现到赛事展示的阶段性成果。</p></motion.div>
      <div className="p02-panda-record__awards">{pandaAwardRecords.map((record, index) =>
        <motion.div className="p02-award-enter" key={record.label} variants={enter(1 + index * .12, .55)}>
          <article className={index === 0 ? 'is-gold' : 'is-silver'}>
            <motion.span aria-hidden="true" className="p02-recognition-rule" variants={{
              hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: reduced ? 0 : .7, delay: reduced ? 0 : 1 + index * .12, ease: recognitionEase } },
            }} />
            <small>{record.label}</small><h4>{record.title}</h4><p>{record.event}<br />城市礼物创意设计主题</p>
          </article>
        </motion.div>)}</div>
      {provincialAward.document && <motion.div className="p02-award-document p02-award-enter" variants={enter(1.3, .55)}>
        <button type="button" className="p02-award-document__preview" onClick={openDocumentPreview} aria-label="查看四川金奖官方获奖名单">
          <img src={provincialAward.document.previewUrl} alt="2026 四川旅游商品大赛获奖名单发布通知原始 PDF 第 1 页" width="1191" height="1684" loading="lazy" />
        </button>
        <div><span className="p02-finale-label">OFFICIAL DOCUMENT / 2026</span><h5>四川金奖 · 获奖名单</h5>
          <p>四川省旅游商品与装备协会<br />蓉城智能熊猫 / warm view / 成都市</p>
          <button type="button" onClick={openDocumentPreview}>查看名单 ↗</button>
          <a href={provincialAward.document.pdfUrl} target="_blank" rel="noopener noreferrer">原始 PDF ↗</a>
        </div>
      </motion.div>}
    </div>
    <motion.div className="p02-panda-record__honors p02-award-enter" variants={{
      hidden: { opacity: 0, y: 24, scale: .96, filter: 'blur(4px)' },
      visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: reduced ? 0 : .8, delay: reduced ? 0 : 2.05, ease: recognitionEase } },
    }}>
      <img src={`${import.meta.env.BASE_URL}assets/projects/panda-awards/award-honors-transparent.png`} width="900" height="562" alt="2026 四川旅游商品大赛金奖证书、中国旅游商品大赛银奖证书及全国银牌组合展示" />
    </motion.div>
  </motion.section>;
}

export default function PandaReflection({ onOpenDocument }: { onOpenDocument: (ids: string[], index?: number) => void }) {
  const reduced = useReducedMotion();
  // Only stationary containers are observed; children keep their final state once revealed.
  const reflectionEnter = (delay: number, y = 18, duration = .6) => ({
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: recognitionEase } },
  });
  return <div className="p02-panda-finale">
    <AwardRecordDisplay onOpenDocument={onOpenDocument} />
    <section className="p02-panda-reflection" aria-label="我的工作与项目复盘">
      <motion.div initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: .15 }}>
        <motion.div variants={reflectionEnter(0)}><span className="p02-finale-label">WORK REFLECTION / MY CONTRIBUTION</span></motion.div>
        <h3 className="p02-panda-reflection__title">{['从单一视觉制作，', '到完整的产品内容表达。'].map((line, index) =>
          <motion.span key={line} variants={reflectionEnter(.14 + index * .14)}>{line}</motion.span>)}</h3>
        <div className="p02-panda-reflection__intro">
          <motion.p variants={reflectionEnter(.42)}>在 AI Panda 项目中，我参与了从早期视觉探索到后续产品展示的多项内容制作工作。随着项目不断推进，工作范围也从相对独立的视觉物料，逐步延伸至包装调整、产品说明、软件展示与宣传内容制作。</motion.p>
          <motion.p variants={reflectionEnter(.56)}>通过不同阶段的制作与反复调整，我开始更加关注产品信息如何被准确表达，以及不同媒介之间如何保持统一的视觉语言。</motion.p>
        </div>
      </motion.div>
      <div className="p02-panda-reflection__topics">{reflections.map((item, index) =>
        <motion.div key={item.title} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: .15 }}>
          <motion.div className="p02-panda-reflection__topic-motion" variants={reflectionEnter(index * .15, 24, .65)}>
            <article>
              <motion.i aria-hidden="true" className="p02-panda-reflection__rule" variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: reduced ? 0 : .65, delay: reduced ? 0 : index * .15, ease: recognitionEase } } }} />
              <span>{String(index + 1).padStart(2, '0')}</span><h4>{item.title}</h4><p>{item.body}</p><small>{item.keywords}</small>
            </article>
          </motion.div>
        </motion.div>)}</div>
    </section>
    <section className="p02-panda-closing p02-panda-closing--matrix" aria-label="AI Panda 项目结束语"><Reveal><span className="p02-finale-label">PROJECT TAKEAWAYS / AI PANDA</span></Reveal><div className="p02-panda-closing__copy"><motion.h3 initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: .1 }}>{['设计不止于完成一张画面，', '更在于让产品被', '准确地看见与理解。'].map((line, index) => <motion.span className={`p02-takeaway-title__line is-line-${index + 1}`} key={line} variants={reflectionEnter(.12 + index * .14, 12, .55)}>{line}</motion.span>)}</motion.h3><Reveal delay={.9}><div><p>从包装视觉的反复调整，到产品手册、展示内容及宣传物料的制作，这段经历让我对产品内容的完整性有了更具体的认识。</p><p>对我而言，视觉制作不仅是实现某一个画面，也包括理解信息、适配媒介、处理细节，以及将内容最终转化为能够实际使用的交付成果。</p></div><Reveal delay={.2}><small>AI PANDA<br />WARMVIEW / 2026</small></Reveal></Reveal></div><PandaTakeawayMatrix /></section>
  </div>;
}
