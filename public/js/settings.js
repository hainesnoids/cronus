let config = JSON.parse(localStorage.getItem('config')) ?? {};

document.addEventListener('DOMContentLoaded', () => {
    const settings = document.querySelector('settings');
    const options = document.querySelectorAll('setting');
    options.forEach((option) => {
        let input = option.querySelector('input') ?? option.querySelector('select');
        if (!input) return // kill if no input (no use)

        let configId = option.getAttribute('data-id');

        function setInput() {
            if (input.type === 'checkbox') {
                config[configId] = input.checked;
            } else if (input.type === ' number') {
                config[configId] = input.valueAsNumber;
            } else {
                config[configId] = input.value;
            }
            setConfig();
        }

        // see if the value exists
        if (config[configId]) {
            input.value = config[configId];
        } else {
            setInput();
        }

        input.addEventListener('change', setInput);
    });
});

function setConfig() {
    localStorage.setItem('config', JSON.stringify(config));
}