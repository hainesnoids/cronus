document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('onboardingComplete') !== 'true') { // onboarding incomplete
        document.querySelector('button[data-page-id="onboarding"]').click();
        localStorage.setItem('onboardingComplete', 'true');
    }
})