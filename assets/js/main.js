document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // --- 预加载动画 ---
    const preloader = document.querySelector('.preloader');
    const hidePreloader = () => {
        gsap.to(preloader, { 
            opacity: 0, 
            duration: 0.8, 
            onComplete: () => {
                preloader.style.display = 'none';
            }
        });
    };
    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }

    // --- 主题切换器 ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const root = document.documentElement; 

    const setTheme = (theme) => {
        if (theme === 'dark') {
            root.classList.add('dark-mode');
            themeSwitcher.innerHTML = feather.icons.sun.toSvg();
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark-mode');
            themeSwitcher.innerHTML = feather.icons.moon.toSvg();
            localStorage.setItem('theme', 'light');
        }
    };

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    darkModeMediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
    }

    themeSwitcher.addEventListener('click', () => {
        const isDarkMode = root.classList.contains('dark-mode');
        setTheme(isDarkMode ? 'light' : 'dark');
    });

    // --- 滚动动画 ---
    gsap.utils.toArray('main li, .skill-category').forEach(elem => {
        gsap.from(elem, {
            autoAlpha: 0,       // 从完全透明开始
            y: 50,              // 从下方50像素的位置开始
            duration: 1.2,      // 动画持续时间更长，显得更从容
            ease: 'power3.out', // 使用一个更平滑、优雅的缓动函数
            scrollTrigger: {
                trigger: elem,
                start: 'top 90%', // 当元素顶部进入视口90%时触发
                toggleActions: 'play none none none', // 只播放一次
                once: true        // 确保动画只触发一次，滚动回去不会重置
            }
        });
    });
    // --- 快速导航 --- 
    const quickNavLinks = document.querySelectorAll('.quick-nav a');
    const mainSections = document.querySelectorAll('main section.collapsible-section');
    
    quickNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                gsap.to(window, {duration: 1, scrollTo: {y: targetSection, offsetY: 70}, ease: "power2.out"});
            }
        });
    });

    mainSections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onToggle: self => {
                const link = document.querySelector(`.quick-nav a[href="#${section.id}"]`);
                if (self.isActive) {
                    quickNavLinks.forEach(l => l.classList.remove('active'));
                    if(link) link.classList.add('active');
                } else {
                    if(link) link.classList.remove('active');
                }
            }
        });
    });

    // --- 折叠功能 ---
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('collapsed');
            content.classList.toggle('is-expanded');
            feather.replace();

            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        });
    });

    // --- 自定义光标 ---
    const cursor = document.querySelector('.cursor');
    // **唯一的修改在这里：增加了对 .tags span 和 .project-tags .tag 的选择**
    const interactiveElements = document.querySelectorAll('a, button, .collapsible-header, .theme-switcher, .tags span, .project-tags .tag');

    document.addEventListener('mousemove', e => {
        cursor.setAttribute('style', `top: ${e.clientY}px; left: ${e.clientX}px;`);
    });
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });

    // --- 标题下划线动画 ---
    gsap.utils.toArray('h2').forEach(h2 => {
        ScrollTrigger.create({
          trigger: h2,
          start: 'top 90%',
          onEnter: () => h2.classList.add('is-visible'),
          once: true
        });
    });

    // --- 页头背景幻灯片 ---
    const bgImages = gsap.utils.toArray('.header-bg-slider img');
    let currentIndex = 0;

    // 设置第一张图片为可见
    gsap.set(bgImages[0], { autoAlpha: 1 });

    function crossfade() {
        // 淡出当前图片
        gsap.to(bgImages[currentIndex], { autoAlpha: 0, duration: 1.5, ease: 'power2.inOut' });

        // 确定下一张图片的索引
        currentIndex = (currentIndex + 1) % bgImages.length;

        // 淡入下一张图片
        gsap.to(bgImages[currentIndex], { autoAlpha: 1, duration: 1.5, ease: 'power2.inOut' });
        
        // 安排下一次交叉淡入淡出
        gsap.delayedCall(3, crossfade); // 每3秒切换一次图片
    }

    // 开始幻灯片放映
    gsap.delayedCall(3, crossfade);

    // 初始化 Feather 图标
    feather.replace();
});