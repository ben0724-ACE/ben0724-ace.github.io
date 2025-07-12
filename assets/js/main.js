document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- Pre-loader ---
    const preloader = document.querySelector('.preloader');
    const hidePreloader = () => {
        // Use GSAP for a smoother fade out
        gsap.to(preloader, { 
            opacity: 0, 
            duration: 0.8, 
            onComplete: () => {
                preloader.style.display = 'none';
            }
        });
    };

    // This robustly handles the preloader, regardless of caching or network speed.
    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }

    // --- Theme Switcher ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    // Function to set the theme
    const setTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeSwitcher.innerHTML = feather.icons.sun.toSvg();
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeSwitcher.innerHTML = feather.icons.moon.toSvg();
            localStorage.setItem('theme', 'light');
        }
    };

    // Load saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }

    // Switch theme on click
    themeSwitcher.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // --- Scroll Animations ---
    const sections = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the section is visible
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Collapse Functionality ---
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');

    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.collapse-icon');

            if (content.classList.contains('is-expanded')) {
                content.classList.remove('is-expanded');
                header.classList.add('collapsed');
            } else {
                content.classList.add('is-expanded');
                header.classList.remove('collapsed');
            }
            feather.replace(); // Re-render feather icons after collapse/expand
        });
    });

    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor');

}); 