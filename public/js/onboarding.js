document.addEventListener('DOMContentLoaded', (event) => {
    let installPrompt = null;
    const installButton = document.querySelector("#install");

    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        installPrompt = event;
        installButton.removeAttribute("hidden");
    });

    installButton.addEventListener("click", async () => {
        if (!installPrompt) {
            return;
        }
        await installPrompt.prompt();
        disableInAppInstallPrompt();
    });

    function disableInAppInstallPrompt() {
        installPrompt = null;
        installButton.setAttribute("hidden", "");
    }

    window.addEventListener("appinstalled", () => {
        disableInAppInstallPrompt();
    });

    if (localStorage.getItem('onboardingComplete') !== 'true') { // onboarding incomplete
        document.querySelector('button[data-page-id="onboarding"]').click();
        localStorage.setItem('onboardingComplete', 'true');
    }
})