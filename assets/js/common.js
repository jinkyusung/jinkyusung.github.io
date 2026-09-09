(function () {
    const root = document.documentElement;
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');

    function savedTheme() {
        try {
            return localStorage.getItem('site-theme');
        } catch (error) {
            return null;
        }
    }

    function applyTheme(theme, remember) {
        root.setAttribute('data-theme', theme);
        root.style.colorScheme = theme;
        themeOptions.forEach(function (option) {
            option.setAttribute(
                'aria-pressed',
                String(option.dataset.themeValue === theme)
            );
        });

        if (remember) {
            try {
                localStorage.setItem('site-theme', theme);
            } catch (error) {
                return;
            }
        }
    }

    applyTheme(root.getAttribute('data-theme'), false);

    themeOptions.forEach(function (option) {
        option.addEventListener('click', function () {
            applyTheme(option.dataset.themeValue, true);
        });
    });

    function followSystemTheme(event) {
        if (!savedTheme()) {
            applyTheme(event.matches ? 'dark' : 'light', false);
        }
    }

    if (themeMedia.addEventListener) {
        themeMedia.addEventListener('change', followSystemTheme);
    } else {
        themeMedia.addListener(followSystemTheme);
    }

    const menuButton = document.querySelector('.navbar-toggler');
    const menu = document.querySelector('#navbarResponsive');

    function setMenuOpen(open) {
        menu.classList.toggle('show', open);
        menuButton.setAttribute('aria-expanded', String(open));
    }

    menuButton.addEventListener('click', function () {
        setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    menu.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            setMenuOpen(false);
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false);
            menuButton.focus();
        }
    });

    const navbarBrand = document.querySelector('.navbar-brand');
    const profileName = document.querySelector('#profile-name-container');

    function updateNavbarBrand() {
        navbarBrand.classList.toggle(
            'show-name',
            !profileName || profileName.getBoundingClientRect().bottom < 0
        );
    }

    updateNavbarBrand();
    window.addEventListener('scroll', updateNavbarBrand, { passive: true });
}());
