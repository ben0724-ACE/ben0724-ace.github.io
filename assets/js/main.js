document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // --- Pre-loader ---
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

    // --- Theme Switcher ---
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

    // --- Scroll Animations ---
gsap.utils.toArray('.collapsible-content ul').forEach(list => {
    gsap.from(list.children, {
        autoAlpha: 0, // 初始状态：完全透明且不可交互
        y: 50,        // 从下方 50px 的位置开始
        duration: 0.8,
        stagger: 0.2, // 每个子元素（li）之间延迟 0.2 秒出现
        ease: 'power2.out',
        scrollTrigger: {
            trigger: list,
            start: 'top 85%', // 当列表的顶部进入视口的 85% 位置时触发
            toggleActions: 'play none none none', // 只播放一次
            // markers: true, // 在开发时取消注释以查看触发器位置
          }
    });
});

    // --- Quick Navigation --- //
    const quickNavLinks = document.querySelectorAll('.quick-nav a');
    const mainSections = document.querySelectorAll('main section.collapsible-section'); // 使选择器更精确
    
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

    // 为每个导航链接对应的版块创建 ScrollTrigger
    mainSections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top center", // 当版块顶部到达视口中心时
            end: "bottom center", // 当版块底部离开视口中心时
            onToggle: self => {
                const link = document.querySelector(`.quick-nav a[href="#${section.id}"]`);
                if (self.isActive) {
                    // 当进入触发区域时，激活对应的链接
                    quickNavLinks.forEach(l => l.classList.remove('active'));
                    if(link) {
                        link.classList.add('active');
                    }
                } else {
                    // 当离开触发区域时，如果需要，可以移除激活状态
                    if(link) {
                        link.classList.remove('active');
                    }
                }
            }
        });
    });


    // --- Collapse Functionality ---
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('collapsed');
            content.classList.toggle('is-expanded');
            gsap.utils.toArray('h2').forEach(h2 => {
                ScrollTrigger.create({
                  trigger: h2,
                  start: 'top 90%',
                  onEnter: () => h2.classList.add('is-visible'), // 进入时添加类
                  once: true // 动画只触发一次
                });
            });              
            feather.replace();

            // --- 新增代码在此！ ---
            // 延迟一小段时间后刷新 ScrollTrigger，以等待折叠动画完成
            // 这可以确保计算的位置是最终的正确位置
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500); // 500ms 对应 CSS 中 max-height 的过渡时间
        });
    });

    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor');

    const interactiveElements = document.querySelectorAll('a, button, .collapsible-header, .theme-switcher');

    document.addEventListener('mousemove', e => {
        cursor.setAttribute('style', `top: ${e.clientY}px; left: ${e.clientX}px;`);
    });
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });
});
