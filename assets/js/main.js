document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // --- Pre-loader ---
    // (这部分代码保持不变)
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
    // (这部分代码保持不变)
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
    // (这部分代码保持不变)
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

    // --- Quick Navigation --- //
    // (这部分代码保持不变)
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

    // --- 已修改: 全新的折叠/展开功能，由 GSAP 完全控制 ---
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    collapsibleHeaders.forEach(header => {
        const content = header.nextElementSibling;
        
        // 初始化内容区域为关闭状态
        gsap.set(content, { height: 0, autoAlpha: 0 });

        header.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            
            // 判断当前是否是展开状态（通过高度是否大于0来判断）
            const isExpanded = content.offsetHeight > 0;

            if (isExpanded) {
                // 如果是展开的，则折叠
                gsap.to(content, { 
                    height: 0, 
                    autoAlpha: 0, 
                    duration: 0.5, 
                    ease: 'power2.out',
                    onComplete: () => ScrollTrigger.refresh() // 动画完成后刷新滚动触发器
                });
            } else {
                // 如果是折叠的，则展开
                gsap.to(content, { 
                    height: 'auto', // 动画到内容的自然高度
                    autoAlpha: 1, 
                    duration: 0.5, 
                    ease: 'power2.out',
                    onComplete: () => ScrollTrigger.refresh() // 动画完成后刷新滚动触发器
                });
            }
            feather.replace();
        });
    });

    // --- Custom Cursor ---
    // (这部分代码保持不变)
    const cursor = document.querySelector('.cursor');
    const interactiveElements = document.querySelectorAll('a, button, .collapsible-header, .theme-switcher');

    document.addEventListener('mousemove', e => {
        cursor.setAttribute('style', `top: ${e.clientY}px; left: ${e.clientX}px;`);
    });
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });

    // --- 标题下划线动画 ---
    // (这部分代码保持不变)
    gsap.utils.toArray('h2').forEach(h2 => {
        ScrollTrigger.create({
          trigger: h2,
          start: 'top 90%',
          onEnter: () => h2.classList.add('is-visible'),
          once: true
        });
    });

    // 初始渲染 Feather 图标
    feather.replace();
});