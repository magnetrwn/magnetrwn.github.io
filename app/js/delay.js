export function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

export function delay_m(object, method, ms) {
    return function() {
        setTimeout(() => {
            method.apply(object, arguments);
        }, ms);
    };
}
