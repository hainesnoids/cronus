// this script manages light/dark mode and PWA detection, injecting pwa.css if so.

function pageColorScheme() {
    determineColorScheme();
    if (window.matchMedia) {
        const mql = window.matchMedia("(prefers-color-scheme: light)");
        const mqd = window.matchMedia("(prefers-color-scheme: dark)");
        mql.addEventListener('change', colorSchemeMediaQuery);
        mqd.addEventListener('change', colorSchemeMediaQuery);
        function colorSchemeMediaQuery() {
            determineColorScheme();
        }
    }

}
function determineColorScheme() {
    let colorScheme = config['colorscheme'];
    if (!colorScheme) {
        config.colorscheme = 'auto';
        setConfig();
    }
    switch (colorScheme) {
        case 'auto': {
            // use media queries to determine the theme to use
            // document.body.classList.add(`color-scheme-auto`);
            if (window.matchMedia('(prefers-color-scheme: light)').matches) { // light mode
                setColorScheme('light');
            } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) { // light mode
                setColorScheme('dark');
            }
            break;
        }
        case 'light': {
            setColorScheme(colorScheme);
            break;
        }
        case 'dark': {
            setColorScheme(colorScheme);
            break;
        }
    }
}

function setColorScheme(targetColorScheme) {
    document.body.classList.forEach((itm) => {
        if (/^color-scheme-/.test(itm)) {
            document.body.classList.remove(itm);
        }
    })
    document.body.classList.add(`color-scheme-${targetColorScheme}`);
    const bgPalette = window.getComputedStyle(document.body).getPropertyValue('--bg-dark');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', bgPalette);
}

function saveColorScheme(targetColorScheme) {
    config.colorscheme = targetColorScheme;
    setConfig();
    determineColorScheme();
}

document.addEventListener('DOMContentLoaded', pageColorScheme);
