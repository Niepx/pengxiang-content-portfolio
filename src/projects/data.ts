export type MediaItem = {
  id: string;
  title: string;
  type: string;
  kind: 'image' | 'video';
  src?: string;
  poster?: string;
};

export type PortfolioProject = {
  id: string;
  number: string;
  caseType: 'robot' | 'hardware' | 'personal';
  label?: string;
  title: string;
  company: string;
  year: string;
  period: string;
  tags: string[];
  coverIds: string[];
  media: MediaItem[];
  selectedIds: string[];
  outputIds: string[];
  overview: string;
  highlight?: {
    title: string;
    subtitle: string;
    background: string;
    idea: string[];
    keywords: string[];
    mediaId: string;
  };
  smart?: {
    capabilities: [string, string][];
    matrix: { id: string; name: string; chinese: string; user: string; scenario: string; content: string; mediaId: string }[];
    flow: { name: string; subtitle: string; items: string[] }[];
    translations: { tech: string; content: string }[];
    aigcSteps: { name: string; detail: string }[];
    aigcCases: { id: string; before: string; after: string; beforeSrc?: string; afterSrc?: string }[];
  };
  personal?: {
    capabilities: [string, string][];
    music: [string, string][];
    posts: { id: string; mediaId: string; title: string; type: string; description: string }[];
    food: [string, string][];
    diaryIds: string[];
    practice: [string, string][];
  };
};

// Add real image URLs to `src` and a video URL to the video item's `src`.
// Gallery layouts derive from selectedIds/outputIds, so their counts can change later.
export const projects: PortfolioProject[] = [
  {
    id: 'ai-robot',
    number: '01',
    caseType: 'robot',
    title: 'AI ROBOT',
    company: '四川意外科技有限公司',
    year: '2025',
    period: '2025.06 — 2025.12',
    tags: ['产品内容', '短视频', '新品发布', '多平台运营'],
    coverIds: ['product', 'launch', 'hero'],
    media: [
      { id: 'product', title: 'AI 桌面机器人 · 产品主视觉', type: '产品图', kind: 'image' },
      { id: 'launch', title: '新品发布 · 现场与场景', type: '发布会', kind: 'image' },
      { id: 'hero', title: 'AI ROBOT · 项目主视觉', type: '主视觉', kind: 'image' },
      { id: 'video', title: '产品宣传视频', type: '视频', kind: 'video' },
      { id: 'feature', title: '功能长图', type: '产品内容', kind: 'image' },
      { id: 'commerce', title: '电商与众筹物料', type: '电商物料', kind: 'image' },
      { id: 'social', title: '多平台社媒内容', type: '社媒内容', kind: 'image' },
      { id: 'ppt', title: '演示 PPT', type: '商务展示', kind: 'image' },
      { id: 'leaflet', title: '宣传折页', type: '平面物料', kind: 'image' },
    ],
    selectedIds: ['hero', 'product', 'launch', 'video', 'feature', 'commerce', 'social'],
    outputIds: ['video', 'launch', 'feature', 'ppt', 'leaflet', 'product'],
    overview: '围绕 AI 桌面机器人进行产品内容、新媒体传播及新品发布相关内容制作，参与从产品信息梳理、内容策划到视频、视觉和平台发布的完整执行流程。',
    highlight: {
      title: 'XIAOXICAI PRO',
      subtitle: '一款有记忆的跨代机器人',
      background: '参与“小喜财 Pro”在智慧康养机器人展演中的新品发布内容策划与执行。',
      idea: ['不要先讲技术，', '从长者日常场景出发。'],
      keywords: ['情感陪伴', '用药提醒', '购物协助', '健康管理'],
      mediaId: 'product',
    },
  },
  {
    id: 'ai-smart-hardware',
    number: '02',
    caseType: 'hardware',
    title: 'AI SMART HARDWARE',
    company: '四川旭创启元科技有限公司',
    year: '2025 — 2026',
    period: '2025.12 — 2026',
    tags: ['产品内容', 'AIGC', '视觉物料', '短视频', '多平台运营'],
    coverIds: ['toy', 'gps', 'hero'],
    media: [
      { id: 'toy', title: 'AI 智能玩具 / AI 陪伴产品', type: '产品方向', kind: 'image' },
      { id: 'gps', title: '儿童定位产品 / 电商视觉', type: '智能硬件', kind: 'image' },
      { id: 'hero', title: 'AI 智能硬件 · 产品主视觉', type: '主视觉', kind: 'image' },
      { id: 'companion', title: 'AI 陪伴产品内容', type: '产品视觉', kind: 'image' },
      { id: 'agent', title: '行业 AI 智能终端', type: '行业产品', kind: 'image' },
      { id: 'commerce', title: '商品主图与详情页', type: '电商物料', kind: 'image' },
      { id: 'aigc', title: 'AIGC 场景图', type: 'AIGC', kind: 'image' },
      { id: 'video', title: '产品短视频画面', type: '视频', kind: 'video' },
      { id: 'social', title: '公众号与多平台视觉', type: '社媒内容', kind: 'image' },
      { id: 'presentation', title: '宣传与商务展示物料', type: '展示物料', kind: 'image' },
    ],
    selectedIds: ['hero', 'toy', 'gps', 'aigc', 'commerce', 'video', 'social', 'presentation'],
    outputIds: [],
    overview: '围绕 AI 陪伴产品、AI 智能玩具、定位类智能硬件及行业智能终端，参与产品内容策划、视觉物料、AIGC 内容、短视频及多平台传播工作。面对不同产品、用户和使用场景，进行差异化的内容表达。',
    smart: {
      capabilities: [
        ['CONTENT', '产品卖点梳理 / 场景表达 / 文案'],
        ['VISUAL', '产品图 / 电商物料 / 宣传视觉'],
        ['AIGC', '产品场景图 / 宣传素材 / 视频素材'],
        ['VIDEO', '选题 / 拍摄 / 分镜 / 剪辑'],
      ],
      matrix: [
        { id: 'toy', name: 'AI TOY', chinese: 'AI 智能玩具', user: '儿童 / 家庭', scenario: '日常陪伴 / 互动', content: '互动体验 / 情绪表达 / 产品视觉', mediaId: 'toy' },
        { id: 'companion', name: 'AI COMPANION', chinese: 'AI 陪伴产品', user: '陪伴需求用户', scenario: '日常互动 / 情绪陪伴', content: '使用场景 / 产品视觉 / 短视频', mediaId: 'companion' },
        { id: 'gps', name: 'GPS DEVICE', chinese: '儿童 / 家庭定位智能硬件', user: '儿童 / 家庭', scenario: '定位 / 安全守护', content: '功能说明 / 电商视觉 / 社媒内容', mediaId: 'gps' },
        { id: 'agent', name: 'AI AGENT', chinese: '企业 / 行业 AI 智能终端', user: '企业 / 行业用户', scenario: '业务场景 / 智能终端', content: '功能呈现 / 商务展示', mediaId: 'agent' },
      ],
      flow: [
        { name: 'FUNCTION', subtitle: '产品功能', items: ['GPS', 'WiFi', 'LBS', 'SOS', '700mAh'] },
        { name: 'USER NEED', subtitle: '用户需求', items: ['位置掌握', '安全守护', '紧急联系', '续航'] },
        { name: 'MESSAGE', subtitle: '内容卖点', items: ['多重定位', '一键求助', '更持久使用', '家庭守护'] },
        { name: 'CONTENT', subtitle: '最终内容', items: ['商品主图', '详情页', '短视频', '社媒内容'] },
      ],
      translations: [
        { tech: 'GPS / WiFi / LBS', content: '多重定位' },
        { tech: 'SOS', content: '一键求助' },
        { tech: '700mAh', content: '更持久的日常使用' },
      ],
      aigcSteps: [
        { name: 'ORIGINAL', detail: '原始产品 / 基础素材' },
        { name: 'GENERATE', detail: '场景生成 / 构图探索' },
        { name: 'REFINE', detail: '后期处理 / 排版 / 细节调整' },
        { name: 'OUTPUT', detail: '产品图 / 社媒视觉 / 视频素材' },
      ],
      aigcCases: [
        { id: '01', before: '原始产品 / 基础素材', after: '场景生成 / 宣传视觉' },
        { id: '02', before: '原始构图 / 基础画面', after: '视觉排版 / 细节完善' },
        { id: '03', before: '产品功能 / 视频素材', after: '社媒视觉 / 视频输出' },
      ],
    },
  },
  {
    id: 'personal-media',
    number: '03',
    caseType: 'personal',
    label: 'PERSONAL PROJECT',
    title: 'PERSONAL MEDIA',
    company: '',
    year: '2023 — NOW',
    period: '2023 — NOW',
    tags: ['Bilibili', '音乐内容', '个人创作', '美食自媒体'],
    coverIds: ['music', 'cover', 'hero'],
    media: [
      { id: 'music', title: 'Bilibili 音乐号 · 代表内容', type: '音乐内容', kind: 'image' },
      { id: 'cover', title: '个人创作 · 封面与视频内容', type: '内容封面', kind: 'image' },
      { id: 'hero', title: '个人内容 · 项目主视觉', type: '个人创作', kind: 'image' },
      { id: 'post-1', title: '代表内容 01 · 选曲方向', type: 'Bilibili 音乐', kind: 'image' },
      { id: 'post-2', title: '代表内容 02 · 情绪表达', type: 'Bilibili 音乐', kind: 'image' },
      { id: 'post-3', title: '代表内容 03 · 视觉包装', type: 'Bilibili 音乐', kind: 'image' },
      { id: 'food-1', title: '美食创作 · 菜品研发', type: '研发记录', kind: 'image' },
      { id: 'food-2', title: '美食创作 · 桌面拍摄', type: '拍摄现场', kind: 'image' },
      { id: 'food-3', title: '美食创作 · 画面风格', type: '视觉探索', kind: 'image' },
      { id: 'food-video', title: '美食创作 · 短视频画面', type: '视频帧', kind: 'video' },
    ],
    selectedIds: ['post-1', 'post-2', 'post-3'],
    outputIds: [],
    overview: '工作之外，我也持续进行个人内容创作。目前主要包括长期运营的 Bilibili 音乐内容，以及正在尝试的抖音 / 小红书美食内容。不同题材的创作让我持续接触选题、画面表达、内容包装和平台内容逻辑。',
    personal: {
      capabilities: [
        ['IDEA', '选题 / 内容方向'],
        ['VISUAL', '封面 / 画面 / 内容包装'],
        ['VIDEO', '剪辑 / 内容节奏'],
        ['OPERATION', '发布 / 用户反馈 / 内容调整'],
      ],
      music: [
        ['POSITIONING', '内容定位 / 情绪价值 / 风格'],
        ['CONTENT', '选曲 / 视觉包装 / 标题文案'],
        ['OPERATION', '发布 / 用户反馈 / 内容迭代'],
      ],
      posts: [
        { id: '01', mediaId: 'post-1', title: '代表内容 01', type: '音乐内容', description: '选曲方向 / 情绪表达 / 视觉包装' },
        { id: '02', mediaId: 'post-2', title: '代表内容 02', type: '内容封面', description: '内容定位 / 标题文案 / 视觉包装' },
        { id: '03', mediaId: 'post-3', title: '代表内容 03', type: '个人创作', description: '选曲 / 内容节奏 / 用户反馈' },
      ],
      food: [
        ['RESEARCH', '菜品研发'],
        ['SHOOTING', '桌面拍摄 / 食物画面'],
        ['VISUAL', '画面风格 / 色彩'],
        ['CONTENT', '短视频 / 平台内容'],
      ],
      diaryIds: ['food-1', 'food-2', 'food-3', 'food-video'],
      practice: [
        ['Bilibili', '音乐'],
        ['Douyin', '美食短视频'],
        ['Xiaohongshu', '图文 / 视频'],
        ['AI Tools', '内容创作辅助'],
      ],
    },
  },
];
