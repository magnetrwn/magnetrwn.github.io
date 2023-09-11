import { FlyingManager } from "./flying.js";

let flmgr = new FlyingManager();

flmgr.setup_canvas('canvas');
flmgr.setup_sprites([
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

flmgr.launch_animation();
