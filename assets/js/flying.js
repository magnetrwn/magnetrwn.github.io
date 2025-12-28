export function delay_m(object, method, ms) {
    return function() {
        setTimeout(() => {
            method.apply(object, arguments);
        }, ms);
    };
}

export class FlyingObject {
    static init_id = 0;

    constructor(sprite, init_coords = [0, 0], linear_v = [0, 0], angular_v = 0) {
        this.id = FlyingObject.init_id;
        FlyingObject.init_id++;

        this.sprite = new Image();
        this.sprite.src = sprite;
        this.sprite.onerror = () => {
            console.warn(`Error loading sprite for FlyingObject (id: ${this.id}, sprite: \'${this.sprite.src}\').`);
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

    apply_force(force_v, strength = 0.15) {
        // you can both attract and repel objects with the strength parameter
        const dx = force_v[0] - this.coords[0];
        const dy = force_v[1] - this.coords[1];

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

export class FlyingManager {
    constructor() {
        this.canvas = undefined;
        this.ctx = undefined;
        this.objects = [];

        this.force_v = [0, 0];
        this.is_force_active = false;

        this.launch_animation = this.launch_animation.bind(this);
    }

    _on_pointer_down(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.is_force_active = true;
        this.force_v[0] = event.clientX - rect.left;
        this.force_v[1] = event.clientY - rect.top;
    };

    _on_pointer_up(event) {
        this.is_force_active = false;
    };

    _on_pointer_move(event) {
        if (this.is_force_active) {
            const rect = this.canvas.getBoundingClientRect();
            this.force_v[0] = event.clientX - rect.left;
            this.force_v[1] = event.clientY - rect.top;
        }
    };

    _on_resize(event) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setup_canvas(canvas_id) {
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext('2d');

        Object.assign(this.canvas.style, {
            position: "fixed",
            inset: "0",
            width: "100vw",
            height: "100vh",
            display: "block",
            margin: "0",
            padding: "0",
            zIndex: "0",
            pointerEvents: "none",
            background: "linear-gradient(60deg, #00000000, #4d718b20)"
        });

        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;

        window.addEventListener('resize', delay_m(this, this._on_resize, 75));

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.addEventListener('pointerdown', delay_m(this, this._on_pointer_down, 75));
        window.addEventListener('pointerup', delay_m(this, this._on_pointer_up, 75));
        window.addEventListener('pointercancel', delay_m(this, this._on_pointer_up, 75));
        window.addEventListener('pointermove', delay_m(this, this._on_pointer_move, 75));
    }

    setup_sprites(sprites) {
        this.objects = [];

        let new_obj;
        for (let sprite of sprites) {
            new_obj = new FlyingObject(sprite);
            new_obj.randomize(this.ctx);
            this.objects.push(new_obj);
        }
    }

    launch_animation() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let object of this.objects) {
            if (this.is_force_active)
                object.apply_force(this.force_v);
            object.draw(this.ctx);
        }
        requestAnimationFrame(this.launch_animation);
    }
}
