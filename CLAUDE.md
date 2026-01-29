# CLAUDE.md - POLAGRAM 项目

## 项目概述
宝丽来风格照片生成器 - Next.js + React + TypeScript + Redux Toolkit + Tailwind CSS

## 开发工作流

### Git 工作树
- 使用 `.worktrees/` 目录进行功能开发隔离
- 已在 `.gitignore` 中配置忽略

### 构建与部署
- `npm run build` - 静态导出到 `dist/` 目录
- 使用 `npx serve@latest dist -l 3000` 本地预览
- **注意:** 移除 Google Fonts 依赖以避免网络问题导致构建失败

## 代码规范

### 组件结构
- 可复用组件放在 `app/components/`
- 子组件按功能分目录（如 `app/components/gallery/`）
- Header 组件统一顶部栏风格

### 状态管理
- Redux slice 按功能拆分（view/image/params/frame/gallery）
- Gallery 使用 localStorage 持久化
- 保存 Gallery 时需包含相框信息（frame 字段）

### 样式规范
- 使用 Tailwind CSS
- 相框颜色使用渐变：`bg-gradient-to-br from-... via-... to-...`
- 彩虹色顺序：蓝 → 绿 → 黄 → 橙 → 红

## 常见问题

### 构建失败
- 检查是否移除了外部字体/资源依赖
- 确保所有组件都有正确的 TypeScript 类型

### 相框不显示
- 检查是否传递了 frame 字段到组件
- GalleryItem 必须包含 frame 字段
