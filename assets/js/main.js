document.addEventListener('DOMContentLoaded', () => {
    const gsapAvailable = typeof window.gsap !== 'undefined';
    const scrollTriggerAvailable = typeof window.ScrollTrigger !== 'undefined';
    const scrollToPluginAvailable = typeof window.ScrollToPlugin !== 'undefined';

    if (gsapAvailable && scrollTriggerAvailable && scrollToPluginAvailable) {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    const desktopMotion = window.matchMedia('(min-width: 1025px)');

    const root = document.documentElement;
    const preloader = document.querySelector('.preloader');
    const themeSwitcher = document.getElementById('theme-switcher');
    const languageSwitcher = document.getElementById('language-switcher');
    const quickNavLinks = Array.from(document.querySelectorAll('.quick-nav a'));
    const mobileNavLinks = Array.from(document.querySelectorAll('.mobile-section-nav a'));
    const navLinks = [...quickNavLinks, ...mobileNavLinks];
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const collapsibleHeaders = Array.from(document.querySelectorAll('.collapsible-header'));
    const progressBar = document.querySelector('.scroll-progress .bar');
    const backTopBtn = document.getElementById('back-to-top');
    const cvButtons = Array.from(document.querySelectorAll('a[data-cv-en]'));
    const langEnElements = Array.from(document.querySelectorAll('.lang-en'));
    const langZhElements = Array.from(document.querySelectorAll('.lang-zh'));
    const bgImages = Array.from(document.querySelectorAll('.header-bg-slider img'));
    const headerEl = document.querySelector('header');
    const deferredMedia = Array.from(document.querySelectorAll('.deferred-media[data-src]'));
    const metricCounters = Array.from(document.querySelectorAll('.hero-metrics strong[data-count]'));
    const headings = Array.from(document.querySelectorAll('main h2'));
    const terminal = document.getElementById('mini-terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    const terminalStates = [
        {
            input: 'help',
            output: {
                en: 'Commands: help, skills, about',
                zh: '\u53ef\u7528\u547d\u4ee4\uff1ahelp\uff0cskills\uff0cabout'
            }
        },
        {
            input: 'skills',
            output: {
                en: 'Vision / ROS / Automation / Data Analysis',
                zh: '\u8ba1\u7b97\u673a\u89c6\u89c9 / ROS / \u81ea\u52a8\u5316 / \u6570\u636e\u5206\u6790'
            }
        },
        {
            input: 'about',
            output: {
                en: 'Building practical AI and automation systems.',
                zh: '\u4e13\u6ce8\u4e8e\u53ef\u843d\u5730\u7684 AI \u4e0e\u81ea\u52a8\u5316\u7cfb\u7edf\u3002'
            }
        }
    ];

    let terminalStateIndex = 0;
    let typeTimer = null;
    let sliderTimer = null;
    let currentSlide = 0;
    let progressRaf = 0;
    let activeSectionId = sections[0]?.id || 'about';
    let animationsInitialized = false;

    function addMediaListener(query, handler) {
        if (typeof query.addEventListener === 'function') {
            query.addEventListener('change', handler);
        } else if (typeof query.addListener === 'function') {
            query.addListener(handler);
        }
    }

    function getCurrentLanguage() {
        return localStorage.getItem('language') || 'en';
    }

    function getCurrentTheme() {
        return localStorage.getItem('theme');
    }

    function updateControlLabels(lang) {
        if (!themeSwitcher || !languageSwitcher) {
            return;
        }

        if (lang === 'zh') {
            themeSwitcher.setAttribute('aria-label', '\u5207\u6362\u4e3b\u9898');
            themeSwitcher.setAttribute('title', '\u5207\u6362\u4e3b\u9898');
            languageSwitcher.setAttribute('aria-label', '\u5207\u6362\u5230\u82f1\u6587');
            languageSwitcher.setAttribute('title', '\u5207\u6362\u5230\u82f1\u6587');
            languageSwitcher.textContent = 'EN';
        } else {
            themeSwitcher.setAttribute('aria-label', 'Toggle theme');
            themeSwitcher.setAttribute('title', 'Toggle theme');
            languageSwitcher.setAttribute('aria-label', 'Switch to Chinese');
            languageSwitcher.setAttribute('title', 'Switch to Chinese');
            languageSwitcher.textContent = '\u4e2d';
        }
    }

    function renderThemeIcon(theme) {
        if (!themeSwitcher) {
            return;
        }

        if (window.feather) {
            const icon = theme === 'dark' ? feather.icons.sun : feather.icons.moon;
            themeSwitcher.innerHTML = icon.toSvg({ width: 18, height: 18, strokeWidth: 2.25 });
        } else {
            themeSwitcher.textContent = theme === 'dark' ? 'L' : 'D';
        }
    }

    function setTheme(theme, persist = true) {
        const nextTheme = theme === 'dark' ? 'dark' : 'light';
        root.classList.toggle('dark-mode', nextTheme === 'dark');
        if (persist) {
            localStorage.setItem('theme', nextTheme);
        }
        renderThemeIcon(nextTheme);
    }

    function typeText(element, text, speed, done) {
        if (!element) {
            return;
        }

        if (typeTimer) {
            window.clearInterval(typeTimer);
        }

        element.textContent = '';
        let index = 0;
        typeTimer = window.setInterval(() => {
            element.textContent += text.charAt(index);
            index += 1;

            if (index >= text.length) {
                window.clearInterval(typeTimer);
                typeTimer = null;
                if (typeof done === 'function') {
                    done();
                }
            }
        }, speed);
    }

    function renderTerminalState(animate) {
        if (!terminalInput || !terminalOutput) {
            return;
        }

        const lang = getCurrentLanguage();
        const state = terminalStates[terminalStateIndex];
        const speed = prefersReducedMotion.matches ? 0 : 55;

        if (animate) {
            typeText(terminalInput, state.input, speed || 1, () => {
                terminalOutput.textContent = state.output[lang];
            });
        } else {
            terminalInput.textContent = state.input;
            terminalOutput.textContent = state.output[lang];
        }
    }

    function setLanguage(lang) {
        const nextLanguage = lang === 'zh' ? 'zh' : 'en';
        const showEnglish = nextLanguage === 'en';

        langEnElements.forEach((element) => {
            element.style.display = showEnglish ? 'inline' : 'none';
        });

        langZhElements.forEach((element) => {
            element.style.display = showEnglish ? 'none' : 'inline';
        });

        localStorage.setItem('language', nextLanguage);
        root.lang = nextLanguage === 'zh' ? 'zh-CN' : 'en';
        updateControlLabels(nextLanguage);

        cvButtons.forEach((button) => {
            const file = button.getAttribute(showEnglish ? 'data-cv-en' : 'data-cv-zh');
            if (file) {
                button.setAttribute('href', file);
            }
        });

        renderTerminalState(false);
    }

    function getScrollOffset() {
        const mobileNav = document.querySelector('.mobile-section-nav');
        const mobileVisible = mobileNav && window.getComputedStyle(mobileNav).display !== 'none';
        return mobileVisible ? mobileNav.offsetHeight + 28 : 76;
    }

    function syncNavLinks(sectionId) {
        activeSectionId = sectionId;
        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${sectionId}`;
            link.classList.toggle('active', isActive);

            if (isActive && link.closest('.mobile-section-nav')) {
                link.scrollIntoView({
                    behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
                    inline: 'center',
                    block: 'nearest'
                });
            }
        });
    }

    function setupHeadingAccents() {
        if (!headings.length || !('IntersectionObserver' in window)) {
            headings.forEach((heading) => heading.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            { rootMargin: '0px 0px -18% 0px', threshold: 0.15 }
        );

        headings.forEach((heading) => observer.observe(heading));
    }

    function setupMetricCounters() {
        if (!metricCounters.length) {
            return;
        }

        const animateCounter = (counter) => {
            if (counter.dataset.counted === 'true') {
                return;
            }

            const target = Number(counter.dataset.count || '0');
            const suffix = counter.dataset.suffix || '';
            counter.dataset.counted = 'true';

            if (prefersReducedMotion.matches || !gsapAvailable) {
                counter.textContent = `${target}${suffix}`;
                return;
            }

            const value = { current: 0 };
            gsap.to(value, {
                current: target,
                duration: 1.15,
                ease: 'power2.out',
                onUpdate: () => {
                    counter.textContent = `${Math.round(value.current)}${suffix}`;
                },
                onComplete: () => {
                    counter.textContent = `${target}${suffix}`;
                }
            });
        };

        if (!('IntersectionObserver' in window)) {
            metricCounters.forEach(animateCounter);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.5 }
        );

        metricCounters.forEach((counter) => observer.observe(counter));
    }

    function scrollToSection(section) {
        if (!section) {
            return;
        }

        const offset = getScrollOffset();

        if (gsapAvailable && scrollToPluginAvailable && !prefersReducedMotion.matches) {
            gsap.to(window, {
                duration: 0.8,
                scrollTo: { y: section, offsetY: offset },
                ease: 'power2.out'
            });
        } else {
            const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top,
                behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
            });
        }
    }

    function updateScrollUI() {
        if (progressBar) {
            const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
            progressBar.style.width = `${percent}%`;
        }

        if (backTopBtn) {
            backTopBtn.classList.toggle('visible', window.scrollY > 500);
        }
    }

    function scheduleScrollUI() {
        if (progressRaf) {
            return;
        }

        progressRaf = window.requestAnimationFrame(() => {
            updateScrollUI();
            progressRaf = 0;
        });
    }

    function setupNavigation() {
        navLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetSelector = link.getAttribute('href');
                if (!targetSelector) {
                    return;
                }

                const section = document.querySelector(targetSelector);
                syncNavLinks(targetSelector.replace('#', ''));
                scrollToSection(section);
            });
        });

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visibleEntry?.target?.id) {
                    syncNavLinks(visibleEntry.target.id);
                }
            },
            {
                rootMargin: '-34% 0px -46% 0px',
                threshold: [0.2, 0.35, 0.55]
            }
        );

        sections.forEach((section) => observer.observe(section));
        syncNavLinks(activeSectionId);
    }

    function setupCollapsibles() {
        collapsibleHeaders.forEach((header) => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                if (!content) {
                    return;
                }

                header.classList.toggle('collapsed');
                content.classList.toggle('is-expanded');

                if (scrollTriggerAvailable) {
                    window.setTimeout(() => ScrollTrigger.refresh(), 220);
                }
            });
        });
    }

    function setupDeferredMedia() {
        if (!deferredMedia.length) {
            return;
        }

        const loadMedia = (image) => {
            if (!image.dataset.src || image.dataset.loaded === 'true') {
                return;
            }

            image.dataset.loaded = 'pending';
            image.addEventListener(
                'load',
                () => {
                    image.dataset.loaded = 'true';
                },
                { once: true }
            );
            image.src = image.dataset.src;
        };

        if (!('IntersectionObserver' in window)) {
            deferredMedia.forEach(loadMedia);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    loadMedia(entry.target);
                    observer.unobserve(entry.target);
                });
            },
            { rootMargin: '220px 0px' }
        );

        deferredMedia.forEach((image) => observer.observe(image));
    }

    function setupIntroAndReveals() {
        if (animationsInitialized) {
            return;
        }

        animationsInitialized = true;

        if (!gsapAvailable || prefersReducedMotion.matches) {
            return;
        }

        const introTimeline = gsap.timeline({ defaults: { duration: 0.65, ease: 'power2.out' } });
        introTimeline
            .from('.avatar', { y: 20, autoAlpha: 0 })
            .from('header h1', { y: 24, autoAlpha: 0 }, '-=0.35')
            .from('header p', { y: 18, autoAlpha: 0, stagger: 0.05 }, '-=0.35')
            .from('.hero-tags .pill', { y: 14, autoAlpha: 0, stagger: 0.06 }, '-=0.25')
            .from('.hero-metrics .metric-card', { y: 16, autoAlpha: 0, stagger: 0.08 }, '-=0.25')
            .from('.hero-ctas .btn, header .social a', { y: 12, autoAlpha: 0, stagger: 0.06 }, '-=0.25');

        const revealTargets = gsap.utils.toArray('.service-card, .terminal, .collapsible-section, .showcase-strip');
        revealTargets.forEach((element) => {
            gsap.from(element, {
                y: 26,
                autoAlpha: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                    once: true
                }
            });
        });
    }

    function setupHeaderSlider() {
        if (!bgImages.length) {
            return;
        }

        if (gsapAvailable) {
            gsap.set(bgImages, { autoAlpha: 0, xPercent: -50, yPercent: -50, x: 0, y: 0 });
            gsap.set(bgImages[0], { autoAlpha: 1 });
        } else {
            bgImages.forEach((image, index) => {
                image.style.opacity = index === 0 ? '1' : '0';
            });
        }

        if (prefersReducedMotion.matches || bgImages.length < 2) {
            return;
        }

        const runSlide = () => {
            const previous = bgImages[currentSlide];
            currentSlide = (currentSlide + 1) % bgImages.length;
            const next = bgImages[currentSlide];

            if (gsapAvailable) {
                gsap.to(previous, { autoAlpha: 0, duration: 1.2, ease: 'power2.inOut' });
                gsap.to(next, { autoAlpha: 1, duration: 1.2, ease: 'power2.inOut' });
            } else {
                previous.style.opacity = '0';
                next.style.opacity = '1';
            }
        };

        const stopSlider = () => {
            if (sliderTimer) {
                window.clearInterval(sliderTimer);
                sliderTimer = null;
            }
        };

        const startSlider = () => {
            if (sliderTimer || document.hidden || prefersReducedMotion.matches || bgImages.length < 2) {
                return;
            }

            sliderTimer = window.setInterval(runSlide, 5200);
        };

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopSlider();
            } else {
                startSlider();
            }
        });

        addMediaListener(prefersReducedMotion, () => {
            stopSlider();
            if (!prefersReducedMotion.matches) {
                startSlider();
            }
        });

        startSlider();
    }

    function setupHeaderParallax() {
        if (!gsapAvailable || prefersReducedMotion.matches || !finePointer.matches || !desktopMotion.matches || !headerEl || !bgImages.length) {
            return;
        }

        let pointerX = 0;
        let pointerY = 0;
        let rafId = 0;

        const render = () => {
            rafId = 0;
            bgImages.forEach((image, index) => {
                const depth = (index + 1) * 10;
                gsap.to(image, {
                    x: pointerX * depth,
                    y: pointerY * depth,
                    duration: 0.45,
                    ease: 'power2.out',
                    overwrite: true
                });
            });
        };

        const requestRender = () => {
            if (!rafId) {
                rafId = window.requestAnimationFrame(render);
            }
        };

        headerEl.addEventListener('mousemove', (event) => {
            const rect = headerEl.getBoundingClientRect();
            const nx = (event.clientX - rect.left) / rect.width - 0.5;
            const ny = (event.clientY - rect.top) / rect.height - 0.5;
            pointerX = Math.max(-0.18, Math.min(0.18, nx));
            pointerY = Math.max(-0.14, Math.min(0.14, ny));
            requestRender();
        });

        headerEl.addEventListener('mouseleave', () => {
            pointerX = 0;
            pointerY = 0;
            requestRender();
        });
    }

    function hidePreloader() {
        if (!preloader) {
            setupIntroAndReveals();
            return;
        }

        preloader.classList.add('loaded');
        window.setTimeout(() => {
            preloader.style.display = 'none';
            setupIntroAndReveals();
        }, prefersReducedMotion.matches ? 0 : 450);
    }

    if (window.feather) {
        feather.replace();
    }

    const savedTheme = getCurrentTheme();
    setTheme(savedTheme || (prefersDark.matches ? 'dark' : 'light'), Boolean(savedTheme));

    const savedLanguage = getCurrentLanguage();
    setLanguage(savedLanguage);

    themeSwitcher?.addEventListener('click', () => {
        const isDark = root.classList.contains('dark-mode');
        setTheme(isDark ? 'light' : 'dark', true);
        updateControlLabels(getCurrentLanguage());
    });

    languageSwitcher?.addEventListener('click', () => {
        const currentLanguage = getCurrentLanguage();
        setLanguage(currentLanguage === 'en' ? 'zh' : 'en');
    });

    addMediaListener(prefersDark, (event) => {
        if (!getCurrentTheme()) {
            setTheme(event.matches ? 'dark' : 'light', false);
        }
    });

    terminal?.addEventListener('click', () => {
        terminalStateIndex = (terminalStateIndex + 1) % terminalStates.length;
        renderTerminalState(true);
    });

    backTopBtn?.addEventListener('click', () => {
        if (gsapAvailable && scrollToPluginAvailable && !prefersReducedMotion.matches) {
            gsap.to(window, { duration: 0.75, scrollTo: { y: 0 }, ease: 'power2.out' });
        } else {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
        }
    });

    window.addEventListener('scroll', scheduleScrollUI, { passive: true });
    window.addEventListener('resize', scheduleScrollUI);

    setupNavigation();
    setupCollapsibles();
    setupDeferredMedia();
    setupHeadingAccents();
    setupMetricCounters();
    setupHeaderSlider();
    setupHeaderParallax();
    renderTerminalState(false);
    updateScrollUI();

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader, { once: true });
    }
});
