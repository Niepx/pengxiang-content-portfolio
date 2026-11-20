import { optimizedAsset } from '../assetDelivery';
// Editable artwork content; independent of the Lanyard physics.
const assets = `${import.meta.env.BASE_URL}assets/lanyard/`;
export const cardDesign = {
  portrait: optimizedAsset(`${assets}portrait.png`),
  qrImage: `${assets}wechat-qr.jpg`,
  name: 'Joji',
  chineseName: '聂鹏翔',
  profession: '新媒体运营 / 内容制作',
  email: 'Joji679@163.com',
  socialIcons: ['bilibili', 'xiaohongshu', 'douyin'].map(name => `${assets}social/${name}.svg`),
};
