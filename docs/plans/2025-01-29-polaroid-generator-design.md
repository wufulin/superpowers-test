# 宝丽来风格照片生成器 - 设计文档

## 1. 项目概述

### 1.1 产品定位
一款在线 Web 应用，让用户能够轻松将普通照片转换为具有复古宝丽来胶片风格的艺术照片。

### 1.2 技术栈
- **框架**: Next.js 16 + React + TypeScript 5
- **状态管理**: Redux Toolkit
- **样式**: Tailwind CSS
- **部署**: Next.js 静态导出 (output: 'export')

### 1.3 核心功能
1. 照片上传（拖拽/点击）
2. 宝丽来风格转换（Canvas 处理）
3. 相框选择（6种风格）
4. 参数调节（复古强度、胶片质感）
5. 历史作品展示（Gallery）
6. 下载生成结果

---

## 2. 应用架构

### 2.1 单页面状态管理

**视图状态 (currentView):**
- `landing` - 首屏展示
- `upload` - 上传界面
- `preview` - 预览与调节
- `processing` - 处理中
- `result` - 结果展示

### 2.2 Redux Store 结构

```typescript
interface AppState {
  // 视图状态
  currentView: 'landing' | 'upload' | 'preview' | 'processing' | 'result';

  // 图片数据
  originalImage: string | null;
  processedImage: string | null;

  // 调节参数
  retroIntensity: number;    // 0-100, default 60
  filmTexture: number;       // 0-100, default 50

  // 相框选择
  selectedFrame: FrameStyle;

  // Gallery 历史
  gallery: GalleryItem[];

  // 处理状态
  isProcessing: boolean;
  error: string | null;
}

type FrameStyle = 'black-marble' | 'spring-flower' | 'neon-party' |
                  'pink-dot' | 'pizza' | 'starry-purple';

interface GalleryItem {
  id: string;
  thumbnail: string;
  fullImage: string;
  createdAt: string;
}
```

### 2.3 文件结构

```
app/
├── page.tsx                    # 主页面
├── layout.tsx                  # 根布局
├── globals.css                 # 全局样式
├── store/
│   ├── index.ts               # Store 配置
│   └── slices/
│       ├── viewSlice.ts
│       ├── imageSlice.ts
│       ├── paramsSlice.ts
│       ├── frameSlice.ts
│       ├── gallerySlice.ts
│       └── processSlice.ts
├── components/
│   ├── LandingView.tsx        # 首屏（含 Gallery）
│   ├── UploadView.tsx
│   ├── PreviewView.tsx        # 含相框选择
│   ├── ProcessingView.tsx
│   ├── ResultView.tsx
│   └── gallery/
│       ├── GallerySection.tsx
│       └── HangingPhoto.tsx
├── lib/
│   ├── canvasProcessor.ts     # Canvas 处理核心
│   └── utils.ts
└── textures/
    ├── film-grain.png
    └── frames/
        ├── black-marble.png
        ├── spring-flower.png
        ├── neon-party.png
        ├── pink-dot.png
        ├── pizza.png
        └── starry-purple.png
```

---

## 3. 视图设计

### 3.1 LandingView（首屏）

**整体风格**: 现代简约，白色背景，参考 Image #2

**布局结构:**
```
┌─────────────────────────────────────────────────┐
│  POLAGRAM      时光拍立得              [设置]   │  ← 顶部导航
├─────────────────────────────────────────────────┤
│                                                 │
│   INTRODUCING POLAGRAM                          │
│                                                 │
│   THE ORIGINAL                                  │
│   IS BACK.          ┌──────────────────┐       │
│   [彩虹条]          │   宝丽来相机      │       │
│                     │     插图          │       │
│   AI驱动的宝丽来...  │                  │       │
│   Transform your... └──────────────────┘       │
│                                                 │
│   [ 开始创作 → ]                                │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│   Your Gallery        您的作品集      [🗑️]     │
│   ─────────────────────────────────────────     │
│        ┌───┐    ┌───┐    ┌───┐    ┌───┐       │
│   ~~~~~│📷 │~~~~│📷 │~~~~│📷 │~~~~│📷 │~~~~   │  ← 悬挂照片
│        └───┘    └───┘    └───┘    └───┘       │
│                                                 │
└─────────────────────────────────────────────────┘
```

**样式细节:**
- 背景: 纯白 #FFFFFF
- 主标题: 深黑 #1A1A1A，粗体
- "IS BACK.": 彩虹渐变色
- 彩虹条: 蓝 #00A8E8 → 绿 #8BC34A → 黄 #FFC107 → 橙 #FF9800 → 红 #F44336
- CTA 按钮: 黑色 #1A1A1A，圆角，白字

### 3.2 Gallery 区域

**悬挂照片效果:**
- 水平细线贯穿区域
- 照片用衣夹（clothespin）夹在绳上
- 每张照片轻微随机旋转（-5° 到 5°）
- 宝丽来白色边框 + 日期标签
- 最多显示 10 张，超出可横向滚动或分页

**交互:**
- 点击照片查看大图
- 垃圾桶图标清空历史
- 空状态提示文字

### 3.3 UploadView

**布局:**
- 居中上传区域
- 支持拖拽和点击
- 文件验证提示（JPG/PNG/WEBP, 最大 10MB）

### 3.4 PreviewView

**布局:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│   Choose Your Frame                             │
│   选择您的相框                                  │
│                                                 │
│   ┌────┐  ┌────┐  ┌────┐                       │
│   │框1 │  │框2 │  │框3 │  ...                  │  ← 相框选择网格
│   └────┘  └────┘  └────┘                       │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│   ┌──────────────────┐   复古强度  [━━━━●━━]   │
│   │                  │   胶片质感  [━━━●━━━]   │
│   │   预览图         │                          │
│   │                  │   [ 生成宝丽来 ]         │
│   └──────────────────┘                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

**相框选项:**
1. 黑色大理石 - 黑色纹理
2. 春日花簇 - 花卉图案
3. 荧光派对 - 彩虹渐变
4. 粉色波点 - 粉色波点
5. 美式披萨 - 披萨图案
6. 星空紫色 - 星空主题

**生成按钮:** 彩虹渐变背景

### 3.5 ProcessingView

- 居中加载动画
- 文字: "正在生成宝丽来风格..."
- 胶片/相机元素装饰

### 3.6 ResultView

- 大图展示生成的宝丽来照片
- 下载按钮（JPG/PNG）
- "再做一张"按钮
- "保存到作品集"提示

---

## 4. Canvas 处理算法

### 4.1 处理流程

```
输入: 原图 Canvas
  ↓
1. 创建宝丽来画布（添加白色边框）
  - 上部: 10px
  - 两侧: 15px
  - 下部: 40px（经典宝丽来比例）
  ↓
2. 色调调整（根据「复古强度」）
  - 降低饱和度 10-30%
  - 增加暖色调（红黄通道增强）
  - 提升阴影黄色调
  - 轻微降低对比度
  ↓
3. 胶片质感（根据「胶片质感」）
  - 叠加噪点纹理（overlay 混合）
  - 轻微高斯模糊 0.5-1px
  - 可选暗角效果
  ↓
4. 相框叠加
  - 将选中相框 PNG 叠加到边框区域
  ↓
输出: 最终宝丽来照片
```

### 4.2 核心函数签名

```typescript
export function processPolaroid(
  sourceCanvas: HTMLCanvasElement,
  params: {
    retroIntensity: number;
    filmTexture: number;
    frameStyle: FrameStyle;
  }
): HTMLCanvasElement;
```

---

## 5. 响应式设计

### 5.1 断点
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### 5.2 适配策略
- **LandingView**: 桌面左右分栏，移动端上下堆叠
- **Gallery**: 桌面横向排列，移动端可横向滚动
- **相框选择**: 桌面 3x2 网格，移动端 2x3 或 2x2
- **PreviewView**: 桌面左右布局，移动端上下布局

---

## 6. 本地存储

### 6.1 Gallery 持久化
- 使用 localStorage 存储生成的历史记录
- 最多保留 20 条记录，超出时移除最旧的
- 存储格式: `polagram-gallery: GalleryItem[]`

### 6.2 缩略图生成
- 生成时同时创建缩略图（最大 300px 宽）
- 原图和缩略图都存储到 localStorage
- 注意 localStorage 5MB 限制，必要时压缩

---

## 7. 动画与交互

### 7.1 视图切换
- 淡入淡出，200ms
- 使用 Tailwind transition-opacity

### 7.2 滑块调节
- 节流 100ms，避免频繁重绘
- 实时预览效果

### 7.3 生成完成
- 宝丽来照片从中心缩放入场
- "拍立得吐出"效果

### 7.4 Gallery 照片
- 悬停时轻微上浮
- 点击时有按压反馈

---

## 8. 依赖清单

```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^2.x",
    ""react-redux": "^9.x",
    "next": "16.x",
    "react": "^19.x",
    "tailwindcss": "^4.x"
  }
}
```

---

## 9. 后续优化方向（V2.0）

- 更多相框风格
- 自定义相框颜色
- 批量处理功能
- PWA 离线支持
- 社交分享

---

*设计文档完成于 2025-01-29*
