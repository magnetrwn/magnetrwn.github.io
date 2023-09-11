import { FlyingManager } from "./flying.js";
import { type, untype } from "./typer.js";

function flying_manager() {
    const fl = new FlyingManager();

    fl.setup_canvas('canvas');
    fl.setup_sprites([
        'static/images/2572497.png',
        'static/images/2572724.png',
        'static/images/2807340.png',
        'static/images/2809291.png',
        'static/images/2878889.png',
        'static/images/5968544.png',
        'static/images/amogus-sm.png',
        'static/images/artificial-intelligence.png',
        'static/images/cloud.png',
        'static/images/gaming-pad.png',
        'static/images/idea-bulb.png',
        'static/images/idea.png',
        'static/images/layer_6680857.png',
        'static/images/setting.png',
        'static/images/usb_6540526.png',
    ]);

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
    const commands = [
        ['cat /var/www/what_s_this.txt', 'This is my developer portfolio!'],
        ['scp user@server:/who_am_i.txt .', 'I\'m a full-stack developer!'],
        ['git commit -m \'New Project.\'', 'Let\'s start your new project!'],
        ['npm install -g coffee', 'Fueled by caffeine!'],
        ['python3 -m build', 'Let\'s build everything you need!'],
        ['docker run -p 8080:80 app', 'Let\'s deploy your app!'],
        ['git push origin main', 'Let\'s publish your work!'],
    ];

    await type(title, 75, '@magnetrwn')
    await delay(500);

    let i = 0;
    while (true) {
        subtitle.style.color = '#aaaaaaff';
        subtitle.innerHTML = '<i>$</i> ';
        await delay(500);
        await type(subtitle, 75, commands[i][0]);
        await delay(1500);
        subtitle.style.color = '#555555ff';
        subtitle.innerHTML = commands[i][1];
        await delay(75);
        subtitle.style.color = '#ffffffff';
        await delay(4000);
        await untype(subtitle, 50);
        await delay(2000);
        i = (i + 1) % commands.length;
    }
}

function main() {
    document.getElementById('toggle-main-box').addEventListener('pointerdown', () => {
        const main_box = document.getElementById('main-box');
        main_box.style.opacity = 1 - main_box.style.opacity;
    });

    flying_manager();
    typing_animation();
}

main();