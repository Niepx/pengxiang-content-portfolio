import { CSSProperties, useEffect, useRef } from 'react';
import './cursor-grid.css';

type CursorGridProps = {
  cellSize?: number;
  color?: string;
  gridColor?: string;
  radius?: number;
  lineWidth?: number;
  gridOpacity?: number;
  highlightOpacity?: number;
  className?: string;
  style?: CSSProperties;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const rgb = (hex: string) => {
  const value = hex.replace('#', '').trim();
  const normalized = value.length === 3 ? value.split('').map(char => char + char).join('') : value;
  const parsed = Number.parseInt(normalized.slice(0, 6), 16);
  if (Number.isNaN(parsed)) return [255, 255, 255] as const;
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255] as const;
};

export default function CursorGrid({
  cellSize = 68,
  color = '#b9c7cf',
  gridColor = '#71808a',
  radius = 165,
  lineWidth = 1,
  gridOpacity = 0.04,
  highlightOpacity = 0.16,
  className = '',
  style,
}: CursorGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!container || !canvas || !context) return;
    const pointerSurface = container.parentElement;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const interactive = finePointer && !reduceMotion;
    const target = { x: 0, y: 0, presence: 0 };
    const current = { x: 0, y: 0, presence: 0 };
    const base = rgb(gridColor);
    const active = rgb(color);
    let width = 1;
    let height = 1;
    let dpr = 1;
    let frame = 0;
    let visible = true;

    const draw = () => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineWidth = lineWidth;
      context.strokeStyle = `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${gridOpacity})`;
      context.beginPath();
      for (let x = 0.5; x <= width; x += cellSize) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }
      for (let y = 0.5; y <= height; y += cellSize) {
        context.moveTo(0, y);
        context.lineTo(width, y);
      }
      context.stroke();

      if (current.presence < 0.002) return;
      const left = Math.max(0, current.x - radius);
      const right = Math.min(width, current.x + radius);
      const top = Math.max(0, current.y - radius);
      const bottom = Math.min(height, current.y + radius);

      for (let x = Math.floor(left / cellSize) * cellSize + 0.5; x <= right; x += cellSize) {
        const distance = Math.abs(x - current.x) / radius;
        const strength = (1 - clamp(distance, 0, 1)) ** 2 * current.presence;
        const gradient = context.createLinearGradient(0, top, 0, bottom);
        gradient.addColorStop(0, `rgba(${active[0]}, ${active[1]}, ${active[2]}, 0)`);
        gradient.addColorStop(0.5, `rgba(${active[0]}, ${active[1]}, ${active[2]}, ${highlightOpacity * strength})`);
        gradient.addColorStop(1, `rgba(${active[0]}, ${active[1]}, ${active[2]}, 0)`);
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(x, top);
        context.lineTo(x, bottom);
        context.stroke();
      }

      for (let y = Math.floor(top / cellSize) * cellSize + 0.5; y <= bottom; y += cellSize) {
        const distance = Math.abs(y - current.y) / radius;
        const strength = (1 - clamp(distance, 0, 1)) ** 2 * current.presence;
        const gradient = context.createLinearGradient(left, 0, right, 0);
        gradient.addColorStop(0, `rgba(${active[0]}, ${active[1]}, ${active[2]}, 0)`);
        gradient.addColorStop(0.5, `rgba(${active[0]}, ${active[1]}, ${active[2]}, ${highlightOpacity * strength})`);
        gradient.addColorStop(1, `rgba(${active[0]}, ${active[1]}, ${active[2]}, 0)`);
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(left, y);
        context.lineTo(right, y);
        context.stroke();
      }
    };

    const tick = () => {
      frame = 0;
      const easing = 0.105;
      current.x += (target.x - current.x) * easing;
      current.y += (target.y - current.y) * easing;
      current.presence += (target.presence - current.presence) * 0.085;
      draw();
      const moving = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.12;
      const fading = Math.abs(target.presence - current.presence) > 0.002;
      if (visible && (moving || fading)) frame = window.requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame && visible) frame = window.requestAnimationFrame(tick);
    };

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      target.x = current.x = width / 2;
      target.y = current.y = height / 2;
      draw();
    };

    const move = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      target.x = clamp(event.clientX - bounds.left, 0, bounds.width);
      target.y = clamp(event.clientY - bounds.top, 0, bounds.height);
      target.presence = 1;
      wake();
    };

    const leave = () => {
      target.presence = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) wake();
      else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    if (interactive && pointerSurface) {
      pointerSurface.addEventListener('pointermove', move, { passive: true });
      pointerSurface.addEventListener('pointerleave', leave);
    }
    resize();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      pointerSurface?.removeEventListener('pointermove', move);
      pointerSurface?.removeEventListener('pointerleave', leave);
    };
  }, [cellSize, color, gridColor, gridOpacity, highlightOpacity, lineWidth, radius]);

  return (
    <div ref={containerRef} className={`cursor-grid ${className}`.trim()} style={style} aria-hidden="true">
      <canvas ref={canvasRef} className="cursor-grid__canvas" />
    </div>
  );
}
