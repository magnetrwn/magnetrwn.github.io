export function type(element, delay, text) {
    return new Promise((resolve) => {
        let i = 0;
        const interval = setInterval(() => {
            element.innerHTML += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                resolve();
            }
        }, delay);
    });
}

export function untype(element, delay, chars = -1) {
    return new Promise((resolve) => {
        const text = element.innerHTML;
        let i = text.length - 1;
        const interval = setInterval(() => {
            element.innerHTML = text.substring(0, i);
            if (i <= 0 || chars == 0) {
                clearInterval(interval);
                resolve();
            }
            i--;
            chars--;
        }, delay);
    });
}
