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

  const fl = new FlyingManager();
  fl.setup_canvas("bg-canvas");
  fl.setup_sprites(bg.sprites);
  fl.launch_animation();
}

main();
