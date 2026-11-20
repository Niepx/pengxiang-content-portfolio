import { CSSProperties, ComponentType } from 'react';
export interface LanyardProps {
  frontImage?: string | null; backImage?: string | null; strapImage?: string | null;
  imageFit?: 'cover' | 'contain'; cardColor?: string;
  orientation?: 'portrait' | 'landscape'; finish?: 'glossy' | 'matte' | 'holographic' | 'metallic';
  cornerRadius?: number; size?: number; anchor?: 'left' | 'center' | 'right';
  strapLength?: number; strapColor?: string; strapWidth?: number; metal?: 'silver' | 'gold' | 'graphite';
  gravity?: number; damping?: number; elasticity?: number; breeze?: number;
  interactive?: boolean; intro?: boolean; className?: string; style?: CSSProperties;
  framingElement?: HTMLElement | null; interactionElement?: HTMLElement | null;
  showBackRequest?: number;
  onReady?: () => void; onUnavailable?: () => void;
}
declare const Lanyard: ComponentType<LanyardProps>;
export default Lanyard;
