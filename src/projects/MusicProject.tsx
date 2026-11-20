import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PortfolioProject } from './data';
import { listeningScenarios, musicAccount, musicPostMetrics, musicPosts, musicProcess, musicSeries } from './musicProjectData';
import './music-project.css';

function MusicReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0, margin: '50px' }} transition={{ duration: reduce ? 0 : .6, delay: reduce ? 0 : delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

export default function MusicProject({ project }: { project: PortfolioProject; renderMedia?: (id: string, className?: string) => ReactNode }) {
  return <section className="case-section case-container personal-music music-case" aria-labelledby="music-project-title">
    <MusicReveal><div className="case-section__heading"><h2 id="music-project-title">BILIBILI<br />MUSIC PROJECT</h2></div></MusicReveal>
    <MusicReveal className="music-case__introduction">
      <div><span className="music-case__label">01 / PROJECT INTRODUCTION</span><h3>{musicAccount.name}</h3><a className="music-case__link" href={musicAccount.url} target="_blank" rel="noopener noreferrer">访问 Bilibili 主页 <span aria-hidden="true">↗</span></a></div>
      <div><h4 className="music-case__statement">让音乐成为一个可以倾诉的地方。</h4><p>创建「失眠树洞Music」，是希望在分享音乐之外，留下一处可以交流心事、表达情绪、彼此取暖的小小空间。音乐有时能触及言语难以表达的感受，也能让陌生人因为相似的心境产生共鸣。</p><p>账号主要分享粤语、R&amp;B 以及偏抒情、安静的音乐。我会围绕不同情绪和生活场景筛选歌曲、编排歌单，希望让听众在学习、工作、放松、通勤或独处时，找到适合当下心境的音乐。</p></div>
    </MusicReveal>

    <div className="music-case__overview">
      <MusicReveal><h3 className="music-case__label">02 / ACCOUNT OVERVIEW</h3></MusicReveal>
      <dl className="music-case__metrics">{musicAccount.metrics.map(([value, english, chinese], index) => <MusicReveal key={english} delay={index * .08}><dt>{english}<span>{chinese}</span></dt><dd>{value}</dd></MusicReveal>)}</dl>
      <p className="music-case__data-note">账号累计数据及下方代表作品反馈均截至 2026 年 11 月 1 日，非实时统计。</p>
    </div>

    <div className="music-case__block">
      <MusicReveal className="music-case__block-heading"><h3>CONTENT SERIES</h3><span className="music-case__label">03 / 音乐内容系列</span></MusicReveal>
      <MusicReveal><p className="music-case__supporting">三个持续更新的合集，承载不同风格与听感的音乐内容。</p></MusicReveal>
      <div className="music-case__series">{musicSeries.map(([english, title, description], index) => <MusicReveal key={english} delay={index * .07}><span className="music-case__label">{english}</span><h4>{title}</h4><p>{description}</p></MusicReveal>)}</div>
      <MusicReveal className="music-case__scenarios"><h4 className="music-case__label">LISTENING SCENARIOS</h4><ul>{listeningScenarios.map(([chinese, english]) => <li key={english}>{chinese} <span>/ {english}</span></li>)}</ul></MusicReveal>
    </div>

    <div className="music-case__block">
      <MusicReveal className="music-case__block-heading"><h3>SELECTED POSTS</h3><span className="music-case__label">04 / 代表作品</span></MusicReveal>
      <div className="music-case__posts">{musicPosts.map((post, index) => {
        const cover = post.cover || project.media.find(media => media.id === post.mediaId)?.src;
        const visual = cover ? <img src={cover} alt={`${post.title} · 原始视频封面`} loading="lazy" /> : <div className="music-case__cover-pending"><span>原始作品封面待补</span><small>FEATURED {post.id}</small></div>;
        return <MusicReveal key={post.id} delay={index * .08}><article>
          {post.videoUrl ? <a className="music-case__cover" href={post.videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`在 Bilibili 查看${post.originalTitle}`} title={post.originalTitle}>{visual}</a> : <div className="music-case__cover">{visual}</div>}
          <div className="music-case__post-meta"><span>FEATURED {post.id} / {post.category}</span><time dateTime={post.published.replace(/\./g, '-')}>{post.published}</time></div>
          <h4>{post.title}</h4><p>{post.description}</p>
          {post.scenarios && <ul className="music-case__post-scenarios">{post.scenarios.map(scenario => <li key={scenario}>{scenario}</li>)}</ul>}
          <div className="music-case__post-data"><dl className="music-case__post-stats">{musicPostMetrics.map(([key, label, english]) => <div key={key} className={key === 'views' ? 'music-case__post-views' : undefined}><dt>{label}<span>{english}</span></dt><dd>{post.metrics[key] ?? '—'}</dd></div>)}</dl>{Object.values(post.metrics).some(value => value === null) && <p className="music-case__missing-note">— 表示暂无已确认数据，非零。</p>}</div>
          {post.videoUrl ? <a className="music-case__link" href={post.videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`查看作品：${post.originalTitle}`} title={post.originalTitle}>查看作品 <span aria-hidden="true">↗</span></a> : <p className="music-case__pending-note">视频链接待补</p>}
        </article></MusicReveal>;
      })}</div>
    </div>

    <div className="music-case__block music-case__process">
      <MusicReveal className="music-case__block-heading"><h3>CREATIVE PROCESS</h3><span className="music-case__label">05 / 歌单策划与持续制作</span></MusicReveal>
      <MusicReveal className="music-case__process-note"><p>账号初期，我用了约两个月探索歌单编排与内容呈现方式，在选曲、歌曲排序和曲目衔接中不断调整，也逐渐找到适合长期稳定更新的制作节奏。</p><p>相比单纯追求某种表现形式，我更在意歌单整体的聆听体验，以及内容能否持续陪伴不同情绪与生活场景中的听众。</p></MusicReveal>
      <div className="music-case__process-grid">{musicProcess.map(([title, description, detail], index) => <MusicReveal key={title} delay={index * .07}><span className="music-case__label">{String(index + 1).padStart(2, '0')}</span><h4>{title}</h4><p className="music-case__process-title">{description}</p><p>{detail}</p></MusicReveal>)}</div>
    </div>
  </section>;
}
