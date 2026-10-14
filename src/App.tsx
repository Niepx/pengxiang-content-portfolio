import { ElementType, ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, MotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';

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
  const transitioningFront=useRef(true);
  const seeking=useRef(false);
  const scrolling=useRef(false);
  const lastPointer=useRef<{x:number;y:number}|null>(null);
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
      const isBackground=(pixel:number)=>{
        const i=pixel*4,r=data[i],g=data[i+1],b=data[i+2],chroma=Math.max(r,g,b)-Math.min(r,g,b),lightness=(r+g+b)/3;
        return darkBackdrop
          ? colorDistance(r,g,b)<18&&lightness<42&&chroma<22
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
          data[i+3]=0;
          continue;
        }
        const x=pixel%width,y=(pixel/width)|0;
        const touchesBackground=(x&&background[pixel-1])||(x<width-1&&background[pixel+1])||(y&&background[pixel-width])||(y<height-1&&background[pixel+width]);
        if(touchesBackground){
          const distance=colorDistance(data[i],data[i+1],data[i+2]);
          data[i+3]=darkBackdrop
            ? Math.max(72,Math.min(255,(distance-12)/18*255))
            : Math.max(72,Math.min(255,(distance-tolerance*.4)/(.7*tolerance)*255));
        }
        if(data[i+3]>96)hitMask[pixel]=255;
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
    const reset=()=>{neutral.current=true;transitioningFront.current=true;targetTime.current=FRONT_TIME;setDirection('front')};
    const lookAt=(angle:number,name=directionName(angle))=>{
      if(neutral.current){
        // A smile is a separate pose rather than part of the circular direction
        // timeline. Start a fresh directional arc so stale angles cannot send the
        // character around the back of the video on the next interaction.
        currentAngle.current=angle;
        transitioningFront.current=true;
      }
      neutral.current=false;targetAngle.current=angle;setDirection(name);
    };
    const pointerHitsCharacter=(x:number,y:number)=>{
      const rect=hostRef.current?.getBoundingClientRect(),mask=maskRef.current,canvas=canvasRef.current;
      if(!rect||!mask||!canvas||x<rect.left||x>rect.right||y<rect.top||y>rect.bottom)return false;
      const px=Math.min(canvas.width-1,Math.max(0,Math.floor((x-rect.left)/rect.width*canvas.width)));
      const py=Math.min(canvas.height-1,Math.max(0,Math.floor((y-rect.top)/rect.height*canvas.height)));
      return mask[py*canvas.width+px]>0;
    };
    const pointerMove=(event:MouseEvent)=>{
      if(scrolling.current)return;
      const previous=lastPointer.current;
      lastPointer.current={x:event.clientX,y:event.clientY};
      // Browsers can dispatch a synthetic mousemove as the page appears. Keep
      // the opening smile until the pointer has actually moved.
      if(!previous||Math.hypot(event.clientX-previous.x,event.clientY-previous.y)<2)return;
      const x=event.clientX-window.innerWidth/2,y=event.clientY-window.innerHeight/2;
      if(pointerHitsCharacter(event.clientX,event.clientY))return reset();
      // Extend the active field into the lower half of the hero. Lower pointer
      // positions resolve to left/right instead of a downward pose; looking
      // down remains reserved exclusively for page scrolling.
      const directionalY=Math.min(y,0);
      if(Math.hypot(x,directionalY)<28)return reset();
      lookAt(Math.atan2(-directionalY,x));
    };
    const finishScrollLater=()=>{
      window.clearTimeout(scrollTimer.current);
      scrollTimer.current=window.setTimeout(()=>{scrolling.current=false;reset()},420);
    };
    const beginDownScroll=()=>{
      // Treat an entire wheel/touchpad sequence as one gesture. Only the first
      // downward event changes the target; later events merely keep the session
      // alive so the character stays locked looking down.
      if(!scrolling.current){
        scrolling.current=true;
        lookAt(Math.PI*3/2,'down');
      }
      finishScrollLater();
    };
    const wheel=(event:WheelEvent)=>{
      // Wheel fires before layout moves, so lock out the synthetic mousemove
      // caused by scrolling and continue from the current gaze without a
      // one-frame detour through the front pose.
      if(event.deltaY>0){beginDownScroll();return}
      if(!scrolling.current&&event.deltaY<0){scrolling.current=true;reset()}
      finishScrollLater();
    };
    const scroll=()=>{
      const nextScrollY=window.scrollY,scrollDelta=nextScrollY-lastScrollY;
      lastScrollY=nextScrollY;
      if(scrollDelta>0){beginDownScroll();return}
      if(!scrolling.current&&scrollDelta<0){scrolling.current=true;reset()}
      finishScrollLater();
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
        // Circular wrapping is correct between directional poses, but wrong
        // while entering or leaving the standalone smile pose.
        if(!neutral.current&&!transitioningFront.current){
          if(timeDelta>duration/2)timeDelta-=duration;
          if(timeDelta<-duration/2)timeDelta+=duration;
        }
        if(Math.abs(timeDelta)>.006&&!seeking.current){
          currentTime.current=(currentTime.current+timeDelta*.2+duration)%duration;
          seeking.current=true;video.currentTime=currentTime.current;
        }
        if(!neutral.current&&Math.abs(timeDelta)<.04)transitioningFront.current=false;
      }
      animationFrame.current=requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove',pointerMove,{passive:true});
    window.addEventListener('wheel',wheel,{passive:true,capture:true});
    window.addEventListener('scroll',scroll,{passive:true});
    window.addEventListener('blur',reset);
    animationFrame.current=requestAnimationFrame(animate);
    return()=>{window.removeEventListener('mousemove',pointerMove);window.removeEventListener('wheel',wheel,{capture:true});window.removeEventListener('scroll',scroll);window.removeEventListener('blur',reset);window.clearTimeout(scrollTimer.current);if(animationFrame.current)cancelAnimationFrame(animationFrame.current)};
  },[]);

  return <div ref={hostRef} data-direction={direction} className={`hero-character relative aspect-[5/6] w-full transition-[opacity,filter] duration-700 ${ready?'opacity-100 blur-0':'opacity-0 blur-md'}`} role="img" aria-label={`Joji IP character looking ${direction}`}>
    <canvas ref={canvasRef} width="480" height="576" className="relative h-full w-full select-none object-contain"/>
    <video ref={videoRef} src="/assets/joji-ip-expression-v2.mp4" muted playsInline preload="auto" className="hidden" aria-hidden="true"/>
  </div>
}

function HeroSection(){return <section className="relative flex h-[100svh] min-h-[620px] flex-col overflow-x-clip px-6 md:px-10">
  <FadeIn as="nav" y={-20} className="z-30 flex justify-between pt-6 text-sm font-medium uppercase tracking-wider md:pt-8 md:text-lg lg:text-[1.4rem]">{[{label:'About',href:'#about'},{label:'Projects',href:'#projects'},{label:'Experience',href:'#services'},{label:'Contact',href:'#contact'}].map(({label,href})=><a key={label} className="transition-opacity duration-200 hover:opacity-70" href={href}>{label}</a>)}</FadeIn>
  <div className="overflow-hidden"><FadeIn id="hero-title" as="h1" delay={.15} y={40} className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[14vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[15vw] md:-mt-5 md:text-[16vw] lg:text-[17.5vw]">Hi, i&apos;m joji</FadeIn></div>
  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center sm:items-end"><FadeIn delay={.6} y={30} className="pointer-events-auto w-[270px] sm:w-[340px] md:w-[420px] lg:w-[480px]"><InteractiveCharacter/></FadeIn></div>
  <div className="relative z-20 mt-auto flex items-end justify-between gap-4 pb-7 sm:pb-8 md:pb-10"><FadeIn as="p" delay={.35} y={20} className="shrink-0 text-[clamp(.55rem,.9vw,.95rem)] font-light leading-tight tracking-[.02em]"><span className="block whitespace-nowrap">From product insight to final output,</span><span className="block whitespace-nowrap">make ideas easier to see, understand, and share.</span></FadeIn><FadeIn delay={.5} y={20}><ContactButton/></FadeIn></div>
  </section>}

function Character({char,progress,range}:{char:string;progress:MotionValue<number>;range:[number,number]}){const opacity=useTransform(progress,range,[.2,1]);if(char==='\n')return <br/>;return <span className="relative inline-block"><span className="opacity-0">{char===' '?'\u00a0':char}</span><motion.span aria-hidden className="absolute inset-0" style={{opacity}}>{char===' '?'\u00a0':char}</motion.span></span>}
function AnimatedText({children,className=''}:{children:string;className?:string}){const ref=useRef<HTMLParagraphElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start 0.8','end 0.2']});return <p ref={ref} className={`text-[clamp(.96rem,1.35vw,1.2rem)] font-medium leading-[1.85] ${className}`}>{children.split('').map((c,i,a)=><Character key={i} char={c} progress={scrollYProgress} range={[i/a.length,Math.min(1,i/a.length+.12)]}/>)}</p>}

function SceneAnimatedText({children,progress,className=''}:{children:string;progress:MotionValue<number>;className?:string}){return <p className={`text-[clamp(.96rem,1.35vw,1.2rem)] font-medium leading-[1.85] ${className}`}>{children.split('').map((c,i,a)=>{const start=.025+i/a.length*.18;return <Character key={i} char={c} progress={progress} range={[start,Math.min(.25,start+.035)]}/>})}</p>}

const aboutCopy=`我是聂鹏翔，我有 4 年新媒体与内容相关工作经验，过往经历覆盖医疗、本地生活、AI 机器人、AI 智能硬件及个人自媒体等不同方向。

早期主要从事新媒体内容与账号运营，接触过短视频二创、文案策划、平台发布、评论私信维护及线索承接等工作；之后逐渐转向产品内容方向，开始参与 AI 桌面机器人、AI 陪伴产品、智能硬件等项目。

近两段工作中，主要围绕产品卖点梳理、图文视觉、电商物料、短视频策划拍摄剪辑、AIGC 内容制作及多平台内容运营展开，同时也参与过新品发布、展会宣传、商务展示及品牌传播相关内容。

除工作外，我也持续运营个人 Bilibili 音乐账号，并尝试不同类型的个人内容创作。目前也在尝试抖音和小红书的美食自媒体，从选题、拍摄、画面表达，到内容形式和账号方向都在持续摸索。

与此同时，我也保持对 AI 工具在实际创作中的应用，包括现在这个个人作品集网站，也是在 AI 辅助下完成视觉构思、页面结构与交互实现，并持续迭代。`;

const skillCopyLines = [
  '我习惯把 AI 工具融入完整的内容生产流程，从灵感梳理、文案与脚本，到视觉生成、视频剪辑、页面搭建和内容发布。会根据不同任务组合',
  'ChatGPT、Gemini、Canva、剪映、Codex 等工具，提高内容制作效率，并持续尝试将 AI 应用到新媒体、产品内容和个人创作中。',
];

const skillFramePaths=Array.from({length:54},(_,index)=>`/assets/skill-sequence/frame-${String(index).padStart(3,'0')}.jpg`);

function AboutSkillsScene(){
  const sectionRef=useRef<HTMLElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const framesRef=useRef<HTMLImageElement[]>([]);
  const progressRef=useRef(0);
  const frameRef=useRef(-1);
  const drawRef=useRef<(progress:number,force?:boolean)=>void>(()=>{});
  const animationFrameRef=useRef<number>();
  const [framesReady,setFramesReady]=useState(false);
  const {scrollYProgress}=useScroll({target:sectionRef,offset:['start start','end end']});
  const smoothProgress=useSpring(scrollYProgress,{stiffness:78,damping:24,mass:.36});
  const aboutOpacity=useTransform(smoothProgress,[0,.2,.27,.34],[1,1,.45,0]);
  const aboutX=useTransform(smoothProgress,[0,.22,.34],['0%','0%','-10%']);
  const aboutMobileY=useTransform(smoothProgress,[0,.15,.25,.34],[0,-330,-470,-540]);
  const aboutImageOpacity=useTransform(smoothProgress,[0,.2,.3],[1,1,0]);
  // Let the sequence finish at full size, crossfade to the matching HD still,
  // then create the final Skills composition by shrinking the still itself.
  const canvasOpacity=useTransform(smoothProgress,[0,.2,.29,.6799,.68],[0,0,1,1,0]);
  const skillsImageOpacity=useTransform(smoothProgress,[.6799,.68],[0,1]);
  const skillsImageTop=useTransform(smoothProgress,[.68,.72,.88],['0vh','0vh','34vh']);
  const skillsImageBottom=useTransform(smoothProgress,[.68,.72,.88],['0vh','0vh','4vh']);
  const skillsImageInset=useTransform(smoothProgress,[.68,.72,.88],['0vw','0vw','9vw']);
  const skillsImageRadius=useTransform(smoothProgress,[.68,.72,.88],[0,24,48]);
  const skillsOpacity=useTransform(smoothProgress,[.46,.54,.68,.91,.985],[0,.5,1,1,0]);
  const skillsY=useTransform(smoothProgress,[.46,.68,.91,.985],[46,0,0,-44]);
  const canvasScale=useTransform(smoothProgress,[0,.68],[1,1]);
  const canvasY=useTransform(smoothProgress,[0,.68],['0%','0%']);
  const canvasRadius=useTransform(smoothProgress,[0,.68],[0,0]);
  const sceneScale=useTransform(smoothProgress,[0,.9,1],[1,1,.94]);
  const sceneY=useTransform(smoothProgress,[0,.9,1],['0%','0%','-3%']);
  const sceneRadius=useTransform(smoothProgress,[0,.9,1],[0,0,60]);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const context=canvas.getContext('2d',{alpha:false});
    if(!context)return;
    let cancelled=false,loaded=0;
    const frames=skillFramePaths.map((src,index)=>{
      const image=new Image();
      image.decoding='async';
      image.src=src;
      image.onload=()=>{
        loaded+=1;
        if(cancelled)return;
        if(index===0)drawRef.current(progressRef.current,true);
        if(loaded===skillFramePaths.length)setFramesReady(true);
      };
      return image;
    });
    framesRef.current=frames;
    const draw=(progress:number,force=false)=>{
      const frameProgress=Math.max(0,Math.min(1,(progress-.2)/.48));
      const targetFrame=Math.round(frameProgress*(frames.length-1));
      const isMobile=canvas.clientWidth<640;
      if(!force&&targetFrame===frameRef.current&&!(isMobile&&progress>.58))return;
      const image=frames[targetFrame];
      if(!image?.complete||!image.naturalWidth)return;
      frameRef.current=targetFrame;
      const ratio=Math.min(window.devicePixelRatio||1,2);
      const width=Math.max(1,Math.round(canvas.clientWidth*ratio));
      const height=Math.max(1,Math.round(canvas.clientHeight*ratio));
      if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height}
      const imageRatio=image.naturalWidth/image.naturalHeight;
      const canvasRatio=width/height;
      let drawWidth=width,drawHeight=height,drawX=0,drawY=0;
      if(isMobile){
        const actionScale=1.35-.35*Math.min(1,frameProgress*1.5);
        const landingProgress=Math.max(0,Math.min(1,(progress-.58)/.2));
        const mobileScale=actionScale-(actionScale-.82)*landingProgress;
        drawWidth=width*mobileScale;drawHeight=drawWidth/imageRatio;
        drawX=(width-drawWidth)*.52;drawY=(height-drawHeight)*.54;
      }else if(canvasRatio>imageRatio){drawHeight=width/imageRatio;drawY=(height-drawHeight)/2}
      else{drawWidth=height*imageRatio;drawX=(width-drawWidth)/2}
      context.fillStyle='#fff';context.fillRect(0,0,width,height);
      context.drawImage(image,drawX,drawY,drawWidth,drawHeight);
    };
    drawRef.current=draw;
    const resize=()=>draw(progressRef.current,true);
    window.addEventListener('resize',resize,{passive:true});
    draw(progressRef.current,true);
    return()=>{cancelled=true;window.removeEventListener('resize',resize);frames.forEach(image=>{image.onload=null});if(animationFrameRef.current)cancelAnimationFrame(animationFrameRef.current)}
  },[]);

  useMotionValueEvent(smoothProgress,'change',progress=>{
    progressRef.current=progress;
    if(animationFrameRef.current)cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current=requestAnimationFrame(()=>drawRef.current(progress));
  });

  return <section ref={sectionRef} id="about" className="relative h-[500vh] bg-[#0C0C0C] text-[#0C0C0C]">
    <div id="skills" className="pointer-events-none absolute left-0 top-[72%] h-px w-px"/>
    <motion.div style={{scale:sceneScale,y:sceneY,borderRadius:sceneRadius}} className="sticky top-0 h-[100svh] overflow-hidden bg-[#F3F3F0] will-change-transform">
      <motion.img src="/assets/about-angry-laptop-boy.png" alt="" aria-hidden="true" loading="eager" style={{opacity:aboutImageOpacity}} className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] w-full object-contain object-bottom md:inset-0 md:h-full md:object-cover md:object-center"/>
      <motion.div aria-hidden="true" style={{opacity:canvasOpacity,scale:canvasScale,y:canvasY,borderRadius:canvasRadius}} className="absolute inset-0 origin-center overflow-hidden bg-white will-change-transform">
        <canvas ref={canvasRef} role="img" aria-label="Joji moves from his About workspace into the Skills scene" className={`h-full w-full transition-opacity duration-500 ${framesReady?'opacity-100':'opacity-0'}`}/>
      </motion.div>
      <motion.div aria-hidden="true" style={{opacity:skillsImageOpacity,top:skillsImageTop,bottom:skillsImageBottom,left:skillsImageInset,right:skillsImageInset,borderRadius:skillsImageRadius}} className="pointer-events-none absolute z-[1] overflow-hidden bg-white shadow-[0_28px_90px_rgba(25,20,14,0.08)] will-change-[top,bottom,left,right,border-radius]">
        <img src="/assets/skill-falling-boy.png" alt="" loading="eager" className="h-full w-full object-contain"/>
      </motion.div>
      <motion.div style={{opacity:aboutOpacity,x:aboutX}} className="absolute inset-0 z-10 mx-auto hidden w-full max-w-[1600px] items-start px-10 py-[6vh] md:flex lg:px-16">
        <div className="w-[49%] max-w-[700px]">
          <h2 className="mb-7 text-[clamp(3.25rem,6.3vw,96px)] font-black uppercase leading-[.84] tracking-tight lg:mb-9">About me</h2>
          <SceneAnimatedText progress={smoothProgress} className="max-w-[680px] text-left !text-[clamp(1rem,.9vw,1.05rem)] !leading-[1.52] [text-wrap:pretty]">{aboutCopy}</SceneAnimatedText>
        </div>
      </motion.div>
      <motion.div style={{opacity:aboutOpacity}} className="absolute inset-x-0 top-[6vh] z-10 h-[58vh] overflow-hidden bg-white px-5 md:hidden">
        <motion.div style={{y:aboutMobileY}}>
        <h2 className="mb-8 text-[3.25rem] font-black uppercase leading-[.82] tracking-tight">About me</h2>
        <SceneAnimatedText progress={smoothProgress} className="!text-[1rem] !leading-[1.58] [text-wrap:pretty]">{aboutCopy}</SceneAnimatedText>
        </motion.div>
      </motion.div>
      <motion.div style={{opacity:skillsOpacity,y:skillsY}} className="absolute inset-0 z-20 mx-auto flex w-full max-w-[1500px] flex-col items-center px-5 pt-[7vh] text-center sm:px-8 md:px-10 lg:px-16">
        <h2 className="text-[clamp(3.5rem,9vw,132px)] font-black uppercase leading-[.82] tracking-tight">Skills</h2>
        <p className="mt-7 w-full max-w-[1280px] text-[clamp(.95rem,1.05vw,1.08rem)] font-medium leading-[1.55] [text-wrap:pretty] sm:mt-9 md:mt-11">
          {skillCopyLines.map((line, index) => (
            <span key={line} className="xl:block xl:whitespace-nowrap">
              {line}{index === 0 ? ' ' : ''}
            </span>
          ))}
        </p>
      </motion.div>
    </motion.div>
  </section>
}

const services=[['3D Modeling','Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.'],['Rendering','High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.'],['Motion Design','Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.'],['Branding','Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.'],['Web Design','Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.']];
function ServicesSection(){return <section id="services" className="relative rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"><FadeIn as="h2" className="mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28">Services</FadeIn><div className="mx-auto max-w-5xl border-t border-black/15">{services.map(([name,description],i)=><FadeIn key={name} delay={i*.1} className="grid grid-cols-[70px_1fr] gap-4 border-b border-black/15 py-8 sm:grid-cols-[150px_1fr] sm:gap-8 sm:py-10 md:grid-cols-[230px_1fr] md:py-12"><div className="text-[clamp(3rem,10vw,140px)] font-black leading-[.8]">{String(i+1).padStart(2,'0')}</div><div className="pt-1 sm:pt-3"><h3 className="text-[clamp(1rem,2.2vw,2.1rem)] font-medium uppercase">{name}</h3><p className="mt-3 max-w-2xl text-[clamp(.85rem,1.6vw,1.25rem)] font-light leading-relaxed opacity-60">{description}</p></div></FadeIn>)}</div></section>}

const projects=[
{name:'Nextlevel Studio',category:'Client',images:['https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85']},
{name:'Aura Brand Identity',category:'Personal',images:['https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85']},
{name:'Solaris Digital',category:'Client',images:['https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85']}
];
function ProjectCard({project,index}:{project:typeof projects[number];index:number}){const ref=useRef<HTMLDivElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});const scale=useTransform(scrollYProgress,[0,.8],[1,1-(projects.length-1-index)*.03]);return <div ref={ref} className="relative h-[85vh] min-h-[640px]"><motion.article style={{scale,top:`calc(6rem + ${index*28}px)`}} className="sticky flex max-h-[760px] min-h-[600px] flex-col rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:top-32 md:rounded-[60px] md:p-8"><div className="mb-5 grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:mb-7 md:grid-cols-[auto_1fr_1.5fr_auto]"><span className="text-[clamp(3rem,8vw,110px)] font-black leading-none">{String(index+1).padStart(2,'0')}</span><span className="text-xs font-light uppercase tracking-widest opacity-60 sm:text-sm">{project.category}</span><h3 className="col-span-2 text-xl font-medium uppercase sm:col-span-1 sm:text-3xl md:text-4xl">{project.name}</h3><LiveProjectButton/></div><div className="grid min-h-0 flex-1 grid-cols-[40%_60%] gap-2 sm:gap-3"><div className="grid min-h-0 grid-rows-[42%_58%] gap-2 sm:gap-3"><img src={project.images[0]} alt={`${project.name} detail one`} loading="lazy" className="h-full min-h-0 w-full rounded-[26px] object-cover sm:rounded-[40px] md:rounded-[50px]"/><img src={project.images[1]} alt={`${project.name} detail two`} loading="lazy" className="h-full min-h-0 w-full rounded-[26px] object-cover sm:rounded-[40px] md:rounded-[50px]"/></div><img src={project.images[2]} alt={`${project.name} hero`} loading="lazy" className="h-full min-h-0 w-full rounded-[26px] object-cover sm:rounded-[40px] md:rounded-[50px]"/></div></motion.article></div>}
function ProjectsSection(){return <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-3 pb-16 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-6 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pb-24 md:pt-32"><FadeIn as="h2" className="hero-heading mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28">Project</FadeIn><div className="mx-auto max-w-[1500px]">{projects.map((p,i)=><ProjectCard key={p.name} project={p} index={i}/>)}</div><footer id="contact" className="flex flex-col items-center gap-8 pt-16 text-center"><p className="hero-heading text-[clamp(2.5rem,8vw,110px)] font-black uppercase leading-none">Have a wild idea?</p><ContactButton/><p className="mt-10 text-xs font-light uppercase tracking-[.3em] opacity-50">© 2026 Pengxiang studio</p></footer></section>}

export default function App(){return <main className="overflow-x-clip bg-[#0C0C0C]"><HeroSection/><AboutSkillsScene/><ServicesSection/><ProjectsSection/></main>}
