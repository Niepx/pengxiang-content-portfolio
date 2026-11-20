import { optimizedAsset } from '../assetDelivery';
export type FoodCover = { id: string; image: string; title: string };
export type FoodFilm = {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  poster: string | null;
  videoSrc: string | null;
};

const foodAsset = (file: string) => optimizedAsset(`${import.meta.env.BASE_URL}assets/projects/food/${file}`);

// Sixteen distinct supplied 1080×1920 covers; optimized to 540×960 WebP.
export const foodJournalCovers: FoodCover[] = [
  { id: 'chili-ribs', title: '辣皮子排骨', image: foodAsset('chili-ribs.webp') },
  { id: 'sour-spicy-pork', title: '泰式酸辣滑肉', image: foodAsset('sour-spicy-pork.webp') },
  { id: 'beef-soup-rice', title: '牛肉汤饭', image: foodAsset('beef-soup-rice.webp') },
  { id: 'chicken-kimchi', title: '辣炒鸡&泡菜锅', image: foodAsset('chicken-kimchi.webp') },
  { id: 'coconut-curry-chicken', title: '泰式椰香咖喱鸡', image: foodAsset('coconut-curry-chicken.webp') },
  { id: 'chestnut-chicken', title: '板栗炖鸡', image: foodAsset('chestnut-chicken.webp') },
  { id: 'wasabi-duck-feet', title: '青芥鸭爪', image: foodAsset('wasabi-duck-feet.webp') },
  { id: 'sour-spicy-chicken-feet', title: '酸辣浇汁鸡爪', image: foodAsset('sour-spicy-chicken-feet.webp') },
  { id: 'dai-chicken-feet', title: '傣味鬼爪', image: foodAsset('dai-chicken-feet.webp') },
  { id: 'chipotle-bowl', title: 'Chipotle能量碗', image: foodAsset('chipotle-bowl.webp') },
  { id: 'thai-pork-chop', title: '泰式香煎猪扒', image: foodAsset('thai-pork-chop.webp') },
  { id: 'potato-pork-bone-soup', title: '土豆脊骨汤', image: foodAsset('potato-pork-bone-soup.webp') },
  { id: 'wa-chicken-feet', title: '佤味鸡爪', image: foodAsset('wa-chicken-feet.webp') },
  { id: 'pickled-cabbage-pork', title: '酸菜汆白肉', image: foodAsset('pickled-cabbage-pork.webp') },
  { id: 'luosi-potato-noodles', title: '螺蛳土豆粉', image: foodAsset('luosi-potato-noodles.webp') },
  { id: 'thai-basil-rice', title: '泰式打抛饭', image: foodAsset('thai-basil-rice.webp') },
];
export const foodFilms: FoodFilm[] = [
  { id: 'chili-ribs', title: '辣皮子排骨', englishTitle: 'SWEET & SPICY RIBS', description: '新疆辣皮子与排骨的组合，浓郁的甜辣风味，越吃越上头。', poster: foodAsset('chili-ribs.webp'), videoSrc: foodAsset('chili-ribs.mp4') },
  { id: 'sour-spicy-pork', title: '泰式酸辣滑肉', englishTitle: 'THAI CHILI & LEMON PORK', description: '青红小米椒交织出鲜明的辣味，搭配柠檬的清新酸香，酸辣鲜爽，开胃又有层次。', poster: foodAsset('sour-spicy-pork.webp'), videoSrc: foodAsset('sour-spicy-pork.mp4') },
  { id: 'beef-soup-rice', title: '牛肉汤饭', englishTitle: 'YANJI BEEF SOUP & RICE', description: '延吉特色牛肉汤饭，搭配灵魂苏子酱，一口热汤，鲜香又满足。', poster: foodAsset('beef-soup-rice.webp'), videoSrc: foodAsset('beef-soup-rice.mp4') },
  { id: 'chicken-kimchi', title: '辣炒鸡 & 泡菜锅', englishTitle: 'SPICY CHICKEN & KIMCHI STEW', description: '香辣黏糊的辣炒鸡，搭配酸辣暖胃的泡菜锅，一餐两种过瘾的味道。', poster: foodAsset('chicken-kimchi.webp'), videoSrc: foodAsset('chicken-kimchi.mp4') },
];
