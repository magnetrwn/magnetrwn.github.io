import { FlyingManager } from "./flying.js";

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

function main() {
    document.getElementById('toggle-main-box').addEventListener('pointerdown', () => {
        document.getElementById('main-box').classList.toggle('opacity-0');
    });
    flying_manager();
}

main();