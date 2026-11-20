// Set a real, base-aware asset URL only after the corresponding file exists.
// Planned assets: assets/lanyard/card-front.png, card-back.png, strap-logo.png.
export const contactDescription = '欢迎交流内容创作与视觉表达。'; // Temporary copy; replace here.

export const lanyardConfig = {
  frontImage: null as string | null,
  backImage: null as string | null,
  strapImage: null as string | null,
  imageFit: 'contain' as const,
  cardColor: '#E9EBED',
  orientation: 'portrait' as const,
  finish: 'matte' as const,
  cornerRadius: .2,
  anchor: 'center' as const,
  strapColor: '#111111',
  metal: 'silver' as const,
  interactive: true,
  intro: true,
  size: .8,
  strapLength: .12,
  gravity: 1,
  damping: .75,
  elasticity: .2,
  breeze: 0,
};
