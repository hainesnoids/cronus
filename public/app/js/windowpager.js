document.addEventListener('DOMContentLoaded',() => {
    initWindowPager();
})

const windowPagerNextPageEvent = new Event('next-page');
const windowPagerPrevPageEvent = new Event('previous-page');
const windowPagerEndEvent = new Event('end');

function initWindowPager() {
    document.querySelectorAll('windowpager').forEach((rootPageObject) => {
        const contentAreaObject = rootPageObject.querySelector('windowpagercontentarea');
        contentAreaObject.style.width = `${contentAreaObject.querySelectorAll('windowpage').length}00%`;
        rootPageObject.querySelectorAll('windowpage').forEach((pageObject) => {
            // Next Page Buttons
            pageObject.querySelectorAll('button[purpose="next"]').forEach((button) => {
                button.addEventListener('click', () => {
                    rootPageObject.dispatchEvent(windowPagerNextPageEvent);
                })
            })
            // Prev Page Buttons
            pageObject.querySelectorAll('button[purpose="prev"]').forEach((button) => {
                button.addEventListener('click', () => {
                    rootPageObject.dispatchEvent(windowPagerPrevPageEvent);
                })
            })
            // Exit Buttons
            pageObject.querySelectorAll('button[purpose="exit"]').forEach((button) => {
                button.addEventListener('click', () => {
                    rootPageObject.dispatchEvent(windowPagerEndEvent);
                })
            })
        })
        function changePage(pg) {
            let page = Number(rootPageObject.getAttribute('data-page'));
            page += pg;
            page %= contentAreaObject.querySelectorAll('windowpage').length;
            const pageObject = rootPageObject.querySelectorAll('windowpage')[page];
            rootPageObject.setAttribute('data-page',String(page));
            contentAreaObject.style.left = `-${page * 100}%`
            // change box height to adapt to current page needs
            let contentHeight = Number(pageObject.getAttribute('data-height'));
            if (contentHeight) {
                rootPageObject.parentElement.style.height = `${contentHeight}px`;
            } else {
                rootPageObject.parentElement.style.height = ``;
            }
            // clear old timeouts if any
            if (clockInterval) {
                const nextPageButton = pageObject.querySelector('button[purpose="next"]');
                clearInterval(clockInterval);
                clearTimeout(clockTimeout);
                nextPageButton.querySelector('progressbar').remove();
                nextPageButton.querySelector('span.cooldown-countdown').remove();
            }
            if (pageObject.getAttribute('data-cooldown')) {
                dealWithPageCooldown(pageObject);
            }
        }
        let clockInterval,
            clockTimeout;
        function dealWithPageCooldown(pageObject) {
            // get the Next button
            const nextPageButton = pageObject.querySelector('button[purpose="next"]');
            // disable the button
            nextPageButton.setAttribute('disabled', 'true');
            nextPageButton.classList.add('cooldown');
            // create the progress bar and countdown indicators
            const progressBarWrapper = document.createElement('progressbar');
            const progressBar = document.createElement('progressindicator');
            progressBarWrapper.appendChild(progressBar);
            const countdown = document.createElement('span');
            countdown.classList.add('cooldown-countdown');
            nextPageButton.appendChild(countdown);
            nextPageButton.appendChild(progressBarWrapper);
            // prepare the countdown clock
            const totalTime = Number(pageObject.getAttribute('data-cooldown'));
            let time = totalTime;
            const updateInterval = 100;
            clockInterval = setInterval(() => {
                time -= updateInterval;
                countdown.innerHTML = ` (${Math.ceil(time / 1000)})`;
                progressBar.style.width = `${time / totalTime * 100}%`
            }, 100)
            clockTimeout = setTimeout(() => {
                countdown.remove();
                progressBarWrapper.remove();
                nextPageButton.removeAttribute('disabled');
                nextPageButton.classList.remove('cooldown');
                clearInterval(clockInterval);
            },totalTime)
        }
        rootPageObject.addEventListener('next-page',() => {
            changePage(1);
        });
        rootPageObject.addEventListener('previous-page',() => {
            changePage(-1);
        });
        rootPageObject.addEventListener('end', () => {
            rootPageObject.style.animation = 'windowpager-out 1s cubic-bezier(0.7, 0, 0.84, 0) forwards';
            setTimeout(() => {
                document.querySelector('.nav-item[data-page-id="home"]').click(); // this one's kinda funny
                document.querySelector('main').style.animation = 'windowpager-in 1s cubic-bezier(0.16, 1, 0.3, 1)';
            },1000)
        })
        // fix first page height
        const pageObject = rootPageObject.querySelectorAll('windowpage')[Number(rootPageObject.getAttribute('data-page'))];
        let contentHeight = Number(pageObject.getAttribute('data-height'));
        if (contentHeight) {
            rootPageObject.parentElement.style.height = `${contentHeight}px`;
        }
    })
}