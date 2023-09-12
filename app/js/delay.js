export function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

export function delay_fn(fn, ms) {
    let timer_id;
    return function (event) {
        if (!timer_id) {
            timer_id = setTimeout(() => {
                fn(ms);
                timer_id = null;
            }, delay);
        }
    };
}
