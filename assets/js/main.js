import { FlyingManager } from "./flying.js";
import bg from "../bg/bg.json" assert { type: "json" };

async function main() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const fl = new FlyingManager();
    fl.setup_canvas('canvas');
    fl.setup_sprites(bg.sprites);
    fl.launch_animation();
}

main();