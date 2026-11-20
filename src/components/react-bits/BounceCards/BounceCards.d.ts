import type { CSSProperties, ComponentType } from 'react';
type Props = { images?: (string | {src:string;alt?:string})[]; className?:string; style?:CSSProperties; containerWidth?:number; containerHeight?:number; cardSize?:number; spread?:number; rotation?:number; arc?:number; animationDelay?:number; animationStagger?:number; bounciness?:number; enableHover?:boolean; pushDistance?:number; hoverScale?:number; borderWidth?:number; borderColor?:string; radius?:number; shadow?:boolean; transformStyles?:string[]; onCardClick?:(index:number)=>void };
declare const BounceCards: ComponentType<Props>;
export default BounceCards;
