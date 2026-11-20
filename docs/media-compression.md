# 媒体压缩记录

原文件保存在本地 `work/media-originals/`，该目录不会上传。大小按十进制 MB 计算。

视频：H.264 / AAC、最高 1920×1080、30 fps、CRF 24、MP4 faststart。保留完整时长和音轨。

PNG：无损重新编码，已逐像素校验 RGBA 数据完全一致。

| 文件 | 原始 MB | 发布 MB | 减少 |
|---|---:|---:|---:|
| `warmview-ai-core.mp4` | 166.4 | 18.0 | 89.2% |
| `warmview-ai-plush.mp4` | 277.0 | 53.3 | 80.8% |
| `warmview-video-intercom.mp4` | 182.2 | 41.4 | 77.3% |
| `panda-demo.mp4` | 49.3 | 12.1 | 75.5% |
| `waiwai-product-promo.mp4` | 1182.2 | 37.8 | 96.8% |
| `brand-work/commercial-visuals/tour-product.png` | 14.7 | 13.3 | 9.4% |
| `brand-work/commercial-visuals/tour-scenes.png` | 13.5 | 12.3 | 8.8% |
| `brand-work/commercial-visuals/tour-functions.png` | 10.9 | 9.9 | 9.6% |
| `food/chicken-kimchi.mp4` | 63.1 | 27.2 | 56.9% |
| `food/chili-ribs.mp4` | 81.2 | 32.9 | 59.5% |
| `food/sour-spicy-pork.mp4` | 55.3 | 22.0 | 60.3% |
| `core-workflow/ai-box-quick-edit.mp4` | 54.5 | 10.3 | 81.1% |
| `panda-packaging/evolution/v2-back.png` | 41.6 | 22.4 | 46.1% |
| `panda-packaging/evolution/v2-front.png` | 39.7 | 18.6 | 53.2% |

以上 14 个文件合计 2.23 GB → 331.4 MB，减少 85.2%。

检查：9 个视频均保留完整时长与音轨，并通过解码检查；5 张 PNG 通过逐像素一致性检查。

页面检查：桌面与 390px 手机端的三个 Projects；图片/视频弹窗、背景滚动锁定、返回、联系按钮翻牌；247 条项目资源路径均存在。

修复：视频封面遮罩改为观察未裁剪的外层，防止入场动画永久隐藏；嵌套媒体弹窗按 Escape 时只关闭顶层；GitHub Actions 改用与本地一致的 pnpm 冻结锁文件安装。
