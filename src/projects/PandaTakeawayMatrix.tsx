import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import './panda-takeaway-matrix.css';

const pairs = [
  { id: '02', pose: '抱竹' },
  { id: '04', pose: '行走' },
  { id: '03', pose: '趴卧' },
  { id: '01', pose: '坐姿' },
];
const root = `${import.meta.env.BASE_URL}assets/projects/panda-line-to-life`;

export default function PandaTakeawayMatrix() {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState<string[]>([]);
  const matrixRef = useRef<HTMLDivElement>(null);
  const inView = useInView(matrixRef, { once: true, amount: .95 });
  useEffect(() => {
    if (!inView || reduced) return;
    const timers = pairs.map(({ id }, index) => window.setTimeout(() => {
      setRevealed(current => current.includes(id) ? current : [...current, id]);
    }, 1500 + index * 350));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, reduced]);
  return <div ref={matrixRef} className="p02-takeaway-matrix" role="group" aria-label="熊猫角色线稿与渲染对应展示">
    {pairs.map(({ id, pose }, index) => <motion.div className="p02-takeaway-matrix__entry" key={id}
      initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: .1 }}>
      <motion.div className="p02-takeaway-matrix__pair" variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : .55, delay: reduced ? 0 : .55 + index * .1, ease: [.22, 1, .36, 1] } },
      }}>
        <div className={`p02-takeaway-character${reduced || revealed.includes(id) ? ' is-revealed' : ''}`}>
          <img className="is-sketch" src={`${root}/${id}-sketch.png`} alt={`${pose}熊猫线稿`} loading="lazy" />
          <img className="is-render" src={`${root}/${id}-render.png`} alt={`${pose}熊猫最终渲染`} width="1448" height="1086" loading="lazy" />
        </div>
      </motion.div>
    </motion.div>)}
  </div>;
}
