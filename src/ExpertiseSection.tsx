import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './expertise.css';

const capabilities = [
  ['VISUAL & AIGC', '产品视觉与 AI 内容生成', '产品宣传图、商业视觉物料、AIGC 生图、场景视觉以及图片细节优化。'],
  ['VIDEO PRODUCTION', '视频策划、拍摄与剪辑', '分镜脚本、产品拍摄、短视频剪辑、宣传视频制作及 AI 视频素材整合。'],
  ['CONTENT DESIGN', '产品内容与信息表达', '理解产品功能与使用场景，梳理核心卖点，制作教程、宣传内容及产品介绍物料。'],
  ['CREATIVE EXECUTION', '从创意到实际作品', '结合传统制作工具与 AIGC 工作流，完成视觉、视频及图文内容的制作、检查和迭代。'],
];

const career = [
  ['2025.12 — 2026', '四川旭创启元科技有限公司', 'AI 产品视觉、AIGC 与内容制作'],
  ['2025.06 — 2025.12', '四川意外科技有限公司', 'AI 机器人产品内容与短视频制作'],
  ['2022 — 2025', '早期新媒体与内容工作', '医疗、本地生活、电商等领域的内容制作与新媒体运营'],
];

function ExpertiseReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0, margin: '50px' }} transition={{ duration: reduce ? 0 : .6, delay: reduce ? 0 : delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

export default function ExpertiseSection() {
  return <section id="experience" aria-labelledby="expertise-title" className="expertise relative scroll-mt-0 rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
    <ExpertiseReveal className="expertise__heading">
      <h2 id="expertise-title" className="text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-[-.015em]">EXPERTISE</h2>
      <p className="expertise__caption">WHAT I DO &amp; WHERE I'VE BEEN</p>
      <p className="expertise__intro">围绕产品内容、视觉表达与视频制作，在不同项目中持续积累从内容理解到实际制作的经验。</p>
    </ExpertiseReveal>

    <div className="expertise__body mx-auto max-w-5xl">
      <ExpertiseReveal className="expertise__subhead">
        <h3>WHAT I DO.</h3><p>从内容理解到最终制作。</p>
      </ExpertiseReveal>
      <ol className="expertise__capabilities">
        {capabilities.map(([title, chinese, description], index) => <li key={title}>
          <ExpertiseReveal className="expertise__capability" delay={index * .04}>
            <span className="expertise__number">{String(index + 1).padStart(2, '0')}</span>
            <h4>{title}</h4>
            <div><h5>{chinese}</h5><p>{description}</p></div>
          </ExpertiseReveal>
        </li>)}
      </ol>

      <div className="expertise__career">
        <ExpertiseReveal className="expertise__subhead expertise__subhead--secondary">
          <h3>CAREER TIMELINE</h3><p>SELECTED EXPERIENCE</p>
        </ExpertiseReveal>
        <ol>
          {career.map(([period, company, direction]) => <li key={company}>
            <ExpertiseReveal className="expertise__career-row">
              <span>{period}</span><h4>{company}</h4><p>{direction}</p>
            </ExpertiseReveal>
          </li>)}
        </ol>
      </div>

      <ExpertiseReveal className="expertise__independent">
        <div className="expertise__independent-period"><span>2023.09 — 至今</span></div>
        <h4>个人自媒体创作</h4>
        <p>持续进行个人内容创作，探索音乐内容、短视频与美食自媒体等不同表达方向。</p>
      </ExpertiseReveal>
    </div>
  </section>;
}
