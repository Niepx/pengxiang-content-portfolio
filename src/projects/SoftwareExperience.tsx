import { useRef, useState } from 'react';
import CardSwap, { Card, CardSwapHandle } from '../components/react-bits/CardSwap/CardSwap';
import { softwareScreens } from './softwareScreens';
import './software-experience.css';

export default function SoftwareExperience({ open }: { open: (ids: string[], index?: number) => void }) {
  const [active, setActive] = useState(0);
  const swap = useRef<CardSwapHandle>(null);
  const current = softwareScreens[active];
  return <div className="p02-block p02-software p02-software-showcase">
    <div className="p02-block__intro"><span>SOFTWARE EXPERIENCE</span><h3>启元陪伴小程序</h3><p>参与功能规划、页面逻辑、交互原型与技术沟通。</p></div>
    <div className="p02-software-current" aria-live="polite"><span>CURRENT SCREEN</span><h4>{current.title}</h4><p>{current.description}</p><nav><button onClick={() => swap.current?.prev()} aria-label="上一张界面">←</button><span>{String(active + 1).padStart(2, '0')} / 10</span><button onClick={() => swap.current?.next()} aria-label="下一张界面">→</button></nav><small>拖动切换 · 点击后卡聚焦 · 点击当前图放大</small></div>
    <div className="p02-software-cards"><CardSwap ref={swap} width={640} height={480} cardDistance={25} verticalDistance={22} depth={35} skewAmount={0} visibleCards={3} autoplay={false} draggable bounce={0.08} parallax={0.08} hoverSpread={0.02} dim={0.3} cardRadius={10} theme="light" onChange={setActive} onCardClick={index => { if (index === active) open(softwareScreens.map(item => item.id), index); }}>{softwareScreens.map(item => <Card key={item.id} customClass="p02-software-ui"><img src={item.image} alt={item.title} draggable={false} /></Card>)}</CardSwap></div>
  </div>;
}
