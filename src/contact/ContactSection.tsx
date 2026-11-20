import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import ContactLanyard from './ContactLanyard';
import StarBorder from '../components/react-bits/StarBorder/StarBorder';
import './contact.css';

export default function ContactSection() {
  const reduced = useReducedMotion();
  const visualRef = useRef<HTMLDivElement>(null);
  const [showBackRequest, setShowBackRequest] = useState(0);
  const revealContact = () => {
    setShowBackRequest(request => request + 1);
    if (window.matchMedia('(max-width:700px)').matches) {
      visualRef.current?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' });
    }
  };
  return <footer id="contact" className="contact-final">
    <div className="contact-final__layout">
      <motion.div className="contact-final__copy" initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }}>
        <p className="contact-final__label">CONTACT / LET'S CONNECT</p>
        <h2 className="hero-heading"><span>LET'S WORK</span><span>TOGETHER.</span></h2>
        <p className="contact-final__description">关注内容创作、视觉制作与短视频表达，也期待参与更多能够实际落地的项目。</p>
        <StarBorder as="button" onClick={revealContact} className="contact-final__button"
          color="#ffffff" trailColor="#ffffff" duration={4} direction="clockwise"
          stars={1} trailLength={0.3} thickness={1} radius={12} glow={0.6}
          hover="lap" sparkle={false} clickPulse theme="dark"
          backgroundColor="transparent" textColor="#D7E2E9" borderColor="#9AA8B3">
          CONTACT ME <ArrowUpRight aria-hidden="true" />
        </StarBorder>
      </motion.div>
      <div ref={visualRef} className="contact-final__visual" />
    </div>
    <ContactLanyard visualRef={visualRef} showBackRequest={showBackRequest} />
    <p className="contact-final__copyright">© 2026 PENGXIANG STUDIO</p>
  </footer>;
}
