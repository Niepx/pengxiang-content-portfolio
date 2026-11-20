import { optimizedAsset } from './assetDelivery';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import './mobile-about-skills.css';

const asset = (path: string) => optimizedAsset(`${import.meta.env.BASE_URL}assets/${path}`);
const mobileFrames = Array.from({ length: 18 }, (_, index) => asset(`skill-sequence/mobile/frame-${String(index === 17 ? 53 : index * 3).padStart(3, '0')}.jpg`));

export default function MobileAboutSkills({ aboutCopy, skillCopy }: { aboutCopy: string; skillCopy: string }) {
  const scene = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const draw = useRef<(progress: number) => void>(() => {});
  const progress = useRef(0);
  const [ready, setReady] = useState(false);
  const [finalReady, setFinalReady] = useState(false);
  const reduced = useReducedMotion();
  const near = useInView(scene, { once: true, margin: '300px' });
  const { scrollYProgress } = useScroll({ target: scene, offset: ['start start', 'end end'] });
  const finalOpacity = useTransform(scrollYProgress, [.8, 1], [0, 1]);
  const paragraphs = aboutCopy.trim().split(/\n\s*\n/);

  useEffect(() => {
    if (!near || reduced) return;
    let active = true;
    const frames = mobileFrames.map(() => new Image());
    draw.current = value => {
      if (!active) return;
      const ctx = canvas.current?.getContext('2d');
      if (!ctx) return;
      const target = Math.round(Math.max(0, Math.min(1, value)) * (frames.length - 1));
      // Keep the last readable frame while a later frame is still arriving.
      const frame = frames.map((image, index) => ({ image, distance: Math.abs(target - index) }))
        .filter(({ image }) => image.complete && image.naturalWidth)
        .sort((a, b) => a.distance - b.distance)[0]?.image;
      if (!frame) return;
      ctx.drawImage(frame, 0, 0, 640, 360);
      setReady(true);
    };
    frames.forEach((image, index) => {
      image.decoding = 'async';
      image.onload = () => draw.current(progress.current);
      image.src = mobileFrames[index];
    });
    return () => { active = false; frames.forEach(image => { image.onload = null; }); };
  }, [near, reduced]);
  useMotionValueEvent(scrollYProgress, 'change', value => { progress.current = value; draw.current(value); });

  return <section id="about" className="mobile-about-skills">
    <div className="mobile-about-skills__about">
      <h2>ABOUT ME</h2>
      <p>{paragraphs[0]}</p>
      <img className="mobile-about-skills__workspace" src={asset('about-angry-laptop-boy.png')} width="1672" height="941" loading="lazy" decoding="async" alt="Joji 在工作室制作内容" />
      {paragraphs.slice(1).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </div>
    <div id="skills" ref={scene} className={`mobile-about-skills__scene${reduced ? ' is-reduced' : ''}`}>
      <div className="mobile-about-skills__sticky">
        <h2>SKILLS</h2>
        <p>{skillCopy}</p>
        <div className="mobile-about-skills__visual">
          <img src={asset('about-angry-laptop-boy.png')} width="1672" height="941" alt="" aria-hidden="true" loading="lazy" />
          <canvas ref={canvas} width="640" height="360" aria-label="Joji 从工作场景过渡到创意工具场景" role="img" style={{ opacity: ready && !reduced ? 1 : 0 }} />
          <motion.img src={asset('skill-falling-boy.png')} width="1672" height="941" alt="Joji 与日常使用的内容创作工具" loading="lazy" decoding="async" onLoad={() => setFinalReady(true)} style={{ opacity: finalReady ? reduced ? 1 : finalOpacity : 0 }} />
        </div>
      </div>
    </div>
  </section>;
}
