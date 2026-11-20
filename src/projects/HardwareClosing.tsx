import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './hardware-closing.css';

const reflections = [
  '在旭创启元的这段工作经历中，我接触了更多不同类型的 AI 产品，也尝试了更加多样的内容制作方式。从产品视觉、宣传物料到 AIGC 视频，不同项目让我逐渐跳出了只关注单个画面或视频的习惯，开始思考内容与产品本身的关系。',
  '相比以往，我开始更加主动地理解产品特征、梳理功能卖点，并根据应用场景选择合适的表达方式。我逐渐认识到，好的视觉内容不只是完成制作需求，还需要让观看者更容易理解产品，以及它所传递的信息。',
  'AIGC 是这段经历中很重要的一部分。它拓展了我的创作方式，让一些受拍摄条件和制作成本限制的视觉想法有了实现的可能。但实际项目也让我意识到，生成效果只是起点，如何保持产品的一致性、控制细节，并将不同工具的输出整合为真正可用的作品，同样重要。',
  '这段经历并没有让我形成一套固定的创作公式。相反，它让我学会在不同需求中不断调整方法，也更加明确自己希望继续积累的能力：既能理解内容为什么这样做，也能亲自把它完成。',
];
const habits = [
  ['UNDERSTAND', '理解产品与使用场景'],
  ['EXPLORE', '探索适合需求的表达方式'],
  ['EXECUTE', '将创意转化为实际作品'],
  ['REFINE', '检查细节，持续调整'],
];

function ClosingReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className}
    initial={reduce ? false : { opacity: 0.45, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 'some' }}
    transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>;
}

function FinalStatement() {
  const reduce = useReducedMotion();
  return <motion.div className="p02-closing__end"
    initial={reduce ? false : 'hidden'} whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}>
    <h3 aria-label="MAKE IT CLEAR. MAKE IT REAL.">
      {['MAKE IT CLEAR.', 'MAKE IT REAL.'].map((line, index) => <span className="p02-closing__line" key={line}>
        <motion.span aria-hidden="true" variants={{ hidden: { opacity: 0, y: '55%' }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : index * 0.16, ease: [0.22, 1, 0.36, 1] }}>{line}</motion.span>
      </span>)}
    </h3>
    <motion.p variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}>让想法清晰，让内容落地。</motion.p>
  </motion.div>;
}

export default function HardwareClosing(_props: { onBack: () => void }) {
  return <section id="hardware-closing" className="p02-section p02-closing" aria-labelledby="hardware-closing-title">
    <header className="p02-head p02-closing__opening">
      <ClosingReveal className="p02-head__marker"><b>04</b><span>CLOSING CHAPTER</span><small>PROJECT REFLECTION</small></ClosingReveal>
      <ClosingReveal className="p02-closing__statement" delay={0.1}>
        <h2 id="hardware-closing-title">BEYOND<br />THE VISUAL.</h2>
        <p>从完成制作，到理解创作。</p>
      </ClosingReveal>
    </header>
    <div className="p02-closing__reflection">
      <ClosingReveal className="p02-closing__aside">REFLECTION</ClosingReveal>
      <div className="p02-closing__prose">{reflections.map(paragraph => <ClosingReveal key={paragraph}><p>{paragraph}</p></ClosingReveal>)}</div>
    </div>
    <div className="p02-closing__forward">
      <ClosingReveal><h3>WHAT I TAKE FORWARD</h3></ClosingReveal>
      <ol>{habits.map(([english, chinese], index) => <li key={english}><ClosingReveal delay={index * 0.08}>
        <span><small>0{index + 1}</small>{english}</span><p>{chinese}</p>
      </ClosingReveal></li>)}</ol>
    </div>
    <FinalStatement />
  </section>;
}
