document.addEventListener('DOMContentLoaded', () => {
    let installPrompt = null;
    const installButton = document.querySelector("#install");
    if (installButton) {
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
    }
})