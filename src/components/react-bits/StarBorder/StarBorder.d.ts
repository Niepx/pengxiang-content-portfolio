import type { CSSProperties, ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
type StarBorderProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
  as?: 'a' | 'button'; children?: ReactNode; className?: string; style?: CSSProperties;
  color?: string; trailColor?: string; duration?: number; thickness?: number; radius?: number;
  trailLength?: number; stars?: number; glow?: number; sparkle?: boolean;
  direction?: 'clockwise' | 'counterclockwise'; hover?: 'lap' | 'brighten' | 'reveal' | 'none';
  clickPulse?: boolean; theme?: 'dark' | 'light'; backgroundColor?: string; textColor?: string; borderColor?: string;
};
export default function StarBorder(props: StarBorderProps): JSX.Element;
