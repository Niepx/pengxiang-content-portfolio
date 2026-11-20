import { optimizedAsset } from '../assetDelivery';
export type BrandImage = { id: string; image: string; fullImage: string; text: string; isLong?: boolean; alt?: string; description?: string };
export type BrandCollection = { id: string; title: string; category: string; previews: BrandImage[]; images: BrandImage[]; description?: string; pending?: boolean };
const asset = (path: string) => optimizedAsset(`${import.meta.env.BASE_URL}assets/projects/brand-work/${path}`);
export const brandCollections: BrandCollection[] = [
  {
    "id": "corporate-brochure",
    "title": "公司宣传手册",
    "category": "CORPORATE BROCHURE",
    "images": [
      {
        "id": "brochure-01-right",
        "image": "corporate-brochure/brochure-01-right-preview.jpg",
        "fullImage": "corporate-brochure/brochure-01-right.png",
        "text": "公司宣传手册 · 封面",
        "alt": "公司宣传手册 · 封面",
        "isLong": false
      },
      {
        "id": "brochure-02-left",
        "image": "corporate-brochure/brochure-02-left-preview.jpg",
        "fullImage": "corporate-brochure/brochure-02-left.png",
        "text": "公司宣传手册 · 企业介绍",
        "alt": "公司宣传手册 · 企业介绍",
        "isLong": false
      },
      {
        "id": "brochure-02-right",
        "image": "corporate-brochure/brochure-02-right-preview.jpg",
        "fullImage": "corporate-brochure/brochure-02-right.png",
        "text": "公司宣传手册 · 核心能力与业务体系",
        "alt": "公司宣传手册 · 核心能力与业务体系",
        "isLong": false
      },
      {
        "id": "brochure-03-left",
        "image": "corporate-brochure/brochure-03-left-preview.jpg",
        "fullImage": "corporate-brochure/brochure-03-left.png",
        "text": "公司宣传手册 · 服务对象",
        "alt": "公司宣传手册 · 服务对象",
        "isLong": false
      },
      {
        "id": "brochure-03-right",
        "image": "corporate-brochure/brochure-03-right-preview.jpg",
        "fullImage": "corporate-brochure/brochure-03-right.png",
        "text": "公司宣传手册 · 智能终端选型",
        "alt": "公司宣传手册 · 智能终端选型",
        "isLong": false
      },
      {
        "id": "brochure-04-left",
        "image": "corporate-brochure/brochure-04-left-preview.jpg",
        "fullImage": "corporate-brochure/brochure-04-left.png",
        "text": "公司宣传手册 · 产品矩阵",
        "alt": "公司宣传手册 · 产品矩阵",
        "isLong": false
      },
      {
        "id": "brochure-04-right",
        "image": "corporate-brochure/brochure-04-right-preview.jpg",
        "fullImage": "corporate-brochure/brochure-04-right.png",
        "text": "公司宣传手册 · AI 导游机产品编排",
        "alt": "公司宣传手册 · AI 导游机产品编排",
        "isLong": false
      }
    ],
    "previews": [
      {
        "id": "brochure-01-right",
        "image": "corporate-brochure/brochure-01-right-preview.jpg",
        "fullImage": "corporate-brochure/brochure-01-right.png",
        "text": "公司宣传手册 · 封面",
        "alt": "公司宣传手册 · 封面",
        "isLong": false
      },
      {
        "id": "brochure-04-left",
        "image": "corporate-brochure/brochure-04-left-preview.jpg",
        "fullImage": "corporate-brochure/brochure-04-left.png",
        "text": "公司宣传手册 · 产品矩阵",
        "alt": "公司宣传手册 · 产品矩阵",
        "isLong": false
      }
    ]
  },
  {
    "id": "environmental-graphics",
    "title": "企业文化墙",
    "category": "ENVIRONMENTAL GRAPHICS",
    "images": [
      {
        "id": "wall-design-01",
        "image": "environmental-graphics/wall-design-01-preview.jpg",
        "fullImage": "environmental-graphics/wall-design-01.png",
        "text": "企业文化墙 · 产品展示墙 · 方案效果",
        "alt": "企业文化墙 · 产品展示墙 · 方案效果",
        "isLong": false,
        "description": "文化墙设计方案 / 非现场实拍"
      },
      {
        "id": "wall-design-02",
        "image": "environmental-graphics/wall-design-02-preview.jpg",
        "fullImage": "environmental-graphics/wall-design-02.png",
        "text": "企业文化墙 · 业务体系墙 · 方案效果",
        "alt": "企业文化墙 · 业务体系墙 · 方案效果",
        "isLong": false,
        "description": "文化墙设计方案 / 非现场实拍"
      },
      {
        "id": "wall-layout-01",
        "image": "environmental-graphics/wall-layout-01-preview.jpg",
        "fullImage": "environmental-graphics/wall-layout-01.png",
        "text": "企业文化墙 · 业务方向版式",
        "alt": "企业文化墙 · 业务方向版式",
        "isLong": false,
        "description": "文化墙设计方案 / 非现场实拍"
      },
      {
        "id": "wall-layout-02",
        "image": "environmental-graphics/wall-layout-02-preview.jpg",
        "fullImage": "environmental-graphics/wall-layout-02.png",
        "text": "企业文化墙 · 产品样板版式",
        "alt": "企业文化墙 · 产品样板版式",
        "isLong": false,
        "description": "文化墙设计方案 / 非现场实拍"
      },
      {
        "id": "wall-layout-03",
        "image": "environmental-graphics/wall-layout-03-preview.jpg",
        "fullImage": "environmental-graphics/wall-layout-03.png",
        "text": "企业文化墙 · 智能体主题版式",
        "alt": "企业文化墙 · 智能体主题版式",
        "isLong": false,
        "description": "文化墙设计方案 / 非现场实拍"
      },
      {
        "id": "wall-layout-04",
        "image": "environmental-graphics/wall-layout-04-preview.jpg",
        "fullImage": "environmental-graphics/wall-layout-04.png",
        "text": "企业文化墙 · 能力图形版式",
        "alt": "企业文化墙 · 能力图形版式",
        "isLong": false,
        "description": "文化墙设计方案 / 非现场实拍"
      }
    ],
    "previews": [
      {
        "id": "wall-design-01",
        "image": "environmental-graphics/wall-design-01-preview.jpg",
        "fullImage": "environmental-graphics/wall-design-01.png",
        "text": "企业文化墙 · 产品展示墙 · 方案效果",
        "alt": "企业文化墙 · 产品展示墙 · 方案效果",
        "isLong": false,
        "description": "文化墙设计方案 / 非现场实拍"
      },
      {
        "id": "wall-design-02",
        "image": "environmental-graphics/wall-design-02-preview.jpg",
        "fullImage": "environmental-graphics/wall-design-02.png",
        "text": "企业文化墙 · 业务体系墙 · 方案效果",
        "alt": "企业文化墙 · 业务体系墙 · 方案效果",
        "isLong": false,
        "description": "文化墙设计方案 / 非现场实拍"
      },
      {
        "id": "wall-layout-04",
        "image": "environmental-graphics/wall-layout-04-preview.jpg",
        "fullImage": "environmental-graphics/wall-layout-04.png",
        "text": "企业文化墙 · 能力图形版式",
        "alt": "企业文化墙 · 能力图形版式",
        "isLong": false,
        "description": "文化墙设计方案 / 非现场实拍"
      }
    ],
    "description": "已完成的墙面设计与版式效果，非现场实拍。"
  },
  {
    "id": "ecommerce-visuals",
    "title": "安家兔电商详情页",
    "category": "E-COMMERCE VISUALS",
    "images": [
      {
        "id": "detail-01",
        "image": "anjia/detail-01-preview.jpg",
        "fullImage": "anjia/detail-01.png",
        "text": "安家兔 · 详情页 01",
        "alt": "安家兔 · 详情页 01",
        "isLong": true
      },
      {
        "id": "detail-02",
        "image": "anjia/detail-02-preview.jpg",
        "fullImage": "anjia/detail-02.png",
        "text": "安家兔 · 详情页 02",
        "alt": "安家兔 · 详情页 02",
        "isLong": true
      },
      {
        "id": "detail-03",
        "image": "anjia/detail-03-preview.jpg",
        "fullImage": "anjia/detail-03.png",
        "text": "安家兔 · 详情页 03",
        "alt": "安家兔 · 详情页 03",
        "isLong": true
      },
      {
        "id": "detail-04",
        "image": "anjia/detail-04-preview.jpg",
        "fullImage": "anjia/detail-04.png",
        "text": "安家兔 · 详情页 04",
        "alt": "安家兔 · 详情页 04",
        "isLong": true
      },
      {
        "id": "detail-05",
        "image": "anjia/detail-05-preview.jpg",
        "fullImage": "anjia/detail-05.png",
        "text": "安家兔 · 详情页 05",
        "alt": "安家兔 · 详情页 05",
        "isLong": true
      },
      {
        "id": "detail-06",
        "image": "anjia/detail-06-preview.jpg",
        "fullImage": "anjia/detail-06.png",
        "text": "安家兔 · 详情页 06",
        "alt": "安家兔 · 详情页 06",
        "isLong": true
      },
      {
        "id": "detail-07",
        "image": "anjia/detail-07-preview.jpg",
        "fullImage": "anjia/detail-07.png",
        "text": "安家兔 · 详情页 07",
        "alt": "安家兔 · 详情页 07",
        "isLong": true
      },
      {
        "id": "detail-08",
        "image": "anjia/detail-08-preview.jpg",
        "fullImage": "anjia/detail-08.png",
        "text": "安家兔 · 详情页 08",
        "alt": "安家兔 · 详情页 08",
        "isLong": true
      },
      {
        "id": "detail-09",
        "image": "anjia/detail-09-preview.jpg",
        "fullImage": "anjia/detail-09.png",
        "text": "安家兔 · 详情页 09",
        "alt": "安家兔 · 详情页 09",
        "isLong": true
      },
      {
        "id": "detail-10",
        "image": "anjia/detail-10-preview.jpg",
        "fullImage": "anjia/detail-10.png",
        "text": "安家兔 · 详情页 10",
        "alt": "安家兔 · 详情页 10",
        "isLong": true
      },
      {
        "id": "detail-11",
        "image": "anjia/detail-11-preview.jpg",
        "fullImage": "anjia/detail-11.png",
        "text": "安家兔 · 详情页 11",
        "alt": "安家兔 · 详情页 11",
        "isLong": true
      }
    ],
    "previews": [
      {
        "id": "detail-01",
        "image": "anjia/detail-01-preview.jpg",
        "fullImage": "anjia/detail-01.png",
        "text": "安家兔 · 详情页 01",
        "alt": "安家兔 · 详情页 01",
        "isLong": true
      },
      {
        "id": "detail-04",
        "image": "anjia/detail-04-preview.jpg",
        "fullImage": "anjia/detail-04.png",
        "text": "安家兔 · 详情页 04",
        "alt": "安家兔 · 详情页 04",
        "isLong": true
      },
      {
        "id": "detail-05",
        "image": "anjia/detail-05-preview.jpg",
        "fullImage": "anjia/detail-05.png",
        "text": "安家兔 · 详情页 05",
        "alt": "安家兔 · 详情页 05",
        "isLong": true
      },
      {
        "id": "detail-08",
        "image": "anjia/detail-08-preview.jpg",
        "fullImage": "anjia/detail-08.png",
        "text": "安家兔 · 详情页 08",
        "alt": "安家兔 · 详情页 08",
        "isLong": true
      }
    ]
  },
  {
    "id": "product-visuals",
    "title": "AI 导游机宣传物料",
    "category": "PRODUCT VISUALS",
    "images": [
      {
        "id": "tour-product",
        "image": "commercial-visuals/tour-product-preview.jpg",
        "fullImage": "commercial-visuals/tour-product.png",
        "text": "AI 导游机 · 产品宣传",
        "alt": "AI 导游机 · 产品宣传",
        "isLong": false
      },
      {
        "id": "tour-functions",
        "image": "commercial-visuals/tour-functions-preview.jpg",
        "fullImage": "commercial-visuals/tour-functions.png",
        "text": "AI 导游机 · 功能总览",
        "alt": "AI 导游机 · 功能总览",
        "isLong": false
      },
      {
        "id": "tour-scenes",
        "image": "commercial-visuals/tour-scenes-preview.jpg",
        "fullImage": "commercial-visuals/tour-scenes.png",
        "text": "AI 导游机 · 应用场景",
        "alt": "AI 导游机 · 应用场景",
        "isLong": false
      }
    ],
    "previews": [
      {
        "id": "tour-product",
        "image": "commercial-visuals/tour-product-preview.jpg",
        "fullImage": "commercial-visuals/tour-product.png",
        "text": "AI 导游机 · 产品宣传",
        "alt": "AI 导游机 · 产品宣传",
        "isLong": false
      },
      {
        "id": "tour-scenes",
        "image": "commercial-visuals/tour-scenes-preview.jpg",
        "fullImage": "commercial-visuals/tour-scenes.png",
        "text": "AI 导游机 · 应用场景",
        "alt": "AI 导游机 · 应用场景",
        "isLong": false
      },
      {
        "id": "tour-functions",
        "image": "commercial-visuals/tour-functions-preview.jpg",
        "fullImage": "commercial-visuals/tour-functions.png",
        "text": "AI 导游机 · 功能总览",
        "alt": "AI 导游机 · 功能总览",
        "isLong": false
      }
    ]
  },
  {
    "id": "promotional-design",
    "title": "K 宝产品宣传图",
    "category": "PROMOTIONAL DESIGN",
    "images": [
      {
        "id": "kbao-product",
        "image": "commercial-visuals/kbao-product-preview.jpg",
        "fullImage": "commercial-visuals/kbao-product.jpg",
        "text": "K 宝 · 产品宣传与功能卖点",
        "alt": "K 宝 · 产品宣传与功能卖点",
        "isLong": true
      },
      {
        "id": "kbao-scenes",
        "image": "commercial-visuals/kbao-scenes-preview.jpg",
        "fullImage": "commercial-visuals/kbao-scenes.jpg",
        "text": "K 宝 · 应用场景",
        "alt": "K 宝 · 应用场景",
        "isLong": false
      }
    ],
    "previews": [
      {
        "id": "kbao-product",
        "image": "commercial-visuals/kbao-product-preview.jpg",
        "fullImage": "commercial-visuals/kbao-product.jpg",
        "text": "K 宝 · 产品宣传与功能卖点",
        "alt": "K 宝 · 产品宣传与功能卖点",
        "isLong": true
      },
      {
        "id": "kbao-scenes",
        "image": "commercial-visuals/kbao-scenes-preview.jpg",
        "fullImage": "commercial-visuals/kbao-scenes.jpg",
        "text": "K 宝 · 应用场景",
        "alt": "K 宝 · 应用场景",
        "isLong": false
      }
    ]
  }
];
brandCollections.forEach(group => {
  const normalize = (item: BrandImage) => ({ ...item, image: asset(item.image), fullImage: asset(item.fullImage) });
  group.previews = group.previews.map(normalize);
  group.images = group.images.map(normalize);
});
export const brandColumnGroupIds = ['corporate-brochure', 'environmental-graphics', 'ecommerce-visuals', 'product-visuals', 'promotional-design'];
export const brandColumns = brandColumnGroupIds.map((id, column) => {
  const group = brandCollections.find(group => group.id === id)!;
  // Equal loop lengths prevent short columns disappearing in the original shared 3D plane.
  return Array.from({ length: 9 }, (_, index) => {
    const item = group.previews[(index + column) % group.previews.length];
    return { ...item, imageId: item.id, groupId: group.id, title: group.title };
  });
});
