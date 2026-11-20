import { Component, lazy, ReactNode, RefObject, Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { lanyardConfig } from './lanyardConfig';
import { useCardTextures } from './useCardTextures';

const Lanyard = lazy(() => import('../components/react-bits/Lanyard/Lanyard'));

function LanyardFallback({ image, back }: { image: string | null; back: boolean }) {
  return <div className="contact-final__badge" role="img" aria-label="浅灰色竖版工牌">
    <div className="contact-final__strap" style={{ backgroundColor: lanyardConfig.strapColor }} />
    <div className="contact-final__clip" />
    <div className="contact-final__card" style={{ backgroundColor: lanyardConfig.cardColor }}>
      {image && <img src={image} alt={back ? "工牌背面联系方式" : "工牌正面"} style={{ objectFit: lanyardConfig.imageFit }} />}
    </div>
  </div>;
}

class LanyardBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function ContactLanyard({ visualRef, showBackRequest = 0 }: { visualRef: RefObject<HTMLDivElement>; showBackRequest?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const node = visualRef.current;
    setFrame(node);
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    if (bounds.top < window.innerHeight + 200 && bounds.bottom > -200) setNear(true);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [visualRef]);
  const textures = useCardTextures(near);
  const frontImage = lanyardConfig.frontImage ?? textures?.front ?? null;
  const backImage = lanyardConfig.backImage ?? textures?.back ?? null;
  return <div ref={root} className="contact-final__lanyard-stage">
    {frame && (!ready || unavailable) && createPortal(<LanyardFallback image={showBackRequest > 0 ? backImage : frontImage} back={showBackRequest > 0} />, frame)}
    {near && !unavailable && <LanyardBoundary fallback={null} onError={() => setUnavailable(true)}>
      <Suspense fallback={null}>
        <Lanyard {...lanyardConfig} showBackRequest={showBackRequest} frontImage={frontImage} backImage={backImage} framingElement={frame} interactionElement={frame?.closest("footer") ?? null} onReady={() => setReady(true)} onUnavailable={() => setUnavailable(true)} />
      </Suspense>
    </LanyardBoundary>}
    {frame && ready && !unavailable && createPortal(<p className="contact-final__drag-hint">DRAG TO EXPLORE</p>, frame)}
  </div>;
}
