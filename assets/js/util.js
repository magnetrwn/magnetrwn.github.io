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

export async function safe_fetch(url, json = false) {
    try {
        const response = await fetch(url);
        if (json)
            return response.json();
        else
            return response.text();
    } catch (error) {
        console.error(error);
    }
}

export async function safe_fetch_inner(url, element_id) {
    const element = document.getElementById(element_id);
    const data = await safe_fetch(url);
    element.innerHTML = data;
}