import displayAssets from './display-assets.json';
import videoPosters from './video-posters.json';
import mobileImages from './mobile-images.json';
import mobileVideos from './mobile-videos.json';

export function isMobileDelivery(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)').matches;
}

export function optimizedVideo(src: string): string {
  const prefix = `${import.meta.env.BASE_URL}assets/`;
  if (!isMobileDelivery() || !src.startsWith(prefix)) return src;
  const mobile = (mobileVideos as Record<string, string>)[src.slice(prefix.length)];
  return mobile ? `${prefix}${mobile}` : src;
}

const displayMap: Record<string, string> = displayAssets;
/** Preserve source files for download; use bounded, same-origin images on screen. */
export function optimizedAsset(src: string): string {
  const prefix = `${import.meta.env.BASE_URL}assets/`;
  if (!src.startsWith(prefix)) return src;
  const key = src.slice(prefix.length);
  const mobile = isMobileDelivery() && (mobileImages as Record<string, string>)[key];
  if (mobile) return `${prefix}${mobile}`;
  const display = displayMap[key];
  return display ? `${prefix}${display}` : src;
}

export function posterForVideo(src: string | undefined): string | undefined {
  if (!src) return undefined;
  const prefix = `${import.meta.env.BASE_URL}assets/`;
  const poster = (videoPosters as Record<string, string>)[src.slice(prefix.length)];
  return poster ? optimizedAsset(`${prefix}${poster}`) : undefined;
}
