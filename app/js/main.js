import { FlyingManager } from "./flying.js";
import { type, untype } from "./typer.js";
import { delay } from './delay.js';

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

async function fade_buttons() {
    const button1 = document.getElementById('main-button-1');
    const button2 = document.getElementById('main-button-2');
    const button3 = document.getElementById('main-button-3');
    const button4 = document.getElementById('main-button-4');

    await delay(1500);
    button1.style.opacity = 1;
    await delay(300);
    button2.style.opacity = 1;
    await delay(300);
    button3.style.opacity = 1;
    await delay(300);
    button4.style.opacity = 1;
}

function set_buttons() {
    const button_ids = ['main-button-1', 'main-button-2', 'main-button-3', 'main-button-4'];
    const icon_ids = ['main-button-1-icon', 'main-button-2-icon', 'main-button-3-icon', 'main-button-4-icon'];

    const inactive_color = '#ffffffff';
    let active_colors = ['#d11c4bff', '#d17f1cff', '#42a022ff', '#2262a0ff'];

    for (let button of button_ids) {
        document.getElementById(button).style.color = inactive_color;
        document.getElementById(button).style.transition = '300ms ease-in-out';
    }

    for (let icon of icon_ids) {
        document.getElementById(icon).style.fill = inactive_color;
        document.getElementById(icon).style.transition = '300ms ease-in-out';
    }

    for (let i = 0; i < button_ids.length; i++) {
        document.getElementById(button_ids[i]).addEventListener('pointerover', () => {
            document.getElementById(button_ids[i]).style.backgroundColor = '#ffffffff';
            document.getElementById(button_ids[i]).style.color = active_colors[i];
            document.getElementById(icon_ids[i]).style.fill = active_colors[i];
        });
        document.getElementById(button_ids[i]).addEventListener('pointerout', () => {
            document.getElementById(button_ids[i]).style.backgroundColor = '#ffffff00';
            document.getElementById(button_ids[i]).style.color = inactive_color;
            document.getElementById(icon_ids[i]).style.fill = inactive_color;
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

function main() {
    //set_buttons();
    flying_manager();
    //typing_animation();
    //fade_buttons();
}

main();