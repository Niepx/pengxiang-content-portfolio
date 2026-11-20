import VideoPlayer from './VideoPlayer';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import DriftWall from '../components/react-bits/DriftWall/DriftWall';
import { FoodFilm, foodFilms, foodJournalCovers } from './foodProjectData';
import './food-content.css';

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0, margin: '50px' }} transition={{ duration: reduced ? 0 : .6, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function FoodVideo({ film, onClose }: { film: FoodFilm; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    close.current?.focus({ preventScroll: true });
    const player = video.current;
    return () => {
      player?.pause();
      player?.removeAttribute('src');
      player?.load();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  return createPortal(<motion.div ref={root} className="food-video" role="dialog" aria-modal="true" aria-label={film.title} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .25 }} onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); video.current?.pause(); onClose(); }
    if (event.key === 'Tab') {
      const nodes = [...(root.current?.querySelectorAll<HTMLElement>('button, video[controls]') || [])];
      if (event.shiftKey && document.activeElement === nodes[0]) { event.preventDefault(); nodes[nodes.length - 1]?.focus(); }
      else if (!event.shiftKey && document.activeElement === nodes[nodes.length - 1]) { event.preventDefault(); nodes[0]?.focus(); }
    }
  }}>
    <header><span>{film.englishTitle}</span><button ref={close} type="button" aria-label="关闭美食视频" onClick={() => { video.current?.pause(); onClose(); }}><X size={26} /></button></header>
    <VideoPlayer ref={video} src={film.videoSrc || undefined} poster={film.poster || undefined} controls playsInline preload="none" aria-label={film.title} />
    <p>{film.title}</p>
  </motion.div>, document.body);
}

export default function FoodContent() {
  const [film, setFilm] = useState<FoodFilm | null>(null);
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const resize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  const columns = width < 600 ? 2 : width < 1000 ? 3 : 4;
  const tileWidth = width < 600 ? 138 : width < 1000 ? 180 : 230;
  return <section className="case-section case-container food-case" aria-labelledby="food-title">
    <Reveal className="food-case__intro"><div><h2 id="food-title">FOOD CONTENT</h2><span>ONGOING PERSONAL PRACTICE</span></div><p>以日常烹饪为内容，持续尝试不同的拍摄方式与剪辑表达。相比账号数据，我更希望这些作品能够直接呈现画面、食物质感与生活中的细节。</p></Reveal>
    <div className="food-case__block">
      <Reveal className="food-case__heading"><h3>FOOD JOURNAL</h3><span>{foodJournalCovers.length ? `${foodJournalCovers.length} FRAMES / DAILY CREATION` : 'DAILY CREATION'}</span></Reveal>
      <Reveal><p className="food-case__supporting">关于食物与日常的影像记录。</p></Reveal>
      {foodJournalCovers.length > 0 ? <Reveal className="food-case__wall"><DriftWall className="food-case__drift" items={foodJournalCovers} interactive={false} columns={columns} tileWidth={tileWidth} tileHeight={tileWidth * 16 / 9} gap={18} radius={12} tilt={width < 600 ? 5 : 10} turn={width < 600 ? -4 : -8} perspective={1200} depth={75} speed={18} direction="up" variance={.35} parallax={width < 1000 ? 0 : .25} lift={20} fade={.2} dim={.96} overlayColor="#ffffff" paused={Boolean(film)} /></Reveal> : <Reveal className="food-case__journal-pending"><span>作品封面待接入</span><p>预留 16 张真实 9:16 封面，收到素材后展示作品墙。</p></Reveal>}
    </div>
    <div className="food-case__block">
      <Reveal className="food-case__heading"><h3>IN MOTION</h3><span>FOUR FILMS / DAILY FOOD VIDEOS</span></Reveal>
      <Reveal><p className="food-case__supporting">四段日常烹饪影像，记录不同食物的制作过程与画面表达。</p></Reveal>
      <div className="food-case__films">{foodFilms.map((item, index) => <Reveal key={item.id}><article>
        {item.videoSrc ? <button className="food-case__poster" type="button" onClick={() => setFilm(item)} aria-label={`播放${item.title}`}>
          {item.poster ? <img src={item.poster} alt={`${item.title} · 视频封面`} loading="lazy" /> : <span>视频封面待接入</span>}
          <span className="food-case__play"><Play size={22} fill="currentColor" /><span>PLAY VIDEO</span></span>
        </button> : <div className="food-case__poster food-case__poster--pending">{item.poster ? <img src={item.poster} alt={`${item.title} · 视频封面`} loading="lazy" /> : <span>作品封面待接入</span>}<small>视频待接入</small></div>}
        <div className="food-case__film-meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{item.englishTitle}</span></div>
        <h4>{item.title}</h4><p>{item.description}</p>
      </article></Reveal>)}</div>
    </div>
    <Reveal className="food-case__end"><span>ONGOING PRACTICE</span><p>这些作品来自日常生活中的一次次尝试。对我而言，做饭也是记录生活、练习拍摄和探索影像表达的一种方式。</p></Reveal>
    {film?.videoSrc && <FoodVideo film={film} onClose={() => setFilm(null)} />}
  </section>;
}
