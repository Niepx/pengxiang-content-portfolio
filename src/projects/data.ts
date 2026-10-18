export type MediaItem = {
  id: string;
  title: string;
  type: string;
  kind: 'image' | 'video';
  src?: string;
  poster?: string;
  mirrored?: boolean;
  hideMeta?: boolean;
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
  summary?: string;
  robot?: {
    productCapabilities: { number: string; title: string; chinese: string; description: string; mediaId: string }[];
    roles: { title: string; items: string[] }[];
    contentStages: { number: string; title: string; question: string; items: string[]; description: string; mediaId: string }[];
    makerVideos: { number: string; title: string; chinese: string; mediaId: string }[];
    launch: { mediaId: string; context: string[]; roles: string[]; description: string };
    otherVideos: { category: string; title: string; mediaId: string }[];
  };
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

const projectAsset = (name: string) => `${import.meta.env.BASE_URL}assets/projects/${name}`;

// Add real image URLs to `src` and a video URL to the video item's `src`.
// Gallery layouts derive from selectedIds/outputIds, so their counts can change later.
export const projects: PortfolioProject[] = [
  {
    id: 'ai-robot',
    number: '01',
    caseType: 'robot',
    title: 'AI ROBOT',
    company: '四川意外科技有限公司',
    year: '2025.06 — 2025.12',
    period: '2025.06 — 2025.12',
    tags: ['产品内容', '视频', '创客内容', '新品发布'],
    coverIds: ['product', 'launch', 'hero'],
    media: [
      { id: 'product', title: '小喜财 Pro 全息交互展示', type: '产品图', kind: 'image', src: projectAsset('ai-robot-product.jpg'), hideMeta: true },
      { id: 'product-system', title: '小喜财 Pro 四彩产品展示', type: '产品图', kind: 'image', src: projectAsset('ai-robot-system.jpg'), hideMeta: true },
      { id: 'capability-vision', title: '视觉识别', type: '产品能力', kind: 'image', src: projectAsset('ai-robot-capability-vision.jpg'), hideMeta: true },
      { id: 'capability-memory', title: '长期记忆', type: '产品能力', kind: 'image', src: projectAsset('ai-robot-capability-memory.jpg'), hideMeta: true },
      { id: 'capability-motion', title: '动作表达', type: '产品能力', kind: 'image', src: projectAsset('ai-robot-capability-motion.jpg'), hideMeta: true },
      { id: 'capability-customization', title: '自定义', type: '产品能力', kind: 'image', src: projectAsset('ai-robot-capability-customization.jpg'), hideMeta: true },
      { id: 'capability-open-development', title: '开放开发', type: '产品能力', kind: 'image', src: projectAsset('ai-robot-capability-open-development.jpg'), hideMeta: true },
      { id: 'content-product', title: '产品认知', type: '内容体系', kind: 'image', src: projectAsset('ai-robot-content-product.jpg'), hideMeta: true },
      { id: 'content-feature', title: '功能展示', type: '内容体系', kind: 'image', src: projectAsset('ai-robot-content-feature.jpg'), hideMeta: true },
      { id: 'content-how-to', title: '使用教程', type: '内容体系', kind: 'image', src: projectAsset('ai-robot-content-how-to.jpg'), hideMeta: true },
      { id: 'content-maker', title: '创客开发', type: '内容体系', kind: 'image', src: projectAsset('ai-robot-content-maker.jpg'), hideMeta: true },
      { id: 'content-launch', title: '新品传播', type: '内容体系', kind: 'image', src: projectAsset('ai-robot-content-launch.jpg'), hideMeta: true },
      { id: 'launch', title: '新品发布 · 现场与场景', type: '发布会', kind: 'image' },
      { id: 'hero', title: '小喜财Pro', type: '主视觉', kind: 'image', src: projectAsset('ai-robot-hero.png'), mirrored: true, hideMeta: true },
      { id: 'video', title: '产品宣传视频', type: '视频', kind: 'video' },
      { id: 'feature', title: '功能长图', type: '产品内容', kind: 'image' },
      { id: 'commerce', title: '电商与众筹物料', type: '电商物料', kind: 'image' },
      { id: 'social', title: '多平台社媒内容', type: '社媒内容', kind: 'image' },
      { id: 'ppt', title: '演示 PPT', type: '商务展示', kind: 'image' },
      { id: 'leaflet', title: '宣传折页', type: '平面物料', kind: 'image' },
      { id: 'feature-video', title: '产品功能展示', type: 'FEATURE', kind: 'video' },
      { id: 'how-to-video', title: '激活教程 / 配网和终端配置', type: 'HOW TO', kind: 'video', src: projectAsset('ai-robot-other-how-to.mp4') },
      { id: 'maker-design', title: '机器人的外观设计', type: 'MAKER', kind: 'video', src: projectAsset('ai-robot-maker-design.mp4'), poster: projectAsset('ai-robot-maker-design-cover.jpg') },
      { id: 'maker-print', title: '怎么 3D 打印机器人', type: 'MAKER', kind: 'video', src: projectAsset('ai-robot-maker-3d-print.mp4'), poster: projectAsset('ai-robot-maker-3d-print-cover.jpg') },
      { id: 'maker-chip', title: '主板与芯片的了解', type: 'MAKER', kind: 'video', src: projectAsset('ai-robot-maker-chip-board.mp4'), poster: projectAsset('ai-robot-maker-chip-board-cover.jpg') },
      { id: 'maker-assembly', title: '小喜财机器人组装', type: 'MAKER', kind: 'video', src: projectAsset('ai-robot-maker-assembly.mp4'), poster: projectAsset('ai-robot-maker-assembly-cover.jpg') },
      { id: 'maker-code', title: '代码与烧录过程', type: 'MAKER', kind: 'video', src: projectAsset('ai-robot-maker-code-flash.mp4'), poster: projectAsset('ai-robot-maker-code-flash-cover.jpg') },
      { id: 'launch-film', title: '小喜财 Pro 新品宣传片', type: 'PRODUCT LAUNCH', kind: 'video' },
      { id: 'family-video', title: '小喜财家族机器人功能介绍', type: 'FEATURE', kind: 'video', src: projectAsset('ai-robot-other-family.mp4') },
      { id: 'open-source-video', title: '小喜财开源版功能介绍', type: 'OPEN SOURCE', kind: 'video', src: projectAsset('ai-robot-other-open-source.mp4') },
      { id: 'cctv-video', title: '小喜财上央视相关内容', type: 'BRAND CONTENT', kind: 'video' },
      { id: 'review-video', title: '产品功能展示 / 测评', type: 'FEATURE', kind: 'video' },
      { id: 'crowdfunding-video', title: '众筹新品素材', type: 'CROWDFUNDING', kind: 'video', src: projectAsset('ai-robot-other-crowdfunding.mp4') },
    ],
    selectedIds: ['hero', 'product', 'launch', 'video', 'feature', 'commerce', 'social'],
    outputIds: ['video', 'launch', 'feature', 'ppt', 'leaflet', 'product'],
    overview: '围绕小喜财 Pro 进行产品内容策划与制作，从功能展示、用户教程到创客内容和新品传播，逐步探索一套更完整的产品内容表达。',
    summary: '从产品功能展示，到教程、创客内容与新品传播，围绕一款 AI 机器人逐步建立持续的内容表达。',
    robot: {
      productCapabilities: [
        { number: '01', title: 'VISION', chinese: '视觉识别', description: '具备摄像头和视觉识别能力，相比大量仅依赖语音交互的陪伴产品，拥有更多视觉交互空间。', mediaId: 'capability-vision' },
        { number: '02', title: 'MEMORY', chinese: '长期记忆', description: '具备持续记忆能力，让机器人不只是单次问答。', mediaId: 'capability-memory' },
        { number: '03', title: 'MOTION', chinese: '动作表达', description: '多个舵机与电机，可以通过点头、摇头、耳朵等动作表达状态和情绪。', mediaId: 'capability-motion' },
        { number: '04', title: 'CUSTOMIZATION', chinese: '自定义', description: '支持表情和部分功能自定义，用户可以根据自己的需求进行扩展。', mediaId: 'capability-customization' },
        { number: '05', title: 'OPEN DEVELOPMENT', chinese: '开放开发', description: '支持 SDK、开源代码以及进一步的硬件开发，具备创客与编程教育延展空间。', mediaId: 'capability-open-development' },
      ],
      roles: [
        { title: 'CONTENT', items: ['产品卖点梳理', '内容方向', '系列选题', '转化 SOP'] },
        { title: 'VIDEO', items: ['脚本', '分镜', '拍摄', '剪辑', '发布'] },
        { title: 'EDUCATION', items: ['产品教程', '创客 DIY', '开发内容', '系列课程内容'] },
        { title: 'VISUAL', items: ['电商物料', '众筹物料', '产品宣传图文', '活动视觉'] },
        { title: 'LIVE SETUP', items: ['直播间搭建', '直播物料', '场景布置', '直播支持'] },
      ],
      contentStages: [
        { number: '01', title: 'PRODUCT', question: '它是什么？', items: ['产品整体介绍', '小喜财家族介绍', '应用场景介绍'], description: '早期内容首先解决产品认知，让用户知道机器人是什么、能做什么。', mediaId: 'content-product' },
        { number: '02', title: 'FEATURE', question: '它能做什么？', items: ['功能展示', '产品测评', '功能测试', '场景演示'], description: '通过更直接的视频展示视觉、记忆、动作等产品能力。', mediaId: 'content-feature' },
        { number: '03', title: 'HOW TO', question: '怎么用？', items: ['设备激活', '配网', '终端配置', '基础使用'], description: '随着产品进入实际使用，内容逐渐从“展示产品”延伸到“帮助用户使用产品”。', mediaId: 'content-how-to' },
        { number: '04', title: 'MAKER', question: '怎么玩 / 怎么开发？', items: ['外观设计', '3D 打印', '主板芯片', '机器人组装', '代码烧录', '功能开发'], description: '围绕产品开放能力，进一步制作面向创客和开发兴趣用户的系列教程。', mediaId: 'content-maker' },
        { number: '05', title: 'LAUNCH', question: '为什么值得关注？', items: ['新品宣传', '路演', '新品发布', '现场展示'], description: '内容进一步进入新品传播和线下展示阶段。', mediaId: 'content-launch' },
      ],
      makerVideos: [
        { number: '01', title: 'ROBOT DESIGN', chinese: '机器人的外观设计', mediaId: 'maker-design' },
        { number: '02', title: '3D PRINT', chinese: '怎么 3D 打印机器人', mediaId: 'maker-print' },
        { number: '03', title: 'CHIP & BOARD', chinese: '主板与芯片的了解', mediaId: 'maker-chip' },
        { number: '04', title: 'ASSEMBLY', chinese: '小喜财机器人组装', mediaId: 'maker-assembly' },
        { number: '05', title: 'CODE & FLASH', chinese: '代码与烧录过程', mediaId: 'maker-code' },
      ],
      launch: {
        mediaId: 'launch-film',
        context: ['重阳节', '成都世纪城', '智慧康养机器人展演', '新品发布 / 路演 / 现场展示'],
        roles: ['内容策划', '路演流程设计', '路演脚本', '新品宣传片策划', '拍摄', '剪辑', '现场展示讲解'],
        description: '围绕新品发布，将机器人的陪伴、提醒、视觉等产品能力放入家庭生活场景，通过人物关系和真实使用场景完成产品表达。',
      },
      otherVideos: [
        { category: 'FEATURE', title: '小喜财家族机器人功能介绍', mediaId: 'family-video' },
        { category: 'OPEN SOURCE', title: '小喜财开源版功能介绍', mediaId: 'open-source-video' },
        { category: 'HOW TO', title: '激活教程 / 配网和终端配置', mediaId: 'how-to-video' },
        { category: 'CROWDFUNDING', title: '众筹新品素材', mediaId: 'crowdfunding-video' },
      ],
    },
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
