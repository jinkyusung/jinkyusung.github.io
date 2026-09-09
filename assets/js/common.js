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

    const navbarBrand = document.querySelector('.navbar-brand');
    const siteNavigation = document.querySelector('.site-navigation');
    const pageLinks = siteNavigation.querySelectorAll('.nav-link');
    const pageCache = new Map();

    function normalizedPath(url) {
        return new URL(url, window.location.href).pathname.replace(/\/$/, '') || '/';
    }

    function setNavigationState(url) {
        const activePath = normalizedPath(url);
        siteNavigation.classList.toggle('is-publication-active', activePath.endsWith('/publications'));

        pageLinks.forEach(function (link) {
            const isCurrent = normalizedPath(link.href) === activePath;
            link.parentElement.classList.toggle('active', isCurrent);
            if (isCurrent) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function fetchPage(url) {
        const destination = new URL(url, window.location.href).href;
        if (!pageCache.has(destination)) {
            pageCache.set(destination, fetch(destination).then(function (response) {
                if (!response.ok) {
                    throw new Error('Page request failed');
                }
                return response.text();
            }));
        }
        return pageCache.get(destination);
    }

    function renderPage(url, pushHistory) {
        const destination = new URL(url, window.location.href);
        const main = document.querySelector('main');

        setNavigationState(destination.href);
        main.setAttribute('aria-busy', 'true');

        return fetchPage(destination.href).then(function (html) {
            const nextDocument = new DOMParser().parseFromString(html, 'text/html');
            const nextMain = nextDocument.querySelector('main');
            const nextIcon = nextDocument.querySelector('link[rel="icon"]');
            const currentIcon = document.querySelector('link[rel="icon"]');

            if (!nextMain) {
                throw new Error('Page content is missing');
            }

            main.innerHTML = nextMain.innerHTML;
            document.title = nextDocument.title;
            if (nextIcon && currentIcon) {
                currentIcon.setAttribute('href', nextIcon.getAttribute('href'));
            }
            if (pushHistory) {
                window.history.pushState({}, '', destination.href);
            }
            window.scrollTo(0, 0);
            updateNavbarBrand();
        }).catch(function () {
            window.location.assign(destination.href);
        }).finally(function () {
            main.removeAttribute('aria-busy');
        });
    }

    pageLinks.forEach(function (link) {
        link.addEventListener('mouseenter', function () {
            fetchPage(link.href);
        }, { once: true });
        link.addEventListener('focus', function () {
            fetchPage(link.href);
        }, { once: true });
        link.addEventListener('click', function (event) {
            const modifiedClick = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
            if (modifiedClick) {
                return;
            }

            event.preventDefault();
            if (normalizedPath(link.href) !== normalizedPath(window.location.href)) {
                renderPage(link.href, true);
            }
        });
    });

    window.addEventListener('popstate', function () {
        renderPage(window.location.href, false);
    });

    function updateNavbarBrand() {
        const profileName = document.querySelector('#profile-name-container');
        navbarBrand.classList.toggle(
            'show-name',
            !profileName || profileName.getBoundingClientRect().bottom < 0
        );
    }

    updateNavbarBrand();
    window.addEventListener('scroll', updateNavbarBrand, { passive: true });
}());
