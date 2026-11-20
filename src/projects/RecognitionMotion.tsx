import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export const recognitionEase = [.22, 1, .36, 1] as const;
export function RecognitionReveal({ children, delay = 0, className = '', medal = false }: { children: ReactNode; delay?: number; className?: string; medal?: boolean }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: medal ? 32 : 20, ...(medal ? { scale: .96, rotate: -1 } : {}) }} whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: reduced ? 0 : medal ? .75 : .65, delay: reduced ? 0 : delay, ease: recognitionEase }}>{children}</motion.div>;
}
export function RecognitionLines({ lines, delay = 0, closing = false }: { lines: ReactNode[]; delay?: number; closing?: boolean }) {
  const reduced = useReducedMotion();
  return <>{lines.map((line, index) => <span className="p02-recognition-line" key={index}><motion.span initial={reduced ? false : { opacity: 0, y: '100%' }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: reduced ? 0 : .65, delay: reduced ? 0 : delay + index * (closing ? .455 : .15), ease: recognitionEase }}>{line}</motion.span></span>)}</>;
}
export function RecognitionRule({ delay = 0 }: { delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.span aria-hidden="true" className="p02-recognition-rule" initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: reduced ? 0 : .7, delay: reduced ? 0 : delay, ease: recognitionEase }} />;
}
export function RecognitionHero({ video, awards }: { video: ReactNode; awards: readonly { title: string; officialUrl: string | null }[] }) {
  const reduced = useReducedMotion();
  const officialAwards = awards.filter(award => award.officialUrl && /^https?:\/\//i.test(award.officialUrl));
  const enter = (delay: number, y = 20, duration = .6) => ({
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: recognitionEase } },
  });
  // Observe the stationary Hero, never text translated outside a clipping parent.
  // The parent only propagates variant names; it does not hide the whole Hero.
  return <motion.div className="p02-panda__outcome p02-recognition-hero"
    initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 'some' }}>
    <motion.div className="p02-recognition-video" variants={enter(0, 24, .65)}>{video}</motion.div>
    <header className="p02-archive-heading">
      <motion.div variants={enter(.12)}><span>RECOGNITION / 2026</span></motion.div>
      <h3 className="p02-recognition-hero__title">{['从四川金奖，', '到全国银奖。'].map((line, index) =>
        <motion.span key={line} variants={enter(.22 + index * .15)}>{line}</motion.span>)}</h3>
      <motion.div variants={enter(.65)}><p>2026 中国旅游商品大赛 · 城市礼物创意设计主题</p></motion.div>
      <div className="p02-recognition-summary">
        <motion.span aria-hidden="true" className="p02-recognition-rule" variants={{
          hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: reduced ? 0 : .7, delay: reduced ? 0 : .75, ease: recognitionEase } },
        }} />
        <motion.div variants={enter(.8)}><span>四川省级赛事 <b>金奖</b></span></motion.div>
        <motion.div variants={enter(.95)}><span>全国赛事 <b>银奖</b></span></motion.div>
      </div>
      {officialAwards.length > 0 && <motion.nav className="p02-recognition-official" aria-label="官方获奖记录" variants={enter(1.1, 8, .45)}>
        {officialAwards.map(award => <a key={award.title} href={award.officialUrl!} target="_blank" rel="noopener noreferrer">
          <span>{award.title} · 查看获奖名单</span><i aria-hidden="true">↗</i>
        </a>)}
      </motion.nav>}
    </header>
  </motion.div>;
}
