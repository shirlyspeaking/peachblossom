/**
 * WebGL 游標：停住時顯示即時桃花。
 * 不保留任何前一幀殘影，也不在移動時留下任何痕跡。
 */
(function () {
    const VERTEX = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.);
}`;

    const FRAGMENT = `
precision highp float;

uniform float u_ratio;
uniform float u_moving;
uniform float u_stop_time;
uniform vec2 u_stop_randomizer;
uniform vec2 u_point;
uniform float u_time;
varying vec2 vUv;

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
float noise(vec2 n) {
    const vec2 d = vec2(0., 1.);
    vec2 b = floor(n), f = smoothstep(vec2(0.), vec2(1.), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float flower_shape(vec2 pt, float _size, float _outline, float _thick, float _noise, float _angle_off) {
    float rnd = noise(vUv);
    float petals_n = 5.0;
    float ang_off = 0.7 * (rnd - 0.5) / (1.0 + 30.0 * u_stop_time);
    float ang = atan(pt.y, pt.x) - ang_off;
    float sect = abs(sin(ang * 0.5 * petals_n + _angle_off)) + _thick * 0.5;
    float rad = length(pt) * (6.0 + 14.0 * u_stop_randomizer.x);
    rad += _noise * sin(ang * 13.0 + 15.0 * rnd);
    float grow = 1.0 / min(20000.0 * u_stop_time, 1.0);
    float f = 1.0 - smoothstep(0.0, _size * sect, _outline * grow * rad);
    f *= (1.0 - u_moving);
    return clamp(f, 0.0, 1.0);
}

void main() {
    vec3 base = vec3(0.0);
    float baseA = 0.0;

    vec2 cur = vUv - u_point.xy;
    cur.x *= u_ratio;

    /* ===== 桃花（只在停住時顯示）— 純 alpha 合成，不乘遮罩 ===== */
    float petal = flower_shape(cur, 1.0, 0.96, 1.0, 0.15, 0.0);
    float heart = flower_shape(cur, 0.15, 1.0, 2.0, 0.1, 1.9);

    float t = smoothstep(0.0, 1.0, u_stop_time);

    /* 花瓣：淺粉 → 依 randomizer 漸深（紫 / 桃紅 / 橙） */
    vec3 lightPetal = vec3(1.0, 0.82, 0.88);
    vec3 deepPurple = vec3(0.62, 0.18, 0.62);
    vec3 deepRose   = vec3(0.84, 0.16, 0.42);
    vec3 deepOrange = vec3(0.94, 0.50, 0.18);
    vec3 deepColor  = mix(deepPurple, mix(deepRose, deepOrange, u_stop_randomizer.y), u_stop_randomizer.x);
    vec3 petalCol   = mix(lightPetal, deepColor, t * 0.72);

    /* 花心：淡黃 → 暖棕 */
    vec3 lightHeart = vec3(1.0, 0.95, 0.7);
    vec3 deepHeart  = vec3(0.9, 0.55, 0.3);
    vec3 heartCol   = mix(lightHeart, deepHeart, t * 0.6);

    float petalA = petal * 0.92;
    float heartA = heart * 0.88;

    /* alpha-over：花瓣 → 花心，依次疊在 trail 之上 */
    vec3 col = base;
    float a   = baseA;

    if (u_moving < 0.5) {
        col = mix(col, petalCol, petalA);
        a   = a + (1.0 - a) * petalA;

        col = mix(col, heartCol, heartA);
        a   = a + (1.0 - a) * heartA;
    }

    gl_FragColor = vec4(col, a);
}`;

    function initFlowerCursor(canvas, cleanBtn) {
        if (!canvas || typeof THREE === "undefined") return;

        var renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: false,
            premultipliedAlpha: true,
            powerPreference: "high-performance",
        });
        renderer.setClearColor(0x000000, 0);

        var dpr = Math.min(window.devicePixelRatio || 1, 2);

        var scene = new THREE.Scene();
        var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
        camera.position.z = 1;

        var uniforms = {
            u_ratio: { value: 1 },
            u_moving: { value: 0 },
            u_stop_time: { value: 0 },
            u_stop_randomizer: { value: new THREE.Vector2(0.5, 0.5) },
            u_point: { value: new THREE.Vector2(0.5, 0.5) },
            u_time: { value: 0 },
        };

        var material = new THREE.ShaderMaterial({
            vertexShader: VERTEX,
            fragmentShader: FRAGMENT,
            uniforms: uniforms,
            transparent: true,
            depthWrite: false,
            depthTest: false,
        });

        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(mesh);

        function setSize() {
            renderer.setPixelRatio(dpr);
            renderer.setSize(window.innerWidth, window.innerHeight, false);
            uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
        }

        setSize();
        window.addEventListener("resize", setSize);

        var mouse = new THREE.Vector2(0.5, 0.5);
        var prev = new THREE.Vector2(0.5, 0.5);
        var prevMoving = 0;

        function onPointer(e) {
            mouse.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
        }
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("pointerdown", onPointer, { passive: true });

        if (cleanBtn) {
            cleanBtn.addEventListener("click", function (ev) {
                ev.preventDefault();
            });
        }

        var clock = new THREE.Clock();

        function tick() {
            var dt = Math.min(clock.getDelta(), 0.1);
            uniforms.u_time.value += dt;

            var dist = mouse.distanceTo(prev);
            var moving = dist > 0.0012 ? 1 : 0;

            if (moving) {
                uniforms.u_stop_time.value = 0;
            } else {
                if (prevMoving === 1) {
                    uniforms.u_stop_randomizer.value.set(Math.random(), Math.random());
                }
                uniforms.u_stop_time.value += dt * 0.45;
                if (uniforms.u_stop_time.value > 0.98) uniforms.u_stop_time.value = 0.98;
            }
            prevMoving = moving;

            uniforms.u_moving.value = moving;
            uniforms.u_point.value.copy(mouse);
            prev.copy(mouse);

            renderer.setRenderTarget(null);
            renderer.setClearColor(0x000000, 0);
            renderer.clear();

            /* 移動時完全不渲染，避免任何灰黑殘影或邊緣痕跡 */
            if (!moving) {
                renderer.render(scene, camera);
            }
            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    window.initFlowerCursor = initFlowerCursor;
})();
