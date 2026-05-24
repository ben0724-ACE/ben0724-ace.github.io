# Qi Haoran Personal Page

## Project Introduction
This is a modern personal homepage project showcasing my education background, research experience, project experience, and skills. The webpage features a responsive design, supports dark/light theme switching, and offers smooth animations for an excellent user experience.

## Features

### 🎨 Visual Design
- **Responsive Layout**: Adapts to desktop, tablet, and mobile devices
- **Theme Switching**: Supports dark/light themes, automatically follows system preferences
- **Modern UI**: Adopts a card-based design, concise and aesthetic
- **Animation Effects**: Uses GSAP for smooth scroll animations and interactive effects
- **Font Optimization**: Global font size adjustment to improve content readability and visual appeal
- **Color Palette Refinement**: Adjusted text colors for better readability and visual harmony in both light and dark modes.
- **Header Background Image**: Added a dynamic background image to the header section for enhanced visual appeal.

### 🧭 Navigation
- **Fixed Navigation Bar**: Top fixed navigation for quick jumps to sections
- **Smooth Scrolling**: Clicking navigation items scrolls smoothly to the corresponding area
- **Active State**: The currently viewed section is highlighted in the navigation
- **Quick Index Navigation**: Added a fixed left-side navigation for quick access to main content sections, with active state highlighting.

### 📱 Interactive Experience
- **Preloader Animation**: Displays a loading animation when the page loads
- **Hover Effects**: Cards subtly lift on hover
- **Custom Cursor**: A custom cursor effect that follows the mouse movement
- **Skill Tags**: Clickable skill tags, supporting categorized display
- **Content Collapse**: Sections can be collapsed/expanded to optimize information presentation and space utilization

### 📄 Content Organization
- **Education Background**: Detailed academic information and core course grades
- **Research & Publications**: Academic papers and research project experiences
- **Engineering Projects**: Competition awards and engineering practical experiences
- **Internship Experience**: Company internships and work experience
- **Honors & Awards**: Various competition and scholarship awards
- **Technical Skills**: Skill tags organized by category

## Technologies Used
- **HTML5**: Semantic tags, good SEO structure
- **CSS3**: Modern CSS features, including Grid, Flexbox, CSS variables
- **JavaScript**: ES6+ syntax, modular programming
- **GSAP**: High-performance animation library
- **Feather Icons**: Lightweight icon library
- **GitHub Pages**: Free static website hosting

## File Structure
```
my-homepage/
├── index.html              # Main page file
├── README.md              # Project documentation
├── CV.pdf                 # Personal CV PDF
├── assets/
│   ├── css/
│   │   └── style.css      # Stylesheet file
│   ├── js/
│   │   └── main.js        # JavaScript functionalities
│   └── img/
│       ├── avatar.jpg     # Avatar image
│       └── favicon.ico    # Website icon
│       └── header-bg.jpg  # Header
```

## Usage

### Local Development
1. Clone the repository locally
2. Run the project using any HTTP server (e.g., Live Server)
3. Access `http://localhost:port_number` in your browser

### Deploy to GitHub Pages
1. Push the code to your GitHub repository
2. Enable GitHub Pages in your repository settings
3. Select the main branch as the source branch
4. Access the generated GitHub Pages URL

## Custom Configuration

### Modify Personal Information
Modify the following content in the `index.html` file:
- Name and contact information
- Avatar image path
- Social media links
- CV PDF file (now `CV.pdf`)

### About / Services
- Edit the `#about` section cards to reflect your focus areas.
- The mini-terminal supports playful demo commands. Click it to cycle: `help → skills → about`.

### Adjust Styles
In the `assets/css/style.css` file:
- Modify CSS variables to adjust theme colors
- Adjust font sizes and spacing
- Customize animation effects
- Hero additions: `.tagline`, `.hero-tags .pill`, `.hero-ctas`, `.btn.secondary`
- Services: `.service-grid`, `.service-card`
- Terminal: `.terminal`, `.terminal-header`, `.terminal-body`
- **Important Note on Asset Paths**: When referencing images, fonts, or other assets in CSS, ensure you use the correct relative paths. For example, if your `style.css` is in `assets/css/` and your image is in `assets/img/`, the path in CSS should be `../img/your-image.jpg` (using `../` to go up one directory).

### Add New Features
In the `assets/js/main.js` file:
- Add new interactive features
- Modify animation parameters
- Extend theme switching logic

## Performance Optimization
- Image compression and optimization
- CSS and JavaScript file compression
- Use CDN to load third-party libraries
- Lazy loading and preloading strategies

## Contribution Guide
Welcome to submit Issues and Pull Requests to improve this project!


## Contact Information
- Email: haoran.qi0724@gmail.com
- GitHub: [@ben0724-ACE](https://github.com/ben0724-ACE)

---

⭐ If this project is helpful to you, please give it a star!

# 祁皓然个人主页

## 项目简介
这是一个现代个人主页项目，展示了我的教育背景、研究经历、项目经验和技能。该网页具有响应式设计，支持深色/浅色主题切换，并提供流畅的动画效果，以提供卓越的用户体验。

## 功能特性

### 🎨 视觉设计
- **响应式布局**: 适应桌面、平板和移动设备
- **主题切换**: 支持深色/浅色主题，自动跟随系统偏好设置
- **现代UI**: 采用卡片式设计，简洁美观
- **动画效果**: 使用GSAP实现平滑滚动动画和交互效果
- **字体优化**: 全局字体大小调整，提升内容可读性和视觉美感
- **调色板优化**: 调整了文本颜色，以在亮色和暗色模式下获得更好的可读性和视觉协调性。
- **页头背景图片**: 在页头部分添加了动态背景图片，增强视觉吸引力。

### 🧭 导航
- **固定导航栏**: 顶部固定导航，快速跳转到各个部分
- **平滑滚动**: 点击导航项可平滑滚动到相应区域
- **激活状态**: 当前查看的区域在导航中高亮显示
- **快速索引导航**: 添加了左侧固定导航，可快速访问主要内容部分，并高亮显示当前激活状态。

### 📱 交互体验
- **预加载动画**: 页面加载时显示加载动画
- **悬停效果**: 卡片在悬停时轻微抬起
- **自定义光标**: 遵循鼠标移动的自定义光标效果
- **技能标签**: 可点击的技能标签，支持分类显示
- **内容折叠**: 部分内容可折叠/展开，优化信息呈现和空间利用

### 📄 内容组织
- **教育背景**: 详细的学历信息和核心课程成绩
- **研究与出版物**: 学术论文和研究项目经验
- **工程项目**: 比赛获奖和工程实践经验
- **实习经验**: 公司实习和工作经验
- **荣誉与奖项**: 各类比赛和奖学金
- **技术技能**: 按类别组织技能标签

## 使用技术
- **HTML5**: 语义化标签，良好的SEO结构
- **CSS3**: 现代CSS特性，包括Grid、Flexbox、CSS变量
- **JavaScript**: ES6+语法，模块化编程
- **GSAP**: 高性能动画库
- **Feather Icons**: 轻量级图标库
- **GitHub Pages**: 免费的静态网站托管服务

## 文件结构
```
my-homepage/
├── index.html              # 主页文件
├── README.md              # 项目文档
├── CV.pdf                 # 个人简历PDF
├── assets/
│   ├── css/
│   │   └── style.css      # 样式表文件
│   ├── js/
│   │   └── main.js        # JavaScript功能文件
│   └── img/
│       ├── avatar.jpg     # 头像图片
│       └── favicon.ico    # 网站图标
│       └── header-bg.jpg  # 页头背景图
```

## 使用方法

### 本地开发
1. 克隆项目到本地
2. 使用任何HTTP服务器（例如：Live Server）运行项目
3. 在浏览器中访问 `http://localhost:port_number`

### 部署到GitHub Pages
1. 将代码推送到您的GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择 `main` 分支作为源分支
4. 访问生成的GitHub Pages URL

## 自定义配置

### 修改个人信息
在 `index.html` 文件中修改以下内容：
- 姓名和联系方式
- 头像图片路径
- 社交媒体链接
- 简历PDF文件（现为 `CV.pdf`）

### 关于我 / 服务
- 编辑 `#about` 版块服务卡片，贴合你的优势方向。
- 迷你终端支持趣味演示命令，点击循环：`help → skills → about`。

### 调整样式
在 `assets/css/style.css` 文件中：
- 修改CSS变量以调整主题颜色
- 调整字体大小和间距
- 自定义动画效果
- 页头新增：`.tagline`、`.hero-tags .pill`、`.hero-ctas`、`.btn.secondary`
- 服务区：`.service-grid`、`.service-card`
- 终端：`.terminal`、`.terminal-header`、`.terminal-body`
- **关于资源路径的重要说明**: 在CSS中引用图片、字体或其他资源时，请确保使用正确的相对路径。例如，如果您的 `style.css` 在 `assets/css/` 目录下，而您的图片在 `assets/img/` 目录下，那么CSS中的路径应为 `../img/your-image.jpg`（使用 `../` 返回上一级目录）。

### 添加新功能
在 `assets/js/main.js` 文件中：
- 添加新的交互功能
- 修改动画参数
- 扩展主题切换逻辑

## 性能优化
- 图片压缩和优化
- CSS和JavaScript文件压缩
- 使用CDN加载第三方库
- 懒加载和预加载策略

## 贡献指南
欢迎提交Issues和Pull Requests来改进本项目！

## 联系方式
- 邮箱: haoran.qi0724@gmail.com
- GitHub: [@ben0724-ACE](https://github.com/ben0724-ACE)

---

⭐ 如果这个项目对您有帮助，请给它一个星！
