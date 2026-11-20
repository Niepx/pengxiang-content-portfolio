"""Create mobile derivatives; keep desktop and supplied originals unchanged."""
from pathlib import Path
import concurrent.futures,json,re,subprocess,sys
from PIL import Image,ImageOps
root=Path('public/assets')
ff=sys.argv[1]
audit=[]
for p in root.rglob('*.mp4'):
 if '.mobile.' in p.name or p.name.startswith('joji'): continue
 info=subprocess.run([ff,'-hide_banner','-i',str(p)],capture_output=True,text=True).stderr
 audit.append({'path':str(p.relative_to(root)),'info':info})
def video(row):
 p=root/row['path']; out=p.with_name(p.stem+'.mobile.mp4')
 bitrate=re.search(r'bitrate: (\d+) kb/s',row['info']); small=bitrate and int(bitrate[1])<800 and 'Video: h264' in row['info']
 cmd=[ff,'-hide_banner','-loglevel','error','-y','-i',str(p),'-map','0:v:0','-map','0:a?']
 if small:cmd+=['-c','copy']
 else:cmd+=['-vf',"scale=w='min(960,iw)':h='min(960,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1",'-r','30','-c:v','libx264','-profile:v','main','-level:v','3.1','-preset','fast','-crf','26','-maxrate','900k','-bufsize','1800k','-g','60','-pix_fmt','yuv420p','-threads','2','-c:a','aac','-b:a','64k','-ac','2']
 subprocess.run(cmd+['-movflags','+faststart',str(out)],check=True)
 result={'source':row['path'],'mobile':str(out.relative_to(root)),'before':p.stat().st_size,'after':out.stat().st_size,'mode':'remux' if small else 'encode'}
 print(json.dumps(result),flush=True);return result
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:videos=list(pool.map(video,audit))
Path('src/mobile-videos.json').write_text(json.dumps({r['source']:r['mobile'] for r in videos},indent=2)+'\n')
Path('docs/mobile-videos.json').write_text(json.dumps(videos,indent=2)+'\n')
# Every desktop display image + video poster gets a smaller mobile rendition.
display=json.loads(Path('src/display-assets.json').read_text());posters=json.loads(Path('src/video-posters.json').read_text())
sources=set(display.values())|set(posters.values())
sources|={str(p.relative_to(root)) for p in root.rglob('*.webp') if '.mobile.' not in p.name and 'skill-sequence' not in str(p) and p.stat().st_size>90000}
def image(rel):
 p=root/rel;out=p.with_name(p.stem+'.mobile.webp')
 with Image.open(p) as src:
  im=ImageOps.exif_transpose(src);im.thumbnail((720,9000),Image.Resampling.LANCZOS);im.save(out,'WEBP',quality=78,method=5)
 return {'source':rel,'mobile':str(out.relative_to(root)),'before':p.stat().st_size,'after':out.stat().st_size}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:images=list(pool.map(image,sorted(sources)))
mapping={r['source']:r['mobile'] for r in images}
for original,desktop in display.items():
 if desktop in mapping:mapping[original]=mapping[desktop]
Path('src/mobile-images.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2)+'\n')
Path('docs/mobile-images.json').write_text(json.dumps(images,ensure_ascii=False,indent=2)+'\n')
print('TOTAL',json.dumps({kind:{'count':len(rows),'beforeMB':sum(r['before'] for r in rows)/1e6,'afterMB':sum(r['after'] for r in rows)/1e6} for kind,rows in [('videos',videos),('images',images)]}),flush=True)
