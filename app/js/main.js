import { FlyingManager } from "./flying.js";
import { type, untype } from "./typer.js";
import { delay, safe_fetch, safe_fetch_inner } from './util.js';

const data = await safe_fetch('/static/data/data.json', true);
const button_ids = ['main-button-1', 'main-button-2', 'main-button-3', 'main-button-4'];


async function typing_animation() {
    const title = document.getElementById('main-title');
    const subtitle = document.getElementById('main-subtitle');

    await delay(500);
    await type(title, 75, data.typer.title);
    await delay(500);

    let i = 0;
    while (true) {
        subtitle.style.color = data.typer.colors.cli;
        subtitle.innerHTML = data.typer.leading;
        await delay(500);
        await type(subtitle, 75, data.typer.commands[i][0]);
        await delay(1500);
        subtitle.style.color = data.typer.colors.transition;
        subtitle.innerHTML = data.typer.commands[i][1];
        await delay(75);
        subtitle.style.color = data.typer.colors.regular;
        await delay(4000);
        await untype(subtitle, 50);
        await delay(2000);
        i = (i + 1) % data.typer.commands.length;
    }
}

async function fetch_buttons() {
    for (let i = 0; i < button_ids.length; i++) {
        const button = document.getElementById(button_ids[i]);

        button.innerHTML =
            data.buttons.list[i].text
            + '\n'
            + await safe_fetch(data.buttons.list[i].icon);

        const icon = document.getElementById(data.buttons.list[i].id);

        button.style.color = data.buttons.all.inactive;
        button.style.transition = '300ms ease-in-out';

        icon.style.fill = data.buttons.all.inactive;
        icon.style.transition = '300ms ease-in-out';

        button.addEventListener('pointerover', () => {
            button.style.backgroundColor = data.buttons.all.bg_active;
            button.style.color = data.buttons.list[i].color;
            icon.style.fill = data.buttons.list[i].color;
        });

        button.addEventListener('pointerout', () => {
            button.style.backgroundColor = data.buttons.all.bg_inactive;
            button.style.color = data.buttons.all.inactive;
            icon.style.fill = data.buttons.all.inactive;
        });

        button.addEventListener('pointerdown', async () => {
            await change_animation(data.buttons.list[i].href);
        });
    }
}

async function setup_buttons() {
    await fetch_buttons();

    document.getElementById('main-content').addEventListener('pointerdown', (event) => {
        if (event.target.id === 'back-button')
            goto_top();
    });

    document.getElementById('toggle-main-box').addEventListener('pointerdown', async () => {
        const main_box = document.getElementById('main-box');
        main_box.style.transition = 'opacity 300ms ease-in-out, visibility 0.3s ease-in-out';

        if (main_box.style.opacity == 1) {
            main_box.style.opacity = 0;
            main_box.style.visibility = 'hidden';
            await delay(300);
            main_box.classList.toggle('hidden');

        } else {
            main_box.classList.toggle('hidden');
            await delay(10);
            main_box.style.opacity = 1;
            main_box.style.visibility = 'visible';
        }
    });
}

async function button_animation() {
    await delay(1200);
    for (let i = 0; i < button_ids.length; i++) {
        await delay(200);
        try {
            document.getElementById(button_ids[i]).style.opacity = 1;
        } catch (e) {}
    }
}

async function change_animation(url) {
    await delay(300);
    await untype(document.getElementById('main-title'), 20);
    document.getElementById('main-title').style.opacity = 0;
    await delay(300);
    await untype(document.getElementById('main-subtitle'), 20);
    document.getElementById('main-subtitle').style.opacity = 0;
    document.getElementById('main-buttons').style.transition = 'opacity 300ms ease-in-out';
    document.getElementById('main-buttons').style.opacity = 0;
    await delay(1000);
    await safe_fetch_inner(url, 'main-content');
    document.getElementById('back-button').innerHTML = await safe_fetch('/app/html/icons/close.html');
    document.getElementById('back-button').addEventListener('pointerdown', goto_top);
}

// TODO: fix the multiple calling of this function, then remove the lock
let goto_top_lock = false;
async function goto_top() {
    if (goto_top_lock)
        return;
    goto_top_lock = true;

    await safe_fetch_inner(data.top_href, 'main-content');
    await fetch_buttons();
    button_animation();
    typing_animation();

    goto_top_lock = false;
}

async function main() {
    const fl = new FlyingManager();
    fl.setup_canvas('canvas');
    fl.setup_sprites(data.flying.sprites);
    fl.launch_animation();

    await safe_fetch_inner(data.top_href, 'main-content');
    await fetch_buttons();
    setup_buttons();
    button_animation();
    typing_animation();
}

main();