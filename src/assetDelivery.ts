import displayAssets from './display-assets.json';
import videoPosters from './video-posters.json';

const displayMap: Record<string, string> = displayAssets;
/** Preserve source files for download; use bounded, same-origin images on screen. */
export function optimizedAsset(src: string): string {
  const prefix = `${import.meta.env.BASE_URL}assets/`;
  if (!src.startsWith(prefix)) return src;
  const display = displayMap[src.slice(prefix.length)];
  return display ? `${prefix}${display}` : src;
}

export function posterForVideo(src: string | undefined): string | undefined {
  if (!src) return undefined;
  const prefix = `${import.meta.env.BASE_URL}assets/`;
  const poster = (videoPosters as Record<string, string>)[src.slice(prefix.length)];
  return poster ? `${prefix}${poster}` : undefined;
}
