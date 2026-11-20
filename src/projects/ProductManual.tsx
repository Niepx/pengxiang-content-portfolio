import { optimizedAsset } from '../assetDelivery';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import DepthCarousel from '../components/react-bits/DepthCarousel/DepthCarousel';
import './product-manual.css';

const manualPages = Array.from({ length: 16 }, (_, index) => ({ image: optimizedAsset(`${import.meta.env.BASE_URL}assets/projects/panda-manual/page-${index}.png`), alt: `产品说明书 第 ${index + 1} 页` }));
export default function ProductManual() {
  const reduced = useReducedMotion();
  const [gallery, setGallery] = useState(false);
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(window.innerWidth < 700);
  useEffect(() => { const resize = () => setMobile(window.innerWidth < 700); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize); }, []);
  useEffect(() => {
    if (!gallery) return;
    const overlay = document.querySelector<HTMLElement>('.case-overlay');
    const previous = overlay?.style.overflow;
    if (overlay) overlay.style.overflow = 'hidden';
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.stopImmediatePropagation(); setGallery(false); }
    };
    window.addEventListener('keydown', key, true);
    return () => { window.removeEventListener('keydown', key, true); if (overlay) overlay.style.overflow = previous || ''; };
  }, [gallery]);
  return <>
    <div className="p02-block p02-manual"><div className="p02-block__intro"><span>PRODUCT MANUAL</span><h3>复杂信息，重新组织为清晰路径。</h3><p>围绕开机、下载、配对、角色设定、NFC 与参数信息，重新建立说明书的信息层级与阅读顺序。</p><p>目标不是增加内容，而是让第一次接触产品的用户，能够更快找到自己当前需要完成的操作。</p></div><motion.button initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: reduced ? 0 : .65, ease: [.22, 1, .36, 1] }} className="manual-document-preview" onClick={() => setGallery(true)} aria-label="查看完整产品说明书"><span className="manual-book">{[6, 2, 0].map((page, index) => <img key={page} src={manualPages[page].image} alt={manualPages[page].alt} style={{ zIndex: index + 1 }} />)}</span><span className="manual-preview-cta">查看手册 ↗</span></motion.button></div>
    {gallery && <div className="manual-gallery" role="dialog" aria-modal="true" aria-label="产品说明书 Gallery"><header><span>PRODUCT MANUAL</span><button onClick={() => setGallery(false)} aria-label="关闭手册"><X size={28} strokeWidth={1.8} aria-hidden="true" /></button></header><div className="manual-gallery__stage"><DepthCarousel items={manualPages} cardWidth={370} cardHeight={518} autoplay={false} loop={false} visibleCards={mobile ? 2 : 3} tilt={mobile ? 1.5 : 3} depth={mobile ? 60 : 100} spread={mobile ? 25 : 46} perspective={2000} falloff={0.1} blur={1} duration={520} ease="power3.out" showIndicators={false} onActiveClick={undefined} onChange={(index: number) => setActive(index)} /></div><footer>{String(active + 1).padStart(2, '0')} / 16 <span>拖动 / 滚轮 / ← → 浏览</span></footer></div>}
  </>;
}
