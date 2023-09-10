class FlyingObject {
    static init_id = 0;

    constructor(sprite, init_coords = [0, 0], linear_v = [0, 0], angular_v = 0) {
        this.id = FlyingObject.init_id;
        FlyingObject.init_id++;

        this.sprite = new Image();
        this.sprite.src = sprite;
        this.sprite.onerror = () => {
            console.warn(`Error loading sprite for FlyingObject (id: ${this.id}, sprite: ${this.sprite.src}).`);
        };

        this.coords = init_coords;
        this.linear_v = linear_v;
        this.angle = 0;
        this.angular_v = angular_v;
    }

    randomize(ctx) {
        this.coords[0] = Math.random() * ctx.canvas.width;
        this.coords[1] = Math.random() * ctx.canvas.height;
        this.linear_v = [Math.random() * 3 - 1.5, Math.random() * 3 - 1.5];
        if (this.linear_v[0] < 0.4 && this.linear_v[0] > -0.4)
            this.linear_v[0] = 0.4;
        if (this.linear_v[1] < 0.4 && this.linear_v[1] > -0.4)
            this.linear_v[1] = 0.4;
        this.angular_v = Math.random() * 0.1 - 0.05;
        if (this.angular_v < 0.01 && this.angular_v > -0.01)
            this.angular_v = 0.01;
    }

    click_attract(mouse_coords, strength = 0.08) {
        const dx = mouse_coords[0] - this.coords[0];
        const dy = mouse_coords[1] - this.coords[1];

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 250) {
            const incr_x = dx / dist;
            const incr_y = dy / dist;

            this.linear_v[0] += incr_x * strength;
            this.linear_v[1] += incr_y * strength;
        }
    }

    draw(ctx, wrap_pad = 48) {
        ctx.save();

        this.coords[0] += this.linear_v[0];
        this.coords[1] += this.linear_v[1];
        this.angle += this.angular_v;

        let has_wrapped_x = false;
        let has_wrapped_y = false;

        if (this.coords[0] < -wrap_pad) {
            this.coords[0] = ctx.canvas.width + wrap_pad;
            has_wrapped_x = true;
        } else if (this.coords[0] > ctx.canvas.width + wrap_pad) {
            this.coords[0] = -wrap_pad;
            has_wrapped_x = true;
        }

        if (this.coords[1] < -wrap_pad) {
            this.coords[1] = ctx.canvas.height + wrap_pad;
            has_wrapped_y = true;
        } else if (this.coords[1] > ctx.canvas.height + wrap_pad) {
            this.coords[1] = -wrap_pad;
            has_wrapped_y = true;
        }

        if (has_wrapped_x && Math.abs(this.linear_v[0]) > 1.5)
            this.linear_v[0] *= 0.8;
        if (has_wrapped_y && Math.abs(this.linear_v[1]) > 1.5)
            this.linear_v[1] *= 0.8;

        ctx.translate(this.coords[0], this.coords[1]);
        ctx.rotate(this.angle);
        ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2);

        ctx.restore();
    }
}

document.getElementById('canvas').width = window.innerWidth;
document.getElementById('canvas').height = window.innerHeight;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let mouse_pressed = false;
let mouse_coords = [0, 0];

function on_mouse_down(event) {
    mouse_pressed = true;
    const rect = canvas.getBoundingClientRect();
    mouse_coords[0] = event.clientX - rect.left;
    mouse_coords[1] = event.clientY - rect.top;
};

function on_mouse_up(event) {
    mouse_pressed = false;
};

function on_mouse_move(event) {
    if (mouse_pressed) {
        const rect = canvas.getBoundingClientRect();
        mouse_coords[0] = event.clientX - rect.left;
        mouse_coords[1] = event.clientY - rect.top;
    }
};

function delay_fn(fn, delay) {
    let timer_id;
    return function (event) {
        if (!timer_id) {
            timer_id = setTimeout(() => {
                fn(event);
                timer_id = null;
            }, delay);
        }
    };
}

document.addEventListener('mousedown', delay_fn(on_mouse_down, 16.6));
document.addEventListener('mouseup', delay_fn(on_mouse_up, 16.6));
document.addEventListener('mousemove', delay_fn(on_mouse_move, 16.6));

const obj_amount = 10;
const objects = [];
for (let i = 0; i < obj_amount; i++) {
    new_obj = new FlyingObject('amogus-sm.webp');
    new_obj.randomize(ctx);
    objects.push(new_obj);
}

function animate() {
    delay_fn(() => {
        document.getElementById('canvas').width = window.innerWidth;
        document.getElementById('canvas').height = window.innerHeight;
    }, 16.6)();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < obj_amount; i++) {
        if (mouse_pressed)
            objects[i].click_attract(
                [mouse_coords[0], mouse_coords[1]]
            );
        objects[i].draw(ctx);
    }
    requestAnimationFrame(animate);
}

animate();
