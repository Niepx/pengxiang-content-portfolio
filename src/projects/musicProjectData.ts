export type MusicPost = {
  id: string;
  mediaId: string;
  category: string;
  title: string;
  originalTitle: string;
  published: string;
  description: string;
  metrics: Record<'views' | 'likes' | 'coins' | 'saves' | 'shares' | 'followersGained', string | null>;
  cover: string | null;
  videoUrl: string | null;
  scenarios?: string[];
};

// User-provided account screenshot values; intentionally static, not a live API.
export const musicAccount = {
  name: '失眠树洞Music',
  url: 'https://space.bilibili.com/7196146',
  metrics: [
    ['2.7万', 'FOLLOWERS', '粉丝'],
    ['474.6万', 'TOTAL VIEWS', '累计播放'],
    ['12.3万', 'TOTAL LIKES', '累计获赞'],
    ['235', 'VIDEO POSTS', '视频投稿'],
  ],
};

export const musicSeries = [
  ['CANTONESE COLLECTION', '洞的宝藏粤语', '从经典到冷门，发现值得反复聆听的粤语好歌。'],
  ['CHILL PLAYLIST', 'Chill Playlist', '不局限于特定曲风，收集轻松舒缓的音乐，陪伴通勤、学习、工作与放松的日常时刻。'],
  ['INFJ PLAYLIST', 'INFJ Playlist', '以细腻的情绪与内心感受为线索，分享适合独处、夜晚及安静聆听的音乐。'],
];

// Supply original covers and confirmed video URLs here; never infer a BV number.
export const musicPosts: MusicPost[] = [
  {
    id: '01', mediaId: 'post-1', category: 'BEST PERFORMANCE', title: '中文 R&B 歌单',
    originalTitle: '【R&B Playlist】宝藏中文R&B 歌单拾荒者 | 老是逞强 幸福也会溜走',
    published: '2024.07.16',
    description: '账号目前数据表现最突出的作品，在播放量与收藏量上获得了较好的反馈，成为持续歌单创作过程中的代表性成果。',
    metrics: { views: '107.8万', likes: '约3万', coins: '约1.6万', saves: '约9.2万', shares: '398', followersGained: '1,054' },
    cover: `${import.meta.env.BASE_URL}assets/projects/bilibili-music/rnb-playlist.png`, videoUrl: 'https://www.bilibili.com/video/BV1px4y1x7Qj/',
  },
  {
    id: '02', mediaId: 'post-2', category: 'EARLY EXPLORATION', title: '静谧冬夜 & INFJ',
    originalTitle: '【Night Playlist】静谧冬夜&INFJ：万物与我都是荒诞的静寂',
    published: '2023.12.13',
    description: 'Night Playlist 系列初期探索中的代表作品。围绕安静、抒情的聆听氛围进行选曲与编排，并从发布后的用户反馈中进一步认识这一内容方向。',
    metrics: { views: '16.6万', likes: '6,500', coins: '1,606', saves: '9,642', shares: '453', followersGained: '1,724' },
    cover: `${import.meta.env.BASE_URL}assets/projects/bilibili-music/night-infj.png`, videoUrl: 'https://www.bilibili.com/video/BV1494y1N7Wg/',
  },
  {
    id: '03', mediaId: 'post-3', category: 'DIRECTION VALIDATION', title: '宝藏粤语歌单',
    originalTitle: '宝藏粤语 别要错过｜没有小众的音乐 只有迟到的听众',
    published: '2023.10.06',
    description: '这条作品获得的真实反馈，让我进一步明确了长期更新粤语音乐的方向，也成为后续持续整理与分享粤语歌曲的重要参考。',
    metrics: { views: '7.5万', likes: '7,146', coins: '807', saves: '4,909', shares: '265', followersGained: '2,586' },
    cover: `${import.meta.env.BASE_URL}assets/projects/bilibili-music/cantonese-playlist.png`, videoUrl: 'https://www.bilibili.com/video/BV1HN4y1o7yT/',
  },
];

export const listeningScenarios = [
  ['学习', 'STUDY'], ['工作', 'WORK'], ['放松', 'RELAX'],
  ['通勤', 'COMMUTE'], ['夜晚', 'NIGHT'], ['独处', 'ALONE'],
];

export const musicProcess = [
  ['CURATION', '选题与歌曲筛选', '根据音乐风格、情绪和生活场景寻找适合的歌曲。'],
  ['SEQUENCING', '歌单排序与曲目衔接', '关注曲目之间的自然衔接，调整整份歌单的情绪与节奏。'],
  ['PRESENTATION', '主题画面与文字排版', '根据歌单主题完成必要的视觉呈现，使画面服务于音乐内容。'],
  ['ITERATION', '发布反馈与持续调整', '结合实际制作体验和听众反馈，不断调整内容表达与更新方式。'],
];

// Missing per-post values remain null; account totals must never be apportioned.
export const musicPostMetrics = [
  ['views', '播放量', 'VIEWS'],
  ['likes', '点赞', 'LIKES'],
  ['coins', '投币', 'COINS'],
  ['saves', '收藏', 'SAVES'],
  ['shares', '转发', 'SHARES'],
  ['followersGained', '涨粉', 'FOLLOWERS GAINED'],
] as const;
