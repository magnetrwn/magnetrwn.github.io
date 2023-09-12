import { FlyingManager } from "./flying.js";
import { type, untype } from "./typer.js";
const strings = await fetch('/static/data/strings.json')
    .then((response) => {
        if (!response.ok)
            throw new Error('Failed to fetch strings.json');
        return response.json();
    })
    .catch((error) => console.error(error));

function flying_manager() {
    const fl = new FlyingManager();

    fl.setup_canvas('canvas');
    fl.setup_sprites(strings.flying.sprites);

    fl.launch_animation();
}

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

async function typing_animation() {
    const title = document.getElementById('main-title');
    const subtitle = document.getElementById('main-subtitle');

    await delay(500);
    await type(title, 75, strings.typer.title);
    await delay(500);

    let i = 0;
    while (true) {
        subtitle.style.color = '#aaaaaaff';
        subtitle.innerHTML = strings.typer.leading;
        await delay(500);
        await type(subtitle, 75, strings.typer.commands[i][0]);
        await delay(1500);
        subtitle.style.color = '#555555ff';
        subtitle.innerHTML = strings.typer.commands[i][1];
        await delay(75);
        subtitle.style.color = '#ffffffff';
        await delay(4000);
        await untype(subtitle, 50);
        await delay(2000);
        i = (i + 1) % strings.typer.commands.length;
    }
}

function main() {
    document.getElementById('toggle-main-box').innerHTML = strings.toggle_main_box;
    document.getElementById('copyright').innerHTML = strings.copyright;

    document.getElementById('toggle-main-box').addEventListener('pointerdown', () => {
        const main_box = document.getElementById('main-box');
        main_box.style.opacity = 1 - main_box.style.opacity;
    });

    flying_manager();
    typing_animation();
}

main();