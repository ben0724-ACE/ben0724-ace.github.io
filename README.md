# Qi Haoran Personal Homepage

Personal website for showcasing education, research, engineering projects, internships, and awards.

用于展示教育背景、科研经历、工程项目、实习经历与获奖情况的个人主页仓库。

Live site / 在线访问: `https://ben0724-ace.github.io/`

## Overview | 项目简介

This repository contains a single-page personal homepage built for GitHub Pages. The current version focuses on cleaner storytelling, subtle motion, responsive layouts, and lightweight deployment.

本仓库是一个部署在 GitHub Pages 上的单页个人主页。当前版本重点在于更清晰的内容表达、更加克制的动效、更稳定的响应式布局，以及轻量静态部署体验。

## Highlights | 主要特性

- Responsive layout for desktop, tablet, and mobile
- Desktop quick navigation and sticky mobile section chips
- Theme toggle and bilingual content switching
- Hero section with layered background, metric cards, and dual CTA
- Expandable sections for education, research, projects, internships, and awards
- Lazy-loaded non-critical media for better first-screen performance
- Reduced-motion support for accessibility and smoother browsing

- 适配电脑、平板和手机的响应式布局
- 桌面端快速目录导航与移动端粘性章节导航
- 深浅主题切换与中英文双语切换
- 包含背景层次、指标卡片与双 CTA 的首屏设计
- 教育、科研、项目、实习、奖项等内容分区可折叠
- 非首屏媒体延迟加载，优化首屏性能
- 支持 reduced motion，兼顾可访问性与浏览流畅度

## Tech Stack | 技术栈

- `HTML5`
- `CSS3`
- `JavaScript`
- `GSAP`
- `Feather Icons`
- `GitHub Pages`

## Project Structure | 项目结构

```text
.
|-- index.html
|-- README.md
|-- CV.pdf
|-- 简历.pdf
`-- assets
    |-- css
    |   `-- style.css
    |-- js
    |   `-- main.js
    `-- img
```

## Local Development | 本地预览

1. Clone the repository.
2. Open the project with a static server such as Live Server.
3. Preview the page in your browser.

1. 克隆仓库到本地。
2. 使用 Live Server 等静态服务器启动项目。
3. 在浏览器中预览页面效果。

```powershell
git clone https://github.com/ben0724-ACE/ben0724-ace.github.io.git
cd ben0724-ace.github.io
```

## Editing Notes | 自定义说明

- `index.html`: content structure, bilingual copy, section order, and external links
- `assets/css/style.css`: theme, layout, breakpoints, and component styles
- `assets/js/main.js`: interactions, motion behavior, lazy-loading, and navigation logic
- CV switching is controlled by `data-cv-en` and `data-cv-zh`

- `index.html`：页面结构、双语文案、区块顺序与外部链接
- `assets/css/style.css`：主题配色、响应式布局、断点与组件样式
- `assets/js/main.js`：交互逻辑、动效行为、懒加载与导航联动
- 简历链接切换由 `data-cv-en` 与 `data-cv-zh` 控制

## Performance Notes | 性能说明

- Critical hero assets use higher fetch priority
- Heavy GIF media is deferred until it approaches the viewport
- Motion becomes lighter or stops when the system prefers reduced motion
- Background slider pauses when the tab is hidden

- 首屏关键资源使用更高的加载优先级
- 大体积 GIF 会在接近视口时才开始加载
- 当系统偏好减少动效时，页面会自动降低或关闭非必要动画
- 页面失去焦点后，背景轮播会暂停，避免无意义消耗

## Recent Updates | 最近更新

### 2026 Motion and Responsive Polish

- Added hero metric cards for faster self-introduction
- Added sticky mobile/tablet section navigation
- Introduced lighter number and section-reveal animations
- Improved lazy-loading behavior for large GIF media
- Simplified heavy pointer-driven effects to keep interactions smooth
- Refreshed README and repository documentation

### 2026 动效与响应式优化

- 新增首屏指标卡片，提升信息传达效率
- 新增平板与手机端粘性章节导航
- 补充更轻量的数字递增与区块显隐动画
- 优化大体积 GIF 的懒加载体验
- 收敛高频鼠标驱动特效，保持页面顺滑稳定
- 更新仓库说明文档与项目介绍

## Deployment | 部署说明

The site is deployed from the `main` branch to GitHub Pages.

网页由 `main` 分支部署到 GitHub Pages。

Repository / 仓库地址:
`https://github.com/ben0724-ACE/ben0724-ace.github.io`

## Contact | 联系方式

- Email / 邮箱: `haoran.qi0724@gmail.com`
- GitHub: `https://github.com/ben0724-ACE`
