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
    // 兼容某些浏览器/网络下 load 事件可能已触发的情况
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
        // 仅在用户没有手动设置过主题时，才跟随系统
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // 页面加载时应用主题
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

    // --- 滚动动画 (为列表项添加) ---
    gsap.utils.toArray('.collapsible-content ul').forEach(list => {
        gsap.from(list.children, {
            autoAlpha: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: list,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });

    // --- 快速导航 --- 
    const quickNavLinks = document.querySelectorAll('.quick-nav a');
    const mainSections = document.querySelectorAll('main section.collapsible-section, main section#skills');
    
    quickNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // 计算偏移量，确保标题可见
                const offset = window.matchMedia("(max-width: 992px)").matches ? 20 : 70;
                gsap.to(window, {duration: 1, scrollTo: {y: targetSection, offsetY: offset}, ease: "power2.out"});
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
                if (link) {
                  if (self.isActive) {
                      quickNavLinks.forEach(l => l.classList.remove('active'));
                      link.classList.add('active');
                  } else {
                      link.classList.remove('active');
                  }
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
            
            // 使用 GSAP 来创建更平滑的动画
            if (content.classList.contains('is-expanded')) {
                // 折叠
                content.classList.remove('is-expanded');
            } else {
                // 展开
                content.classList.add('is-expanded');
            }
            
            // 确保图标在状态切换后正确显示
            feather.replace();

            // 延迟刷新 ScrollTrigger，以确保动画完成后计算的位置是准确的
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500); // 这个时间应与 CSS transition 时间匹配
        });
    });

    // --- 自定义光标 ---
    const cursor = document.querySelector('.cursor');
    const interactiveElements = document.querySelectorAll('a, button, .collapsible-header, .theme-switcher, .tags span');

    document.addEventListener('mousemove', e => {
        // 使用 GSAP 来让光标移动更平滑
        gsap.to(cursor, {
            duration: 0.2,
            x: e.clientX,
            y: e.clientY
        });
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

    // 初始化 Feather 图标
    feather.replace();
});