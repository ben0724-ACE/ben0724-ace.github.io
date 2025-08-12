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
    // 初始隐藏中文, 避免闪烁
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
      headerEl?.addEventListener('mousemove', (e) => {
        const rect = headerEl.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
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
            color: ['#5B8CFF','#6BE6FF','#7CFFB2','#FFD66B','#FF8FAB','#B686FF'][i % 6]
          });
        }
        ripples.push({x:x*window.devicePixelRatio,y:y*window.devicePixelRatio,r:0,alpha:0.35});
      }
      function tick(){
        if (!ectx || !effectsCanvas) return;
        ectx.clearRect(0,0,effectsCanvas.width,effectsCanvas.height);
        particles.forEach(p => {
          p.vy += p.g;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 1;
          ectx.fillStyle = p.color;
          ectx.globalAlpha = Math.max(p.life/90, 0);
          ectx.fillRect(p.x, p.y, 6, 3);
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