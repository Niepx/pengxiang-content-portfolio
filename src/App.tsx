import { ElementType, ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';

type FadeProps = { children: ReactNode; delay?: number; duration?: number; x?: number; y?: number; as?: ElementType; className?: string; id?: string };
function FadeIn({ children, delay=0, duration=.7, x=0, y=30, as='div', className, id }: FadeProps) {
  const El = motion.create(as);
  return <El id={id} className={className} initial={{opacity:0,x,y}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true,margin:'50px',amount:0}} transition={{duration,delay,ease:[.25,.1,.25,1]}}>{children}</El>;
}

function ContactButton(){return <a href="#contact" className="group inline-flex items-center gap-2 rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white outline outline-2 outline-offset-[-3px] outline-white transition-transform duration-300 hover:scale-[1.03] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base" style={{background:'linear-gradient(123deg,#18011F 7%,#B600A8 37%,#7621B0 72%,#BE4C00 100%)',boxShadow:'0 4px 4px rgba(181,1,167,.25),4px 4px 12px #7721B1 inset'}}>Contact me <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45"/></a>}
function LiveProjectButton(){return <button className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-5 py-2.5 text-[10px] font-medium uppercase tracking-widest transition-colors hover:bg-[#D7E2EA]/10 sm:px-8 sm:py-3 sm:text-sm md:px-10 md:py-3.5 md:text-base">Live project <ArrowUpRight className="h-4 w-4"/></button>}

const TAU=Math.PI*2;
const FRONT_TIME=.7;
const directionFrames=[
  {angle:0,time:3.2},{angle:Math.PI/4,time:4.4},{angle:Math.PI/2,time:5.4},
  {angle:Math.PI*3/4,time:6.3},{angle:Math.PI,time:7.2},{angle:Math.PI*5/4,time:8.1},
  {angle:Math.PI*3/2,time:8.9},{angle:Math.PI*7/4,time:9.6}
];
const directionName=(angle:number)=>['right','upper-right','up','upper-left','left','lower-left','down','lower-right'][Math.round(((angle%TAU)+TAU)%TAU/(TAU/8))%8];
const angleToVideoTime=(angle:number,duration:number)=>{
  const normalized=((angle%TAU)+TAU)%TAU;
  const points=[...directionFrames,{angle:TAU,time:duration+directionFrames[0].time}];
  const next=Math.max(1,points.findIndex(point=>point.angle>=normalized));
  const from=points[next-1],to=points[next];
  const progress=(normalized-from.angle)/(to.angle-from.angle||1);
  return (from.time+(to.time-from.time)*progress)%duration;
};

function InteractiveCharacter(){
  const hostRef=useRef<HTMLDivElement>(null);
  const videoRef=useRef<HTMLVideoElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const bufferRef=useRef<HTMLCanvasElement>();
  const maskRef=useRef<Uint8Array>();
  const targetAngle=useRef(0);
  const currentAngle=useRef(0);
  const currentTime=useRef(FRONT_TIME);
  const targetTime=useRef(FRONT_TIME);
  const neutral=useRef(true);
  const seeking=useRef(false);
  const scrolling=useRef(false);
  const scrollTimer=useRef<number>();
  const animationFrame=useRef<number>();
  const [ready,setReady]=useState(false);
  const [direction,setDirection]=useState('front');

  useEffect(()=>{
    const video=videoRef.current,canvas=canvasRef.current;
    if(!video||!canvas)return;
    const width=canvas.width,height=canvas.height,total=width*height;
    const buffer=document.createElement('canvas');
    buffer.width=width;buffer.height=height;bufferRef.current=buffer;
    const bufferContext=buffer.getContext('2d',{willReadFrequently:true});
    const outputContext=canvas.getContext('2d');
    if(!bufferContext||!outputContext)return;
    const background=new Uint8Array(total),queue=new Uint32Array(total);
    const render=()=>{
      const sourceHeight=video.videoHeight||720;
      const sourceWidth=sourceHeight*5/6;
      const sourceX=((video.videoWidth||1280)-sourceWidth)/2;
      bufferContext.clearRect(0,0,width,height);
      bufferContext.drawImage(video,sourceX,0,sourceWidth,sourceHeight,0,0,width,height);
      const frame=bufferContext.getImageData(0,0,width,height),data=frame.data;
      background.fill(0);let head=0,tail=0;
      // The character fills the lower corners, so estimate the studio backdrop
      // from the two clear upper corners only.
      const samplePixels=[4,width-5];
      const backdrop=samplePixels.reduce((color,pixel)=>{const i=pixel*4;color[0]+=data[i];color[1]+=data[i+1];color[2]+=data[i+2];return color},[0,0,0]).map(value=>value/samplePixels.length);
      const backdropLightness=(backdrop[0]+backdrop[1]+backdrop[2])/3;
      const darkBackdrop=backdropLightness<90;
      const tolerance=darkBackdrop?26:74;
      const colorDistance=(r:number,g:number,b:number)=>Math.hypot(r-backdrop[0],g-backdrop[1],b-backdrop[2]);
      if(darkBackdrop){
        const hitMask=new Uint8Array(total);
        const leftEdge=new Int16Array(height),rightEdge=new Int16Array(height);
        leftEdge.fill(width);rightEdge.fill(-1);
        for(let y=0;y<height;y++){
          for(let x=0;x<width;x++){
            const i=(y*width+x)*4;
            if(colorDistance(data[i],data[i+1],data[i+2])>24){leftEdge[y]=Math.min(leftEdge[y],x);rightEdge[y]=x}
          }
          if(rightEdge[y]-leftEdge[y]<3){leftEdge[y]=width;rightEdge[y]=-1}
        }
        for(let y=1;y<height-1;y++){
          if(rightEdge[y]<0&&rightEdge[y-1]>=0&&rightEdge[y+1]>=0){leftEdge[y]=Math.min(leftEdge[y-1],leftEdge[y+1]);rightEdge[y]=Math.max(rightEdge[y-1],rightEdge[y+1])}
        }
        for(let y=0;y<height;y++)for(let x=0;x<width;x++){
          const pixel=y*width+x,i=pixel*4,left=leftEdge[y],right=rightEdge[y];
          if(right<0||x<left||x>right){data[i+3]=0;continue}
          hitMask[pixel]=255;
          data[i+3]=(x===left||x===right)?150:255;
        }
        outputContext.putImageData(frame,0,0);
        maskRef.current=hitMask;seeking.current=false;setReady(true);return;
      }
      const isBackground=(pixel:number)=>{
        const i=pixel*4,r=data[i],g=data[i+1],b=data[i+2],chroma=Math.max(r,g,b)-Math.min(r,g,b),lightness=(r+g+b)/3;
        return darkBackdrop
          ? lightness<22&&chroma<18
          : colorDistance(r,g,b)<tolerance&&chroma<92;
      };
      const enqueue=(pixel:number)=>{if(!background[pixel]&&isBackground(pixel)){background[pixel]=1;queue[tail++]=pixel}};
      for(let x=0;x<width;x++)enqueue(x)
      for(let y=0;y<height;y++){enqueue(y*width);enqueue(y*width+width-1)}
      while(head<tail){const pixel=queue[head++],x=pixel%width,y=(pixel/width)|0;if(x)enqueue(pixel-1);if(x<width-1)enqueue(pixel+1);if(y)enqueue(pixel-width);if(y<height-1)enqueue(pixel+width)}
      const hitMask=new Uint8Array(total);
      for(let pixel=0;pixel<total;pixel++){
        const i=pixel*4;
        if(background[pixel]){
          if(darkBackdrop){data[i]=12;data[i+1]=12;data[i+2]=12;data[i+3]=255}
          else data[i+3]=0;
          continue;
        }
        hitMask[pixel]=255;
        const x=pixel%width,y=(pixel/width)|0;
        const touchesBackground=(x&&background[pixel-1])||(x<width-1&&background[pixel+1])||(y&&background[pixel-width])||(y<height-1&&background[pixel+width]);
        if(touchesBackground){
          const distance=colorDistance(data[i],data[i+1],data[i+2]);
          if(darkBackdrop){
            const mix=Math.max(0,Math.min(1,(distance-6)/34));
            data[i]=12+(data[i]-12)*mix;data[i+1]=12+(data[i+1]-12)*mix;data[i+2]=12+(data[i+2]-12)*mix;data[i+3]=255;
          }else data[i+3]=Math.max(72,Math.min(255,(distance-tolerance*.4)/(.7*tolerance)*255));
        }
      }
      outputContext.putImageData(frame,0,0);
      maskRef.current=hitMask;seeking.current=false;setReady(true);
    };
    const seekFront=()=>{video.currentTime=Math.min(FRONT_TIME,Math.max(0,video.duration-.05))};
    video.addEventListener('loadedmetadata',seekFront);
    video.addEventListener('seeked',render);
    if(video.readyState>=1)seekFront();
    return()=>{video.removeEventListener('loadedmetadata',seekFront);video.removeEventListener('seeked',render)};
  },[]);

  useEffect(()=>{
    let lastScrollY=window.scrollY;
    const reset=()=>{neutral.current=true;targetTime.current=FRONT_TIME;setDirection('front')};
    const pointerHitsCharacter=(x:number,y:number)=>{
      const rect=hostRef.current?.getBoundingClientRect(),mask=maskRef.current,canvas=canvasRef.current;
      if(!rect||!mask||!canvas||x<rect.left||x>rect.right||y<rect.top||y>rect.bottom)return false;
      const px=Math.min(canvas.width-1,Math.max(0,Math.floor((x-rect.left)/rect.width*canvas.width)));
      const py=Math.min(canvas.height-1,Math.max(0,Math.floor((y-rect.top)/rect.height*canvas.height)));
      return mask[py*canvas.width+px]>0;
    };
    const pointerMove=(event:MouseEvent)=>{
      if(scrolling.current)return;
      const x=event.clientX-window.innerWidth/2,y=event.clientY-window.innerHeight/2;
      if(y>=0||pointerHitsCharacter(event.clientX,event.clientY))return reset();
      if(Math.hypot(x,y)<42)return reset();
      neutral.current=false;targetAngle.current=Math.atan2(-y,x);setDirection(directionName(targetAngle.current));
    };
    const scroll=()=>{
      const nextScrollY=window.scrollY,scrollingDown=nextScrollY>lastScrollY+1;
      lastScrollY=nextScrollY;scrolling.current=true;window.clearTimeout(scrollTimer.current);
      if(scrollingDown){neutral.current=false;targetAngle.current=Math.PI*3/2;setDirection('down')}
      else reset();
      scrollTimer.current=window.setTimeout(()=>{scrolling.current=false;reset()},180);
    };
    const animate=()=>{
      const video=videoRef.current;
      if(video?.duration){
        if(!neutral.current){
          const angleDelta=Math.atan2(Math.sin(targetAngle.current-currentAngle.current),Math.cos(targetAngle.current-currentAngle.current));
          currentAngle.current+=angleDelta*.075;
          targetTime.current=angleToVideoTime(currentAngle.current,video.duration);
        }
        const duration=video.duration;
        let timeDelta=targetTime.current-currentTime.current;
        if(timeDelta>duration/2)timeDelta-=duration;
        if(timeDelta<-duration/2)timeDelta+=duration;
        if(Math.abs(timeDelta)>.006&&!seeking.current){
          currentTime.current=(currentTime.current+timeDelta*.2+duration)%duration;
          seeking.current=true;video.currentTime=currentTime.current;
        }
      }
      animationFrame.current=requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove',pointerMove,{passive:true});
    window.addEventListener('scroll',scroll,{passive:true});
    window.addEventListener('blur',reset);
    animationFrame.current=requestAnimationFrame(animate);
    return()=>{window.removeEventListener('mousemove',pointerMove);window.removeEventListener('scroll',scroll);window.removeEventListener('blur',reset);window.clearTimeout(scrollTimer.current);if(animationFrame.current)cancelAnimationFrame(animationFrame.current)};
  },[]);

  return <div ref={hostRef} data-direction={direction} className={`hero-character relative aspect-[5/6] w-full transition-[opacity,filter] duration-700 ${ready?'opacity-100 blur-0':'opacity-0 blur-md'}`} role="img" aria-label={`Joji IP character looking ${direction}`}>
    <canvas ref={canvasRef} width="480" height="576" className="relative h-full w-full select-none object-contain"/>
    <video ref={videoRef} src="/assets/joji-ip-expression-v2.mp4" muted playsInline preload="auto" className="hidden" aria-hidden="true"/>
  </div>
}

function HeroSection(){return <section className="relative flex h-screen min-h-[620px] flex-col overflow-x-clip px-6 md:px-10">
  <FadeIn as="nav" y={-20} className="z-30 flex justify-between pt-6 text-sm font-medium uppercase tracking-wider md:pt-8 md:text-lg lg:text-[1.4rem]">{[{label:'About',href:'#about'},{label:'Projects',href:'#projects'},{label:'Experience',href:'#services'},{label:'Contact',href:'#contact'}].map(({label,href})=><a key={label} className="transition-opacity duration-200 hover:opacity-70" href={href}>{label}</a>)}</FadeIn>
  <div className="overflow-hidden"><FadeIn id="hero-title" as="h1" delay={.15} y={40} className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[14vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[15vw] md:-mt-5 md:text-[16vw] lg:text-[17.5vw]">Hi, i&apos;m joji</FadeIn></div>
  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center sm:items-end"><FadeIn delay={.6} y={30} className="pointer-events-auto w-[270px] sm:w-[340px] md:w-[420px] lg:w-[480px]"><InteractiveCharacter/></FadeIn></div>
  <div className="relative z-20 mt-auto flex items-end justify-between gap-4 pb-7 sm:pb-8 md:pb-10"><FadeIn as="p" delay={.35} y={20} className="shrink-0 text-[clamp(.55rem,.9vw,.95rem)] font-light leading-tight tracking-[.02em]"><span className="block whitespace-nowrap">From product insight to final output,</span><span className="block whitespace-nowrap">make ideas easier to see, understand, and share.</span></FadeIn><FadeIn delay={.5} y={20}><ContactButton/></FadeIn></div>
  </section>}

const motionImages=['https://motionsites.org/assets/hero-space-voyage-preview-eECLH3Yc.gif','https://motionsites.org/assets/hero-codenest-preview-Cgppc2qV.gif','https://motionsites.org/assets/hero-vex-ventures-preview-BczMFIiw.gif','https://motionsites.org/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif','https://motionsites.org/assets/hero-asme-preview-B_nGDnTP.gif','https://motionsites.org/assets/hero-transform-data-preview-Cx5OU29N.gif','https://motionsites.org/assets/hero-vitara-preview-Cjz2QYyU.gif','https://motionsites.org/assets/hero-terra-preview-BFjrCr7T.gif','https://motionsites.org/assets/hero-skyelite-preview-DHaZIgUv.gif','https://motionsites.org/assets/hero-aethera-preview-DknSlcTa.gif','https://motionsites.org/assets/hero-designpro-preview-D8c5_een.gif','https://motionsites.org/assets/hero-stellar-ai-preview-D3HL6bw1.gif','https://motionsites.org/assets/hero-xportfolio-preview-D4A8maiC.gif','https://motionsites.org/assets/hero-orbit-web3-preview-BXt4OttD.gif','https://motionsites.org/assets/hero-nexora-preview-cx5HmUgo.gif','https://motionsites.org/assets/hero-evr-ventures-preview-DZxeVFEX.gif','https://motionsites.org/assets/hero-planet-orbit-preview-DWAP8Z1P.gif','https://motionsites.org/assets/hero-new-era-preview-CocuDUm9.gif','https://motionsites.org/assets/hero-wealth-preview-B70idl_u.gif','https://motionsites.org/assets/hero-luminex-preview-CxOP7ce6.gif','https://motionsites.org/assets/hero-celestia-preview-0yO3jXO8.gif'];
function MarqueeRow({images,right,offset}:{images:string[];right:boolean;offset:number}){const all=[...images,...images,...images];const base=images.length*432;return <div className="flex w-max gap-3" style={{transform:`translate3d(${right?offset-base:-(offset+base)}px,0,0)`,willChange:'transform'}}>{all.map((src,i)=><img key={`${src}-${i}`} src={src} loading="lazy" alt="Selected motion design work" className="h-[180px] w-[280px] shrink-0 rounded-2xl object-cover sm:h-[220px] sm:w-[340px] md:h-[270px] md:w-[420px]"/>)}</div>}
function MarqueeSection(){const ref=useRef<HTMLElement>(null);const [offset,setOffset]=useState(0);useEffect(()=>{let frame=0;const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(ref.current)setOffset((window.scrollY-ref.current.offsetTop+window.innerHeight)*.3)})};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}},[]);return <section ref={ref} className="overflow-hidden pb-10 pt-24 sm:pt-32 md:pt-40" aria-label="Motion work showcase"><div className="flex flex-col gap-3"><MarqueeRow images={motionImages.slice(0,11)} right offset={offset-200}/><MarqueeRow images={motionImages.slice(11)} right={false} offset={offset-200}/></div></section>}

function Character({char,progress,range}:{char:string;progress:MotionValue<number>;range:[number,number]}){const opacity=useTransform(progress,range,[.2,1]);return <span className="relative inline-block"><span className="opacity-0">{char===' '?'\u00a0':char}</span><motion.span aria-hidden className="absolute inset-0" style={{opacity}}>{char===' '?'\u00a0':char}</motion.span></span>}
function AnimatedText({children}:{children:string}){const ref=useRef<HTMLParagraphElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start 0.8','end 0.2']});return <p ref={ref} className="max-w-[560px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed">{children.split('').map((c,i,a)=><Character key={i} char={c} progress={scrollYProgress} range={[i/a.length,Math.min(1,i/a.length+.12)]}/>)}</p>}
const ornaments=[
['https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png','3D moon','top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]',.1,-80],
['https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png','Abstract chrome form','bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]',.25,-80],
['https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png','3D toy brick','top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]',.15,80],
['https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png','Colorful 3D composition','bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]',.3,80]
] as const;
function AboutSection(){return <section id="about" className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10">{ornaments.map(([src,alt,cls,delay,x])=><FadeIn key={src} delay={delay} x={x} y={0} duration={.9} className={`pointer-events-none absolute z-0 ${cls}`}><img src={src} alt={alt} loading="lazy" className="w-full object-contain"/></FadeIn>)}<div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16"><FadeIn as="h2" y={40} className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight">About me</FadeIn><div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24"><AnimatedText>With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let&apos;s build something incredible together!</AnimatedText><ContactButton/></div></div></section>}

const services=[['3D Modeling','Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.'],['Rendering','High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.'],['Motion Design','Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.'],['Branding','Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.'],['Web Design','Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.']];
function ServicesSection(){return <section id="services" className="relative rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"><FadeIn as="h2" className="mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28">Services</FadeIn><div className="mx-auto max-w-5xl border-t border-black/15">{services.map(([name,description],i)=><FadeIn key={name} delay={i*.1} className="grid grid-cols-[70px_1fr] gap-4 border-b border-black/15 py-8 sm:grid-cols-[150px_1fr] sm:gap-8 sm:py-10 md:grid-cols-[230px_1fr] md:py-12"><div className="text-[clamp(3rem,10vw,140px)] font-black leading-[.8]">{String(i+1).padStart(2,'0')}</div><div className="pt-1 sm:pt-3"><h3 className="text-[clamp(1rem,2.2vw,2.1rem)] font-medium uppercase">{name}</h3><p className="mt-3 max-w-2xl text-[clamp(.85rem,1.6vw,1.25rem)] font-light leading-relaxed opacity-60">{description}</p></div></FadeIn>)}</div></section>}

const projects=[
{name:'Nextlevel Studio',category:'Client',images:['https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85']},
{name:'Aura Brand Identity',category:'Personal',images:['https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85']},
{name:'Solaris Digital',category:'Client',images:['https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85']}
];
function ProjectCard({project,index}:{project:typeof projects[number];index:number}){const ref=useRef<HTMLDivElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});const scale=useTransform(scrollYProgress,[0,.8],[1,1-(projects.length-1-index)*.03]);return <div ref={ref} className="relative h-[85vh] min-h-[640px]"><motion.article style={{scale,top:`calc(6rem + ${index*28}px)`}} className="sticky flex max-h-[760px] min-h-[600px] flex-col rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:top-32 md:rounded-[60px] md:p-8"><div className="mb-5 grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:mb-7 md:grid-cols-[auto_1fr_1.5fr_auto]"><span className="text-[clamp(3rem,8vw,110px)] font-black leading-none">{String(index+1).padStart(2,'0')}</span><span className="text-xs font-light uppercase tracking-widest opacity-60 sm:text-sm">{project.category}</span><h3 className="col-span-2 text-xl font-medium uppercase sm:col-span-1 sm:text-3xl md:text-4xl">{project.name}</h3><LiveProjectButton/></div><div className="grid min-h-0 flex-1 grid-cols-[40%_60%] gap-2 sm:gap-3"><div className="grid min-h-0 grid-rows-[42%_58%] gap-2 sm:gap-3"><img src={project.images[0]} alt={`${project.name} detail one`} loading="lazy" className="h-full min-h-0 w-full rounded-[26px] object-cover sm:rounded-[40px] md:rounded-[50px]"/><img src={project.images[1]} alt={`${project.name} detail two`} loading="lazy" className="h-full min-h-0 w-full rounded-[26px] object-cover sm:rounded-[40px] md:rounded-[50px]"/></div><img src={project.images[2]} alt={`${project.name} hero`} loading="lazy" className="h-full min-h-0 w-full rounded-[26px] object-cover sm:rounded-[40px] md:rounded-[50px]"/></div></motion.article></div>}
function ProjectsSection(){return <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-3 pb-16 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-6 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pb-24 md:pt-32"><FadeIn as="h2" className="hero-heading mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28">Project</FadeIn><div className="mx-auto max-w-[1500px]">{projects.map((p,i)=><ProjectCard key={p.name} project={p} index={i}/>)}</div><footer id="contact" className="flex flex-col items-center gap-8 pt-16 text-center"><p className="hero-heading text-[clamp(2.5rem,8vw,110px)] font-black uppercase leading-none">Have a wild idea?</p><ContactButton/><p className="mt-10 text-xs font-light uppercase tracking-[.3em] opacity-50">© 2026 Pengxiang studio</p></footer></section>}

export default function App(){return <main className="overflow-x-clip bg-[#0C0C0C]"><HeroSection/><MarqueeSection/><AboutSection/><ServicesSection/><ProjectsSection/></main>}
