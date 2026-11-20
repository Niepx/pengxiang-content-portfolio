import { useEffect, useState } from 'react';
import { cardDesign } from './cardDesign';

const WIDTH = 1920, HEIGHT = 2700;
const font = 'Kanit, "PingFang SC", "Microsoft YaHei", sans-serif';
const load = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

export function useCardTextures(enabled: boolean) {
  const [textures, setTextures] = useState<{ front: string; back: string } | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    async function draw() {
      const [portrait, qr, icons] = await Promise.all([
        load(cardDesign.portrait), load(cardDesign.qrImage),
        Promise.all(cardDesign.socialIcons.map(src => load(src).catch(() => null))),
        document.fonts.ready,
      ]);
      await Promise.all([
        document.fonts.load('500 112px Kanit', 'Joji PERSONAL ID'),
        document.fonts.load('900 230px "PingFang SC"', cardDesign.chineseName),
        document.fonts.load('500 100px "PingFang SC"', '聂鹏翔保持联系微信邮箱'),
      ]);
      const canvas = document.createElement('canvas');
      canvas.width = WIDTH; canvas.height = HEIGHT;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const text = (value: string, x: number, y: number, size: number, weight = 400, color = '#20262B') => {
        ctx.font = `${weight} ${size}px ${font}`;
        ctx.fillStyle = color;
        ctx.fillText(value, x, y);
      };
      const clear = () => { ctx.fillStyle = '#E9EBED'; ctx.fillRect(0, 0, WIDTH, HEIGHT); };
      clear();
      text('PERSONAL ID', 150, 355, 76, 500, '#505A62');
      text('2026', 1580, 355, 76, 500, '#505A62');
      // Keep the original portrait intact in a slightly smaller square area.
      ctx.drawImage(portrait, 190, 460, 1540, 1540);
      text(cardDesign.chineseName, 150, 2300, 230, 900);
      const chineseNameWidth = ctx.measureText(cardDesign.chineseName).width;
      text(cardDesign.name, 150 + chineseNameWidth + 72, 2300, 112, 500, '#505A62');
      const professionBaseline = 2500;
      text(cardDesign.profession, 150, professionBaseline, 88, 500, '#505A62');
      // Align the supplied square platform icons with the visible bottom of the role text.
      const iconSize = 104, iconGap = 28;
      const iconsLeft = 1770 - (icons.length * iconSize + (icons.length - 1) * iconGap);
      const iconsBottom = professionBaseline + ctx.measureText(cardDesign.profession).actualBoundingBoxDescent;
      icons.forEach((icon, index) => {
        if (icon) ctx.drawImage(icon, iconsLeft + index * (iconSize + iconGap), iconsBottom - iconSize, iconSize, iconSize);
      });
      const front = canvas.toDataURL('image/png');
      clear();
      text('JOJI / CONTACT', 150, 355, 76, 500, '#505A62');
      // Preserve the supplied QR, including its quiet zone. Multiplying its white
      // background into the silver card removes the visible white panel without
      // changing, cropping, or regenerating any encoded modules.
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(qr, 250, 740, 1420, 1420);
      ctx.restore();
      ctx.save();
      ctx.textAlign = 'center';
      text(cardDesign.email, WIDTH / 2, 2350, 112, 400);
      ctx.restore();
      const back = canvas.toDataURL('image/png');
      if (alive) setTextures({ front, back });
    }
    draw().catch(error => console.warn('Contact card artwork could not load', error));
    return () => { alive = false; };
  }, [enabled]);
  return textures;
}
