function pageInit() {
    const pageBounds = document.querySelector("pagebounds");
    const pages = document.querySelectorAll('pagebounds > page');
    for (let idx = 0; idx < pages.length; idx++) {
        let page = pages[idx];
        const pageId = page.getAttribute('id');
        const pageLinks = document.querySelectorAll(`button[data-page-id="${pageId}"]`);
        pageLinks.forEach((pageLink) => {
            pageLink.addEventListener('click', () => {
                const oldPage = document.querySelector('page.active');
                pages.forEach((p) => {
                    p.classList.remove('active');
                    p.style.display = '';
                    p.style.animation = '';
                });
                page.classList.add('active');
                if (oldPage && page.getAttribute('data-links-from')) { // links from page
                    oldPage.style.display = 'block';
                    oldPage.style.animation = 'page-out .5s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                    page.style.animation = 'page-in .5s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                }
                if (oldPage.getAttribute('data-links-from') === pageId) { // links to page
                    oldPage.style.display = 'block';
                    oldPage.style.animation = 'page-in-2 .5s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                    page.style.animation = 'page-out-2 .5s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                }
                document.querySelectorAll('.selected[data-page-id]').forEach((b) => {b.classList.remove('selected')});
                document.querySelectorAll(`*[data-page-id="${pageId}"]`).forEach((b) => {b.classList.add('selected')});
                //pageLink.classList.add('selected');
                //pageBounds.style.left = `-${idx}00%`;
                if (pageId === 'home') { // hardcoded re-rendering of home screen content when switching to the home screen
                    renderBuses().then();
                    getContractorNumber().then();
                }
            })
        })
        if (!pageLinks) {
            console.warn(`Page ${pageId} does not have a corresponding link to it.`);
        }
    }
}

document.addEventListener('DOMContentLoaded',pageInit);