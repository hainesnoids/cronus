let gestureHook = {};

let swipeRootX;
const swipeThreshold = 100;
let isSwiping = false;

// Function to handle touch start
function handleTouchStart(event) {
    const touch = event.touches[0];
    swipeRootX = touch.clientX;
    isSwiping = true;
}

// Function to handle touch move
function handleTouchMove(event) {
    if (!isSwiping) return;

    const touch = event.touches[0];
    const distance = touch.clientX - swipeRootX;

    // swipe feedback not yet possible due to technical challenges
}

// Function to handle touch end
function handleTouchEnd(event) {
    if (!isSwiping) return;

    const touch = event.changedTouches[0];
    const distance = touch.clientX - swipeRootX;

    if (swipeRootX < 50 && distance > swipeThreshold) {
        // console.log("left swipe");
        DocuPager.dispatchEvent(new CustomEvent('back-gesture'));
    }

    isSwiping = false;
}

window.addEventListener('touchstart', handleTouchStart);
window.addEventListener('touchmove', handleTouchMove);
window.addEventListener('touchend', handleTouchEnd);

window.gestureHook = gestureHook;
