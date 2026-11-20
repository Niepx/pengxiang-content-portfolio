import { optimizedAsset } from './assetDelivery';
import './mobile-about-skills.css';

const asset = (path: string) => optimizedAsset(`${import.meta.env.BASE_URL}assets/${path}`);

export default function MobileAboutSkills({ aboutCopy, skillCopy }: { aboutCopy: string; skillCopy: string }) {
  const paragraphs = aboutCopy.trim().split(/\n\s*\n/);

  return <section id="about" className="mobile-about-skills">
    <div className="mobile-about-skills__about">
      <h2>ABOUT ME</h2>
      <p>{paragraphs[0]}</p>
      <img className="mobile-about-skills__workspace" src={asset('about-angry-laptop-boy.png')} width="1672" height="941" loading="lazy" decoding="async" alt="Joji 在工作室制作内容" />
      {paragraphs.slice(1).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </div>
    <div id="skills" className="mobile-about-skills__scene">
      <div className="mobile-about-skills__sticky">
        <h2>SKILLS</h2>
        <p>{skillCopy}</p>
        <div className="mobile-about-skills__visual">
          <img src={asset('skill-falling-boy.png')} width="1672" height="941" alt="Joji 与日常使用的内容创作工具" loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  </section>;
}
