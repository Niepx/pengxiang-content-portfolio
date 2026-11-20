import { forwardRef, useEffect, useRef, useState, VideoHTMLAttributes } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { isMobileDelivery, optimizedAsset, optimizedVideo, posterForVideo } from '../assetDelivery';
import './video-player.css';

type Props = VideoHTMLAttributes<HTMLVideoElement> & { src?: string };
/** Mobile playback always starts from a real tap, never from a modal mount effect. */
const VideoPlayer = forwardRef<HTMLVideoElement, Props>(function VideoPlayer({ src, poster, autoPlay, ...props }, forwardedRef) {
  const player = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error' | 'slow'>('idle');
  const mobile = isMobileDelivery();
  const source = src ? optimizedVideo(src) : undefined;
  useEffect(() => {
    const video = player.current;
    setStatus('idle');
    if (autoPlay && !mobile) video?.play().catch(() => setStatus('idle'));
    return () => { video?.pause(); };
  }, [source, autoPlay, mobile]);
  useEffect(() => {
    if (status !== 'loading') return;
    const timer = window.setTimeout(() => setStatus('slow'), 12000);
    return () => window.clearTimeout(timer);
  }, [status]);
  const play = (retry = false) => {
    const video = player.current;
    if (!video) return;
    if (retry) video.load();
    setStatus('loading');
    // Keep play() in this click handler: iOS can reject a later asynchronous call.
    video.play().catch(error => setStatus(error.name === 'NotAllowedError' ? 'idle' : 'error'));
  };
  return <div className="portfolio-video" data-status={status}>
    <video {...props} ref={element => {
      player.current = element;
      if (typeof forwardedRef === 'function') forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    }} src={source} poster={poster ? optimizedAsset(poster) : posterForVideo(src)} controls playsInline preload="none"
      onPlaying={() => setStatus('playing')} onWaiting={() => setStatus('loading')}
      onPause={event => { const failed = Boolean(event.currentTarget.error); setStatus(previous => failed || previous === 'error' ? 'error' : previous === 'idle' ? 'idle' : 'paused'); }}
      onEnded={() => setStatus('idle')} onError={() => setStatus('error')} />
    {status === 'idle' && <button type="button" className="portfolio-video__play" aria-label="开始播放视频" onClick={() => play()}><Play size={22} fill="currentColor" /><span>播放视频</span></button>}
    {(status === 'loading' || status === 'slow' || status === 'error') && <div className="portfolio-video__status" role="status">
      <span>{status === 'error' ? '视频未能加载，请重试' : status === 'slow' ? '网络较慢，视频仍在缓冲' : '正在缓冲视频…'}</span>
      {status !== 'loading' && <><button type="button" onClick={() => play(true)}><RotateCcw size={14} />重新加载</button><a href={source} target="_blank" rel="noreferrer">单独打开视频</a></>}
    </div>}
  </div>;
});
export default VideoPlayer;
