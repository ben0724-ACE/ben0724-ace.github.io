document.addEventListener('DOMContentLoaded', () => {
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

}); 