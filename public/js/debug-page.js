document.addEventListener('DOMContentLoaded', () => {
    const debugPageButton = document.querySelector('#debug-hint');
    let health = 8
    function debugHit() {

    }
    if (debugPageButton) {
        debugPageButton.addEventListener('click', debugHit);
    } // not important if it does not exist, don't throw error
});
