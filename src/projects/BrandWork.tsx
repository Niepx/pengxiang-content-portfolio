import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import DriftWall from '../components/react-bits/DriftWall/DriftWall';
import CircularGallery from '../components/react-bits/CircularGallery/CircularGallery';
import { brandCollections, brandColumns, BrandCollection } from './brandCollections';
import './brand-work.css';

type Selection = { group: BrandCollection; index: number };
function BrandGallery({ selection, onClose }: { selection: Selection; onClose: () => void }) {
  const { group, index } = selection;
  const reduced = useReducedMotion();
  const [active, setActive] = useState(index);
  const [expanded, setExpanded] = useState(false);
  const [webgl] = useState(() => { const gl = document.createElement('canvas').getContext('webgl2'); const supported = Boolean(gl); gl?.getExtension('WEBGL_lose_context')?.loseContext(); return supported; });
  const [galleryFont] = useState(() => `600 30px ${getComputedStyle(document.body).fontFamily}`);
  const root = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const scroller = document.querySelector<HTMLElement>('.case-overlay');
    const overflow = scroller?.style.overflow;
    if (scroller) scroller.style.overflow = 'hidden';
    back.current?.focus({ preventScroll: true });
    return () => { if (scroller) scroller.style.overflow = overflow || ''; previous?.focus({ preventScroll: true }); };
  }, []);
  return createPortal(<motion.div ref={root} className="brand-gallery" role="dialog" aria-modal="true" aria-label={group.title}
    initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: reduced ? 0 : .5, ease: [.22, 1, .36, 1] }}
    onKeyDown={event => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        // The original gallery consumes Escape first when its image is open.
        if (!event.defaultPrevented) {
          if (expanded) {
            if (webgl) root.current?.querySelector<HTMLButtonElement>('[data-gallery-close]')?.click();
            else setExpanded(false);
          } else onClose();
        }
      }
      if (event.key === 'Tab') {
        const nodes = [...(root.current?.querySelectorAll<HTMLElement>('button:not([tabindex="-1"]), [tabindex="0"]') || [])].filter(el => el.getClientRects().length);
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }}>
    <header className="brand-gallery__top"><button ref={back} type="button" onClick={onClose}>← BACK TO WALL</button><div><small>{group.category}</small><h3>{group.title}</h3></div><span>{String(active + 1).padStart(2, '0')} / {String(group.images.length).padStart(2, '0')}</span></header>
    <div className="brand-gallery__stage">
      {webgl ? <CircularGallery key={group.id} items={group.images} initialIndex={index} bend={window.matchMedia('(max-width: 799px)').matches ? 1.8 : 2.5} itemSize={.85} itemAspect={.78} gap={.28} borderRadius={.035} wave={window.matchMedia('(max-width: 799px)').matches ? .2 : .6} fadeEdges={.14} shadow={.2} textColor="#DCE3E8" font={galleryFont} showTitles scrollSpeed={1.6} scrollEase={.065} snap autoScroll={0} grayscale={false} intro={!reduced} openOnClick onActiveChange={(value: number) => setActive(value)} onOpenChange={(value: boolean) => setExpanded(value)} />
      : <div className="brand-gallery__fallback">{group.images.map((item, i) => <button type="button" key={item.id} onClick={() => { setActive(i); setExpanded(true); }}><img loading="lazy" decoding="async" src={item.image} alt={item.text} /><span>{item.text}</span></button>)}{expanded && <div className="brand-fallback-reader"><button onClick={() => setExpanded(false)}>关闭原图</button><img loading="lazy" decoding="async" src={group.images[active].fullImage} alt={group.images[active].text} /></div>}</div>}
    </div>
    <footer>{group.pending ? '素材待替换' : '拖动 / 滚轮 / 方向键浏览 · 点击展开 · ESC 返回'}</footer>
  </motion.div>, document.body);
}

export default function BrandWork({ heading }: { heading: React.ReactNode }) {
  const [selected, setSelected] = useState<Selection | null>(null);
  const [compact, setCompact] = useState(() => window.innerWidth < 800);
  const wallRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const mq = window.matchMedia('(max-width: 799px)'); const update = () => setCompact(mq.matches); update(); mq.addEventListener('change', update); return () => mq.removeEventListener('change', update); }, []);
  const select = (item: { groupId: string; imageId: string }) => {
    const group = brandCollections.find(group => group.id === item.groupId);
    if (!group) return;
    setSelected({ group, index: Math.max(0, group.images.findIndex(image => image.id === item.imageId)) });
  };
  return <section className="p02-section p02-brand">{heading}<div ref={wallRef} className={`brand-wall${selected ? ' is-browsing' : ''}`}>
    <DriftWall columnGroups={brandColumns} items={brandColumns.flat()} columns={5} tileWidth={compact ? 210 : 280} tileHeight={compact ? 145 : 190} gap={20} radius={12} tilt={compact ? 9 : 16} turn={compact ? -7 : -14} perspective={1200} depth={120} speed={24} direction="up" variance={.45} parallax={compact ? 0 : .6} lift={compact ? 24 : 64} fade={.45} dim={.94} overlayColor="#0c1013" paused={Boolean(selected)} onItemClick={select} />
  </div><AnimatePresence>{selected && <BrandGallery selection={selected} onClose={() => setSelected(null)} />}</AnimatePresence></section>;
}
