document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const mobileLayout = window.matchMedia('(max-width: 992px)');
    const readPreference = (key) => {
        try { return localStorage.getItem(key); } catch { return null; }
    };
    const savePreference = (key, value) => {
        try { localStorage.setItem(key, value); } catch { /* 浏览器禁用存储时仍保持本次会话可用。 */ }
    };
    const icon = (name, fallback) => window.feather?.icons?.[name]?.toSvg({ 'aria-hidden': 'true' }) || fallback;
    const replaceIcons = () => window.feather?.replace({ 'aria-hidden': 'true' });
    const themeButton = document.getElementById('theme-switcher');
    const languageButton = document.getElementById('language-switcher');
    const navigation = document.getElementById('page-navigation');
    const navButton = document.getElementById('nav-toggle');
    const backTopButton = document.getElementById('back-to-top');
    const terminalButton = document.getElementById('mini-terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const sections = [...document.querySelectorAll('main section[id]')];
    const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
    const collapsibleSections = [...document.querySelectorAll('.collapsible-section')];
    const commands = ['help', 'skills', 'about'];
    let command = 'help';
    let typingTimer;
    let language = readPreference('language') === 'zh' ? 'zh' : 'en';
    const savedTheme = readPreference('theme');
    let themePreference = ['light', 'dark'].includes(savedTheme) ? savedTheme : null;
    let navigationOpen = false;
    let scrollFrame = null;

    function updateScrollState() {
        const max = root.scrollHeight - root.clientHeight;
        document.querySelector('.scroll-progress .bar').style.width = `${max > 0 ? root.scrollTop / max * 100 : 0}%`;
        backTopButton.hidden = window.scrollY <= 500;
        backTopButton.classList.toggle('visible', !backTopButton.hidden);
        const current = sections.filter(section => section.getBoundingClientRect().top <= Math.max(90, window.innerHeight * 0.3)).pop() || sections[0];
        navLinks.forEach(link => {
            const active = link.hash === `#${current.id}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }

    function setTheme() {
        const dark = themePreference ? themePreference === 'dark' : systemTheme.matches;
        root.classList.toggle('dark-mode', dark);
        themeButton.innerHTML = dark ? icon('sun', '☀') : icon('moon', '☾');
        themeButton.setAttribute('aria-label', language === 'zh' ? `切换为${dark ? '浅色' : '深色'}主题` : `Switch to ${dark ? 'light' : 'dark'} theme`);
        themeButton.title = themeButton.getAttribute('aria-label');
    }
    themeButton.addEventListener('click', () => {
        themePreference = root.classList.contains('dark-mode') ? 'light' : 'dark';
        savePreference('theme', themePreference);
        setTheme();
    });
    systemTheme.addEventListener('change', () => {
        if (!themePreference) setTheme();
    });

    function renderTerminal(animate = false) {
        clearInterval(typingTimer);
        const outputs = {
            en: {
                help: 'Commands: help, skills, about',
                skills: 'AI Agents / RAG / Vision / ROS / Automation / Data Analysis',
                about: 'Building AI agents, robotics and automation systems.'
            },
            zh: {
                help: '可用命令: help, skills, about',
                skills: 'AI Agent / RAG / 视觉 / ROS / 自动化 / 数据分析',
                about: '专注 AI Agent、机器人与自动化开发。'
            }
        };
        terminalOutput.textContent = outputs[language][command];
        terminalInput.textContent = animate && !reducedMotion.matches ? '' : command;
        terminalButton.setAttribute('aria-label', language === 'zh' ? `切换命令，当前为 ${command}` : `Next command; current command: ${command}`);
        if (animate && !reducedMotion.matches) {
            let length = 0;
            typingTimer = setInterval(() => {
                terminalInput.textContent = command.slice(0, ++length);
                if (length >= command.length) clearInterval(typingTimer);
            }, 70);
        }
    }
    terminalButton.addEventListener('click', () => {
        command = commands[(commands.indexOf(command) + 1) % commands.length];
        renderTerminal(true);
    });

    function setLanguage(nextLanguage, remember = false) {
        language = nextLanguage;
        root.lang = language === 'zh' ? 'zh-CN' : 'en';
        document.querySelectorAll('.lang-en, .lang-zh').forEach(element => {
            const visible = element.classList.contains(`lang-${language}`);
            element.hidden = !visible;
            element.style.display = visible ? 'inline' : 'none';
        });
        languageButton.textContent = language === 'zh' ? 'EN' : '中';
        languageButton.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
        languageButton.title = languageButton.getAttribute('aria-label');
        document.querySelectorAll('h1, h2').forEach(heading => {
            const label = heading.querySelector(`.lang-${language}`)?.textContent.trim();
            if (label) {
                heading.setAttribute('aria-label', label);
                heading.querySelector('.section-toggle')?.setAttribute('aria-label', label);
            }
        });
        backTopButton.setAttribute('aria-label', language === 'zh' ? '回到顶部' : 'Back to top');
        backTopButton.title = backTopButton.getAttribute('aria-label');
        if (remember) savePreference('language', language);
        renderTerminal();
        setTheme();
        updateScrollState();
    }
    languageButton.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en', true));

    function setExpanded(section, expanded, animate = true) {
        const heading = section.querySelector('.collapsible-header');
        const button = heading.querySelector('.section-toggle');
        const content = section.querySelector('.collapsible-content');
        const wasExpanded = content.classList.contains('is-expanded');
        if (!expanded && content.contains(document.activeElement)) button.focus({ preventScroll: true });
        if (wasExpanded !== expanded && animate && !reducedMotion.matches) {
            const fullHeight = content.scrollHeight;
            if (wasExpanded) {
                content.style.maxHeight = `${content.getBoundingClientRect().height}px`;
                void content.offsetHeight;
            }
            content.style.maxHeight = expanded ? `${fullHeight}px` : '0px';
        } else {
            content.style.removeProperty('max-height');
        }
        content.classList.toggle('is-expanded', expanded);
        heading.classList.toggle('collapsed', !expanded);
        content.inert = !expanded;
        content.setAttribute('aria-hidden', String(!expanded));
        button.setAttribute('aria-expanded', String(expanded));
        updateScrollState();
    }
    collapsibleSections.forEach(section => {
        const button = section.querySelector('.section-toggle');
        const content = section.querySelector('.collapsible-content');
        button.disabled = false;
        button.addEventListener('click', () => setExpanded(section, button.getAttribute('aria-expanded') !== 'true'));
        content.addEventListener('transitionend', event => {
            if (event.target === content && event.propertyName === 'max-height') {
                content.style.removeProperty('max-height');
                updateScrollState();
            }
        });
        setExpanded(section, window.location.hash === `#${section.id}`, false);
    });

    function setNavigation(open, restoreFocus = false) {
        navigationOpen = open && mobileLayout.matches;
        navigation.classList.toggle('is-open', navigationOpen);
        navigation.inert = mobileLayout.matches && !navigationOpen;
        navigation.setAttribute('aria-hidden', String(navigation.inert));
        navButton.setAttribute('aria-expanded', String(navigationOpen));
        if (restoreFocus) navButton.focus();
    }
    navButton.addEventListener('click', () => setNavigation(!navigationOpen));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navigationOpen) setNavigation(false, true);
    });
    mobileLayout.addEventListener('change', () => setNavigation(false));
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = document.getElementById(link.hash.slice(1));
            if (target?.classList.contains('collapsible-section')) setExpanded(target, true, false);
            if (mobileLayout.matches) {
                setNavigation(false);
                (target?.querySelector('.section-toggle') || target)?.focus({ preventScroll: true });
            }
            // 保留原生锚点导航，让地址、浏览器历史和返回操作保持同步。
        });
    });
    function revealHashTarget() {
        const target = document.getElementById(window.location.hash.slice(1));
        if (!target) return;
        if (target.classList.contains('collapsible-section')) setExpanded(target, true, false);
        requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
    }
    window.addEventListener('hashchange', revealHashTarget);
    window.addEventListener('scroll', () => {
        if (scrollFrame !== null) return;
        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = null;
            updateScrollState();
        });
    }, { passive: true });
    window.addEventListener('resize', updateScrollState);
    if ('ResizeObserver' in window) new ResizeObserver(updateScrollState).observe(document.querySelector('main'));
    backTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' }));

    root.classList.add('has-interactions');
    themeButton.hidden = false;
    languageButton.hidden = false;
    navButton.hidden = false;
    setNavigation(false);
    setLanguage(language);
    replaceIcons();
    revealHashTarget();

    // 动画仅作为增强效果；基本阅读、导航、下载和按钮不依赖外部脚本。
    const gsap = window.gsap;
    if (!gsap || reducedMotion.matches) return;
    const animationTargets = 'header h1, header p, .avatar, .hero-tags .pill, header .social a, .service-card, .skill-category, main li';
    try {
        gsap.from('.avatar, header h1, header p, .hero-tags .pill, header .social a', {
            autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.05, clearProps: 'opacity,visibility,transform'
        });
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);
                if (!reducedMotion.matches) gsap.fromTo(entry.target, { autoAlpha: 0, y: 24 }, {
                    autoAlpha: 1, y: 0, duration: 0.6, clearProps: 'opacity,visibility,transform'
                });
            });
        }, { threshold: 0.05 });
        document.querySelectorAll('.service-card, .skill-category, .collapsible-content > ul > li').forEach(element => observer.observe(element));

        const backgroundImages = [...document.querySelectorAll('.header-bg-slider img')];
        let backgroundIndex = 0;
        let backgroundTimer;
        function syncBackgroundAnimation() {
            clearInterval(backgroundTimer);
            if (document.hidden || reducedMotion.matches) return;
            backgroundTimer = setInterval(() => {
                gsap.to(backgroundImages[backgroundIndex], { opacity: 0, duration: 1.5 });
                backgroundIndex = (backgroundIndex + 1) % backgroundImages.length;
                gsap.to(backgroundImages[backgroundIndex], { opacity: 1, duration: 1.5 });
            }, 4500);
        }
        document.addEventListener('visibilitychange', syncBackgroundAnimation);
        syncBackgroundAnimation();

        if (window.matchMedia('(pointer:fine)').matches) {
            const cursor = document.querySelector('.cursor');
            cursor.hidden = false;
            document.addEventListener('mousemove', event => {
                cursor.style.top = `${event.clientY}px`;
                cursor.style.left = `${event.clientX}px`;
            });
            document.querySelectorAll('a, button').forEach(element => {
                element.addEventListener('mouseenter', () => cursor.classList.add('grow'));
                element.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
            });
            document.querySelectorAll('.service-card').forEach(card => {
                card.addEventListener('mousemove', event => {
                    if (reducedMotion.matches) return;
                    const bounds = card.getBoundingClientRect();
                    card.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
                    card.style.setProperty('--my', `${event.clientY - bounds.top}px`);
                    gsap.to(card, { rotateX: (event.clientY - bounds.top - bounds.height / 2) / bounds.height * -12,
                        rotateY: (event.clientX - bounds.left - bounds.width / 2) / bounds.width * 12,
                        transformPerspective: 1000, duration: 0.18, overwrite: true });
                });
                card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.35 }));
            });
            document.querySelectorAll('.pill, header .social a').forEach(element => {
                element.addEventListener('mousemove', event => {
                    if (reducedMotion.matches) return;
                    const bounds = element.getBoundingClientRect();
                    gsap.to(element, { x: (event.clientX - bounds.left - bounds.width / 2) / bounds.width * 12,
                        y: (event.clientY - bounds.top - bounds.height / 2) / bounds.height * 12,
                        duration: 0.18, overwrite: true });
                });
                element.addEventListener('mouseleave', () => gsap.to(element, { x: 0, y: 0, duration: 0.3 }));
            });
            const header = document.querySelector('header');
            gsap.set(backgroundImages, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
            header.addEventListener('mousemove', event => {
                if (reducedMotion.matches) return;
                const bounds = header.getBoundingClientRect();
                const x = Math.max(-0.35, Math.min(0.35, (event.clientX - bounds.left - bounds.width / 2) / bounds.width));
                const y = Math.max(-0.35, Math.min(0.35, (event.clientY - bounds.top - bounds.height / 2) / bounds.height));
                backgroundImages.forEach((image, index) => gsap.to(image, { x: x * (index + 1) * 12, y: y * (index + 1) * 12, duration: 0.25, overwrite: 'auto' }));
            });
            header.addEventListener('mouseleave', () => gsap.to(backgroundImages, { x: 0, y: 0, duration: 0.4 }));

            const canvas = document.getElementById('click-effects');
            const context = canvas.getContext('2d');
            let particles = [];
            let frame = null;
            function resizeCanvas() {
                canvas.width = innerWidth * devicePixelRatio;
                canvas.height = innerHeight * devicePixelRatio;
            }
            function drawParticles() {
                frame = null;
                context.clearRect(0, 0, canvas.width, canvas.height);
                particles = particles.filter(particle => particle.life > 0);
                particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vy += 0.08;
                    particle.life--;
                    context.globalAlpha = particle.life / 60;
                    context.fillStyle = particle.color;
                    context.fillRect(particle.x, particle.y, 6, 3);
                });
                if (particles.length) frame = requestAnimationFrame(drawParticles);
            }
            function stopParticles() {
                if (frame !== null) cancelAnimationFrame(frame);
                frame = null;
                particles = [];
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            document.addEventListener('click', event => {
                if (reducedMotion.matches || document.hidden) return;
                const styles = getComputedStyle(root);
                const colors = [styles.getPropertyValue('--accent'), styles.getPropertyValue('--highlight')];
                for (let i = 0; i < 24; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 3 + 2;
                    particles.push({ x: event.clientX * devicePixelRatio, y: event.clientY * devicePixelRatio,
                        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2, life: 60, color: colors[i % 2].trim() });
                }
                if (frame === null) frame = requestAnimationFrame(drawParticles);
            });
            document.addEventListener('visibilitychange', () => { if (document.hidden) stopParticles(); });
            reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) stopParticles(); });
        }
        reducedMotion.addEventListener('change', () => {
            syncBackgroundAnimation();
            if (reducedMotion.matches) {
                clearInterval(typingTimer);
                renderTerminal();
                gsap.killTweensOf(animationTargets);
                gsap.set(animationTargets, { clearProps: 'opacity,visibility,transform' });
            }
        });
    } catch (error) {
        document.querySelectorAll(animationTargets).forEach(element => {
            ['opacity', 'visibility', 'transform'].forEach(property => element.style.removeProperty(property));
        });
        console.warn('Decorative animations are unavailable; page controls remain active.', error);
    }
});
