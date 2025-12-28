import { FlyingManager } from "./flying.js";

async function main() {
  document.getElementById("tail-wrapper").insertAdjacentElement("afterend", document.getElementById("tail-wrapper").querySelector("footer"));

  let canvas = document.getElementById("bg-canvas");
  
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "bg-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);
  }

  const bg = await fetch(new URL("../bg/bg.json", import.meta.url)).then(r => r.json());
  const rnd_imgs = bg.sprites.slice(1).sort(() => Math.random() - 0.5).slice(0, 10);
  const rnd_imgs_chosen = [bg.sprites[0], ...rnd_imgs];

  const fl = new FlyingManager();
  fl.setup_canvas("bg-canvas");
  fl.setup_sprites(rnd_imgs_chosen);
  fl.launch_animation();
}

main();
