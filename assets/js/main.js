import { FlyingManager } from "./flying.js";

let started = false;

async function initAndStart() {
  if (started) return;
  if (!document.body) return;

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

  started = true;
  fl.launch_animation();
}

function waitLoop() {
  initAndStart().catch((e) => {
    // don’t spam every frame
    if (!waitLoop._logged) {
      console.warn("BG init delayed:", e);
      waitLoop._logged = true;
    }
  });

  if (!started) 
    requestAnimationFrame(waitLoop);
}

requestAnimationFrame(waitLoop);
