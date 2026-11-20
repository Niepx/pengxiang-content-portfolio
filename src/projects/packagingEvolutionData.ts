import type { MediaItem } from './data';
const asset = (file: string) => `${import.meta.env.BASE_URL}assets/projects/panda-packaging/${file}`;
const image = (id: string, title: string, file: string, preview?: string): MediaItem & { preview: string } => ({
  id, title, type: 'PACKAGING EVOLUTION', kind: 'image', hideMeta: true,
  src: asset(file), preview: asset(preview ?? file),
});
export const packagingUnits = [
  {
    id: 'playful', title: '蜀锦趣伴 · 初版',
    packaging: [
      image('evolution-v2-front', '蜀锦趣伴 · 初版 · 正面设计稿', 'evolution/v2-front.png', 'evolution/v2-front-preview.webp'),
      image('evolution-v2-back', '蜀锦趣伴 · 初版 · 背面设计稿', 'evolution/v2-back.png', 'evolution/v2-back-preview.webp'),
      image('evolution-v2-left', '蜀锦趣伴 · 初版 · 左侧设计稿', 'evolution/v2-left.png', 'evolution/v2-left-preview.webp'),
      image('evolution-v2-right', '蜀锦趣伴 · 初版 · 右侧设计稿', 'evolution/v2-right.png', 'evolution/v2-right-preview.webp'),
    ],
    products: [
      image('evolution-playful-panda', '熊猫产品形象', 'v2/panda-role.png'),
      image('evolution-playful-monkey', '金丝猴产品形象', 'v2/monkey-role.png'),
      image('evolution-playful-pair', '双角色与礼盒组合', 'evolution/playful-giftbox-manual.png'),
      image('evolution-v2-closed', '蜀锦趣伴 · 初版 · 闭合效果', 'v2/closed-cutout.svg'),
      image('evolution-v2-open', '蜀锦趣伴 · 初版 · 开盒效果', 'v2/open.png'),
    ],
  },
  {
    id: 'cultural', title: '蜀锦趣伴 · 终版',
    packaging: [
      image('evolution-v3-front', '蜀锦趣伴 · 终版 · 正面设计稿', 'v3/final-front.png'),
      image('evolution-v3-top', '蜀锦趣伴 · 终版 · 顶面设计稿', 'v3/final-top.png'),
      image('evolution-v3-back', '蜀锦趣伴 · 终版 · 背面设计稿', 'v3/final-back.png'),
      image('evolution-v3-left', '蜀锦趣伴 · 终版 · 左侧设计稿', 'v3/final-left.png'),
      image('evolution-v3-right', '蜀锦趣伴 · 终版 · 右侧设计稿', 'v3/final-right.png'),
    ],
    products: [
      image('evolution-cultural-pair', 'AIGC · 双角色产品组合', 'evolution/cultural-pair.png', 'evolution/cultural-pair-preview.webp'),
      image('evolution-cultural-closeup', 'AIGC · 熊猫产品近景', 'evolution/cultural-closeup.png', 'evolution/cultural-closeup-preview.webp'),
      image('evolution-cultural-open', 'AIGC · 文创礼盒与双角色', 'evolution/cultural-giftbox-pair.png'),
      image('evolution-cultural-interaction', 'AIGC · 人物互动场景', 'evolution/cultural-interaction.png', 'evolution/cultural-interaction-preview.webp'),
      image('evolution-cultural-travel', 'AIGC · 文旅场景宣传', 'evolution/cultural-travel.png', 'evolution/cultural-travel-preview.webp'),
    ],
  },
];
export const packagingReference = image('evolution-reference', '产品原图参考', 'evolution/product-reference.jpeg', 'evolution/product-reference-preview.webp');
export const conceptProduct = image('evolution-concept-product', '夏日花衫大熊猫玩偶', 'evolution/yuanyuan-product-display.png');
export const packagingOutputs = [
  image('evolution-output-closeup', 'AIGC · 产品近景', 'v3-product.jpg'),
  image('evolution-output-lifestyle', 'AIGC · 生活互动场景', 'evolution/aigc-lifestyle.png', 'evolution/aigc-lifestyle-preview.webp'),
  image('evolution-output-gift', 'AIGC · 礼盒宣传', 'evolution/aigc-gift.png', 'evolution/aigc-gift-preview.webp'),
];
// Existing source artwork, registered here only for Product Evolution lightbox access.
export const conceptCharacters = [
  { key: '01', pose: '坐姿', label: '01 / SITTING' },
  { key: '02', pose: '抱竹', label: '02 / BAMBOO' },
  { key: '04', pose: '行走', label: '03 / WALKING' },
  { key: '03', pose: '趴卧', label: '04 / RESTING' },
].map(({ key, pose, label }) => {
  const artwork = (mode: 'sketch' | 'render') => {
    const src = `${import.meta.env.BASE_URL}assets/projects/panda-line-to-life/${key}-${mode}.png`;
    return { id: `evolution-yuanyuan-${key}-${mode}`, title: `元元 · ${pose}${mode === 'sketch' ? '原创线描' : '彩色概念效果图'}`, type: 'PRODUCT EVOLUTION', kind: 'image' as const, src, preview: src, hideMeta: true };
  };
  return { label, sketch: artwork('sketch'), render: artwork('render') };
});
export const packagingEvolutionMedia: MediaItem[] = [
  conceptProduct, ...conceptCharacters.flatMap(item => [item.sketch, item.render]),
  ...packagingUnits.flatMap(unit => [...unit.packaging, ...unit.products]), packagingReference, ...packagingOutputs,
];
