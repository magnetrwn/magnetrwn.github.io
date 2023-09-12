import { FlyingManager } from "./flying.js";
import { type, untype } from "./typer.js";
import { delay } from './delay.js';

const data = await fetch('/static/data/data.json')
        .then((response) => {
            if (!response.ok)
                throw new Error('Failed to fetch data.json');
            return response.json();
        })
        .catch((error) => console.error(error));

const button_ids = ['main-button-1', 'main-button-2', 'main-button-3', 'main-button-4'];


function flying_manager() {
    const fl = new FlyingManager();

    fl.setup_canvas('canvas');
    fl.setup_sprites(data.flying.sprites);

    fl.launch_animation();
}

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

async function fade_buttons() {
    await delay(1200);
    for (let i = 0; i < button_ids.length; i++) {
        await delay(300);
        document.getElementById(button_ids[i]).style.opacity = 1;
    }
}

async function set_buttons() {
    for (let i = 0; i < button_ids.length; i++) {
        document.getElementById(button_ids[i]).innerHTML =
            data.buttons.list[i].text
            + '\n'
            + await fetch(data.buttons.list[i].icon)
                .then((response) => {
                    if (!response.ok)
                        throw new Error('Failed to fetch some button icon.');
                    return response.text();
                })
                .catch((error) => console.error(error));

        document.getElementById(button_ids[i]).style.color = data.buttons.all.inactive;
        document.getElementById(button_ids[i]).style.transition = '300ms ease-in-out';

        document.getElementById(data.buttons.list[i].id).style.fill = data.buttons.all.inactive;
        document.getElementById(data.buttons.list[i].id).style.transition = '300ms ease-in-out';

        document.getElementById(button_ids[i]).addEventListener('pointerover', () => {
            document.getElementById(button_ids[i]).style.backgroundColor = data.buttons.all.bg_active;
            document.getElementById(button_ids[i]).style.color = data.buttons.list[i].color;
            document.getElementById(data.buttons.list[i].id).style.fill = data.buttons.list[i].color;
        });
        document.getElementById(button_ids[i]).addEventListener('pointerout', () => {
            document.getElementById(button_ids[i]).style.backgroundColor = data.buttons.all.bg_inactive;
            document.getElementById(button_ids[i]).style.color = data.buttons.all.inactive;
            document.getElementById(data.buttons.list[i].id).style.fill = data.buttons.all.inactive;
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
}

async function main() {
    set_buttons();
    fade_buttons();
    flying_manager();
    typing_animation();
}

main();