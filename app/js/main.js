import { FlyingManager } from "./flying.js";
import { type, untype } from "./typer.js";
import { delay, safe_fetch, safe_fetch_inner } from './util.js';

const data = await safe_fetch('/static/data/data.json', true);


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

async function setup_buttons() {
    const button_ids = ['main-button-1', 'main-button-2', 'main-button-3', 'main-button-4'];

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
            await safe_fetch_inner(data.buttons.list[i].href, 'main-box');
        });
    }

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

    await delay(1200);
    for (let i = 0; i < button_ids.length; i++) {
        await delay(300);
        document.getElementById(button_ids[i]).style.opacity = 1;
    }
}

async function main() {
    const fl = new FlyingManager();
    fl.setup_canvas('canvas');
    fl.setup_sprites(data.flying.sprites);
    fl.launch_animation();

    typing_animation();
    setup_buttons();
}

main();