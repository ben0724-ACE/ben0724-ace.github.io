document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // --- 预加载动画 ---
    const preloader = document.querySelector('.preloader');
    // 页面入场动画
    function animateLettersIn(containerSelector){
        const el = typeof containerSelector === 'string' ? document.querySelector(containerSelector) : containerSelector;
        if (!el || el.getAttribute('data-letters-animated') === '1') return;
        const L = localStorage.getItem('language') || 'en';
        const target = el.querySelector(L === 'zh' ? '.lang-zh' : '.lang-en') || el;
        const text = (target.textContent || '').trim();
        if (!text) return;
        target.innerHTML = '';
        const frag = document.createDocumentFragment();
        [...text].forEach((ch, idx) => {
            const span = document.createElement('span');
            if (ch === ' ') { span.innerHTML = '&nbsp;'; } else { span.textContent = ch; }
            span.style.display = 'inline-block';
            span.style.transform = 'translateY(30px)';
            span.style.opacity = '0';
            frag.appendChild(span);
            gsap.to(span, { delay: idx*0.05, duration: 0.6, y: 0, opacity: 1, ease: 'back.out(2)' });
        });
        target.appendChild(frag);
        el.setAttribute('data-letters-animated','1');
    }

    function startIntro(){
        const tl = gsap.timeline({ defaults: { duration: 0.7, ease: 'power3.out' } });
        tl.from('.avatar', { scale: 0.85, autoAlpha: 0 })
          .from('header h1', { y: 24, autoAlpha: 0 }, '-=0.4')
          .add(() => animateLettersIn('header h1'))
          .from('header p', { y: 20, autoAlpha: 0 }, '-=0.5')
          .from('.hero-tags .pill', { autoAlpha: 0, stagger: 0.08 }, '-=0.4')
          .from('.hero-ctas .btn', { autoAlpha: 0, stagger: 0.1 }, '-=0.5')
          .from('header .social a', { y: 12, autoAlpha: 0, stagger: 0.06 }, '-=0.5')
          .from('.quick-nav', { x: -30, autoAlpha: 0 }, '-=0.6')
          .add(() => {
              // 左侧目录依次高亮引导
              const links = document.querySelectorAll('.quick-nav li a');
              links.forEach((a, idx) => {
                  gsap.fromTo(a, { backgroundColor: 'transparent', color: getComputedStyle(a).color }, {
                      backgroundColor: 'var(--accent)', color: '#fff', duration: 0.35, yoyo: true, repeat: 1, delay: idx * 0.08, ease: 'power1.inOut'
                  });
              });
          });
    }

    const hidePreloader = () => {
        gsap.to(preloader, { 
            opacity: 0, 
            duration: 0.8, 
            onComplete: () => {
                preloader.style.display = 'none';
                startIntro();
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

    // --- 语言切换器 ---
    const languageSwitcher = document.getElementById('language-switcher');
    const langEnElements = document.querySelectorAll('.lang-en');
    const langZhElements = document.querySelectorAll('.lang-zh');
    const cvButtons = document.querySelectorAll('a.btn[data-cv-en]');

    // --- Mini Terminal refs (moved earlier to avoid temporal dead zone) ---
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalCaret = document.getElementById('terminal-caret');
    let typerTimer = null;

    const setLanguage = (lang) => {
        if (lang === 'zh') {
            langEnElements.forEach(el => el.style.display = 'none');
            langZhElements.forEach(el => el.style.display = 'inline');
            languageSwitcher.innerHTML = 'EN';
            localStorage.setItem('language', 'zh');
            cvButtons.forEach(btn => btn.setAttribute('href', btn.getAttribute('data-cv-zh')));
        } else {
            langZhElements.forEach(el => el.style.display = 'none');
            langEnElements.forEach(el => el.style.display = 'inline');
            languageSwitcher.innerHTML = '中';
            localStorage.setItem('language', 'en');
            cvButtons.forEach(btn => btn.setAttribute('href', btn.getAttribute('data-cv-en')));
        }
        // sync terminal text if present
        if (terminalOutput) {
            const L = localStorage.getItem('language') || 'en';
            terminalOutput.textContent = (L === 'zh') ? '可用命令: help, skills, about' : 'Commands: help, skills, about';
        }
        feather.replace();
    };

    const savedLanguage = localStorage.getItem('language');
    // 初始隐藏中文, 避免闪烁；根据本地存储设置语言
    langZhElements.forEach(el => el.style.display = 'none');
    setLanguage(savedLanguage || 'en');

    languageSwitcher.addEventListener('click', () => {
        const currentLang = localStorage.getItem('language') || 'en';
        setLanguage(currentLang === 'en' ? 'zh' : 'en');
    });


    // --- 滚动动画 ---
    gsap.utils.toArray('main li, .skill-category, .service-card').forEach(elem => {
        gsap.from(elem, {
            autoAlpha: 0,
            y: 50,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: elem,
                start: 'top 90%',
                toggleActions: 'play none none none',
                once: true
            }
        });
    });

    // --- 快速导航 --- 
    const quickNavLinks = document.querySelectorAll('.quick-nav a');
    const mainSections = document.querySelectorAll('main section.collapsible-section, #about');
    
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

    // 点击后给导航提供即时选中反馈（即使滚动尚未到达）
    quickNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            quickNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
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
    const interactiveElements = document.querySelectorAll('a, button, .collapsible-header, .theme-switcher, .language-switcher, .tags span, .project-tags .tag, .service-card');

    document.addEventListener('mousemove', e => {
        cursor.setAttribute('style', `top: ${e.clientY}px; left: ${e.clientX}px;`);
    });
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });

    // --- 标题下划线动画 + h2逐字显现 ---
    gsap.utils.toArray('h2').forEach(h2 => {
        ScrollTrigger.create({
          trigger: h2,
          start: 'top 90%',
          onEnter: () => {
            h2.classList.add('is-visible');
            animateLettersIn(h2);
          },
          once: true
        });
    });

    // --- 页头背景幻灯片 ---
    const bgImages = gsap.utils.toArray('.header-bg-slider img');
    let currentIndex = 0;

    gsap.set(bgImages[0], { autoAlpha: 1 });

    function crossfade() {
        gsap.to(bgImages[currentIndex], { autoAlpha: 0, duration: 1.5, ease: 'power2.inOut' });
        currentIndex = (currentIndex + 1) % bgImages.length;
        gsap.to(bgImages[currentIndex], { autoAlpha: 1, duration: 1.5, ease: 'power2.inOut' });
        gsap.delayedCall(3, crossfade);
    }

    gsap.delayedCall(3, crossfade);

    // --- Mouse follow: header parallax (desktop only) ---
    if (window.matchMedia('(pointer:fine)').matches) {
      const headerEl = document.querySelector('header');
      const parallaxTargets = gsap.utils.toArray('.header-bg-slider img');
      const maxShift = 0.35; // 限制鼠标影响，避免位移过大
      // 初始保持居中，无静态位移
      gsap.set(parallaxTargets, { x: 0 });
      headerEl?.addEventListener('mousemove', (e) => {
        const rect = headerEl.getBoundingClientRect();
        // 以“视觉中心”为零点：桌面端向右补偿左侧目录的一半宽度(~110px)
        const desktop = window.matchMedia('(min-width: 992px)').matches;
        const compensation = desktop ? 110 : 0; // 与 main 左侧 padding 对齐
        const cx = ((e.clientX - rect.left) - (rect.width/2 + compensation)) / rect.width; // 已以视觉中心为基准
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        // clamp parallax to prevent background from escaping overlay edges
        const clamp = (v, m) => Math.max(-m, Math.min(m, v));
        parallaxTargets.forEach((img, i) => {
          const depth = (i + 1) * 12;
          gsap.to(img, { x: clamp(cx, maxShift) * depth, y: clamp(cy, maxShift) * depth, scale: 1.04, transformOrigin: 'center', duration: 0.25, overwrite: true });
        });
      });

      // also reset parallax when leaving header to avoid residual offset
      headerEl?.addEventListener('mouseleave', () => {
        parallaxTargets.forEach((img) => {
          gsap.to(img, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' });
        });
      });

      // 当页面发生滚动时，逐步衰减并复位背景，避免滚动后下沿脱离蒙版的视觉问题
      let scrollTween = null;
      window.addEventListener('scroll', () => {
        if (scrollTween && scrollTween.isActive()) return;
        scrollTween = gsap.to(parallaxTargets, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
      }, { passive: true });

      // Click effects (confetti)
      const effectsCanvas = document.getElementById('click-effects');
      const ectx = effectsCanvas?.getContext('2d');
      let particles = [];
      let ripples = [];
      function resizeEffects(){
        if (!effectsCanvas) return;
        effectsCanvas.width = window.innerWidth * window.devicePixelRatio;
        effectsCanvas.height = window.innerHeight * window.devicePixelRatio;
        effectsCanvas.style.width = '100%';
        effectsCanvas.style.height = '100%';
      }
      resizeEffects();
      window.addEventListener('resize', resizeEffects);

      // 生成渐变（跟随主题颜色）
      function makeThemeGradient(){
        if (!ectx || !effectsCanvas) return null;
        const g = ectx.createLinearGradient(0,0,effectsCanvas.width,0);
        // 读取 CSS 变量
        const styles = getComputedStyle(document.documentElement);
        const accent = styles.getPropertyValue('--accent').trim() || '#4f9cff';
        const highlight = styles.getPropertyValue('--highlight').trim() || '#ffb300';
        g.addColorStop(0, accent);
        g.addColorStop(1, highlight);
        return g;
      }
      let themeGradient = null;
      const refreshThemeGradient = () => { themeGradient = makeThemeGradient(); };
      refreshThemeGradient();

      function spawnConfetti(x, y){
        const count = 24;
        for (let i=0;i<count;i++){
          const angle = Math.random()*Math.PI*2;
          const speed = Math.random()*3 + 2;
          particles.push({
            x: x*window.devicePixelRatio,
            y: y*window.devicePixelRatio,
            vx: Math.cos(angle)*speed,
            vy: Math.sin(angle)*speed - 2,
            g: 0.08,
            life: 60 + Math.random()*30,
            color: themeGradient || ['#5B8CFF','#6BE6FF','#7CFFB2','#FFD66B','#FF8FAB','#B686FF'][i % 6]
          });
        }
        ripples.push({x:x*window.devicePixelRatio,y:y*window.devicePixelRatio,r:0,alpha:0.35});
      }

      // 移除英雄区粒子效果
      function tick(){
        if (!ectx || !effectsCanvas) return;
        ectx.clearRect(0,0,effectsCanvas.width,effectsCanvas.height);
        particles.forEach(p => {
          if (p.mode === 'seek'){
            const dx = p.tx - p.x, dy = p.ty - p.y;
            p.vx = (p.vx + dx*0.02) * p.friction;
            p.vy = (p.vy + dy*0.02) * p.friction;
            p.x += p.vx; p.y += p.vy; p.life -= 1;
            ectx.fillStyle = p.color; ectx.globalAlpha = 1;
            ectx.beginPath(); ectx.arc(p.x, p.y, p.size || 3, 0, Math.PI*2); ectx.fill();
          } else {
            p.vy += (p.g || 0);
            p.x += p.vx; p.y += p.vy; p.life -= 1;
            ectx.fillStyle = p.color; ectx.globalAlpha = Math.max(p.life/90, 0);
            ectx.fillRect(p.x, p.y, 6, 3);
          }
        });
        particles = particles.filter(p => p.life > 0);
        // ripple rings
        ripples.forEach(r => {
          r.r += 6; r.alpha *= 0.94;
          ectx.strokeStyle = 'rgba(255,255,255,'+r.alpha+')';
          ectx.lineWidth = 2;
          ectx.beginPath();
          ectx.arc(r.x, r.y, r.r, 0, Math.PI*2);
          ectx.stroke();
        });
        ripples = ripples.filter(r => r.alpha > 0.02);
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      document.addEventListener('click', (ev)=>{
        // avoid clicks on header controls causing double spawn; always allow visually
        spawnConfetti(ev.clientX, ev.clientY);
      });

      // 英雄区粒子效果已移除

      // 主题切换时更新渐变
      const observer = new MutationObserver(() => refreshThemeGradient());
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const rx = (e.clientY - r.top - r.height/2) / r.height * -12;
          const ry = (e.clientX - r.left - r.width/2) / r.width * 12;
          card.style.setProperty('--mx', `${e.clientX - r.left}px`);
          card.style.setProperty('--my', `${e.clientY - r.top}px`);
          gsap.to(card, { rotateX: rx, rotateY: ry, boxShadow: '0 18px 32px rgba(0,0,0,0.18)', transformPerspective: 1000, duration: 0.18, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, boxShadow: 'var(--shadow)', duration: 0.35, ease: 'power2.out' });
        });
      });
    }

    // --- 顶部滚动进度条 ---
    const progressBar = document.querySelector('.scroll-progress .bar');
    if (progressBar) {
        const updateProgress = () => {
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
            progressBar.style.width = `${p}%`;
        };
        updateProgress();
        document.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    }

    // --- 回到顶部按钮 ---
    const backTopBtn = document.getElementById('back-to-top');
    if (backTopBtn){
        const toggleBtn = () => {
            const y = window.scrollY || document.documentElement.scrollTop;
            if (y > 500) backTopBtn.classList.add('visible'); else backTopBtn.classList.remove('visible');
        };
        toggleBtn();
        document.addEventListener('scroll', toggleBtn, { passive: true });
        backTopBtn.addEventListener('click', () => gsap.to(window, { duration: 0.8, scrollTo: {y: 0}, ease: 'power2.out' }));
    }

    // --- 磁性按钮（CTA 与社交、Pills 轻微跟随）---
    const magneticTargets = gsap.utils.toArray('.btn, .pill, header .social a');
    magneticTargets.forEach(el => {
        const strength = el.classList.contains('btn') ? 10 : 6;
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width/2)) / (r.width/2);
            const dy = (e.clientY - (r.top + r.height/2)) / (r.height/2);
            gsap.to(el, { x: dx*strength, y: dy*strength, duration: 0.18, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.3 }));
    });

    // --- Mini Terminal playful interaction ---
    function typeText(el, text, speed = 70) {
        if (!el) return;
        if (typerTimer) clearInterval(typerTimer);
        el.textContent = '';
        let i = 0;
        typerTimer = setInterval(() => {
            el.textContent += text[i] || '';
            i++;
            if (i >= text.length) { clearInterval(typerTimer); typerTimer = null; }
        }, speed);
    }

    function showHelp(lang) {
        if (!terminalOutput) return;
        terminalOutput.textContent = lang === 'zh' 
          ? '可用命令: help, skills, about' 
          : 'Commands: help, skills, about';
    }

    function showSkills(lang) {
        if (!terminalOutput) return;
        terminalOutput.textContent = lang === 'zh' 
          ? '视觉/ROS/自动化/数据分析' 
          : 'Vision / ROS / Automation / Data Analysis';
    }

    if (terminalInput) {
      const lang = localStorage.getItem('language') || 'en';
      typeText(terminalInput, 'help');
      setTimeout(() => showHelp(lang), 1200);

      document.getElementById('mini-terminal')?.addEventListener('click', () => {
          const L = localStorage.getItem('language') || 'en';
          const current = terminalInput.textContent.trim();
          if (current === 'help') {
              typeText(terminalInput, 'skills');
              setTimeout(() => showSkills(L), 900);
          } else if (current === 'skills') {
              typeText(terminalInput, 'about');
              setTimeout(() => {
                  if (terminalOutput) terminalOutput.textContent = (L === 'zh')
                    ? '自动化初学者。'
                    : 'Automation beginner.';
              }, 900);
          } else {
              typeText(terminalInput, 'help');
              setTimeout(() => showHelp(L), 1200);
          }
      });
    }

    // 初始化 Feather 图标
    feather.replace();
});