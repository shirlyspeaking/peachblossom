/**
 * WebGL Flower Cursor — 全螢幕貼圖回授著色器
 * 依賴：THREE（全域）
 */
(function () {
    const VERTEX = `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.);
}`;

    const FRAGMENT = `
#define PI 3.14159265359
precision highp float;

uniform float u_ratio;
uniform float u_moving;
uniform float u_stop_time;
uniform float u_speed;
uniform vec2 u_stop_randomizer;
uniform float u_clean;
uniform vec2 u_point;
uniform sampler2D u_texture;
varying vec2 vUv;

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
float noise(vec2 n) {
    const vec2 d = vec2(0., 1.);
    vec2 b = floor(n), f = smoothstep(vec2(0.), vec2(1.), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float flower_shape(vec2 _point, float _size, float _outline, float _tickniess, float _noise, float _angle_offset) {
    float random_by_uv = noise(vUv);

    float petals_thickness = .5;
    float petals_number = 5. + floor(u_stop_randomizer[0] * 4.);
    float angle_animated_offset = .7 * (random_by_uv - .5) / (1. + 30. * u_stop_time);
    float flower_angle = atan(_point.y, _point.x) - angle_animated_offset;
    float flower_sectoral_shape = abs(sin(flower_angle * .5 * petals_number + _angle_offset)) + _tickniess * petals_thickness;

    vec2 flower_size_range = vec2(4., 18.);
    float flower_radial_shape = length(_point) * (flower_size_range[0] + flower_size_range[1] * u_stop_randomizer[0]);
    float radius_noise = sin(flower_angle * 13. + 15. * random_by_uv);
    flower_radial_shape += _noise * radius_noise;

    float flower_radius_grow = min(20000. * u_stop_time, 1.);
    flower_radius_grow = 1. / flower_radius_grow;

    float flower_shape = 1. - smoothstep(0., _size * flower_sectoral_shape, _outline * flower_radius_grow * flower_radial_shape);
    flower_shape *= (1. - u_moving);

    flower_shape *= (1. - step(1., u_stop_time));

    return flower_shape;
}

void main() {

    vec3 base = texture2D(u_texture, vUv).xyz;
    vec2 cursor = vUv - u_point.xy;
    cursor.x *= u_ratio;

    vec3 stem_color = vec3(0., 2., 1.5);
    float stem_radius = .003 * u_speed * u_moving;
    float stem_shape = 1. - pow(smoothstep(0., stem_radius, dot(cursor, cursor)), .03);
    vec3 stem = stem_shape * stem_color;

    vec3 flower_color = vec3(.7 + u_stop_randomizer[1], .8 * u_stop_randomizer[1], 2.9 + u_stop_randomizer[0] * .6);
    vec3 flower_new = flower_color * flower_shape(cursor, 1., .96, 1., .15, 0.);
    vec3 flower_mask = 1. - vec3(flower_shape(cursor, 1.05, 1.07, 1., .15, 0.));
    vec3 flower_mid = vec3(-.6) * flower_shape(cursor, .15, 1., 2., .1, 1.9);

    vec3 color = base * flower_mask + (flower_new + flower_mid + stem);
    color *= u_clean;
    color = clamp(color, vec3(.0, .0, .15), vec3(1., 1., .4));

    gl_FragColor = vec4(color, 1.);
}`;

    function initFlowerCursor(canvas, cleanBtn) {
        if (!canvas || typeof THREE === "undefined") return;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: false,
            antialias: false,
            powerPreference: "high-performance",
        });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
        camera.position.z = 1;

        const geometry = new THREE.PlaneGeometry(2, 2);

        const uniforms = {
            u_ratio: { value: 1 },
            u_moving: { value: 0 },
            u_stop_time: { value: 0 },
            u_speed: { value: 0 },
            u_stop_randomizer: { value: new THREE.Vector2(Math.random(), Math.random()) },
            u_clean: { value: 1 },
            u_point: { value: new THREE.Vector2(0.5, 0.5) },
            u_texture: { value: null },
        };

        const material = new THREE.RawShaderMaterial({
            vertexShader: VERTEX,
            fragmentShader: FRAGMENT,
            uniforms: uniforms,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const blitScene = new THREE.Scene();
        const blitCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
        blitCam.position.z = 1;
        const blitMat = new THREE.MeshBasicMaterial({ map: null });
        const blitMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blitMat);
        blitScene.add(blitMesh);

        let w = 0;
        let h = 0;
        let rtA = null;
        let rtB = null;
        let read = null;
        let write = null;

        function allocTargets() {
            if (rtA) rtA.dispose();
            if (rtB) rtB.dispose();
            rtA = new THREE.WebGLRenderTarget(w, h, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
            });
            rtB = new THREE.WebGLRenderTarget(w, h, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
            });
            rtA.texture.flipY = false;
            rtB.texture.flipY = false;
            read = rtA;
            write = rtB;
            clearBoth();
        }

        function clearBoth() {
            const c = 0x000028;
            renderer.setRenderTarget(rtA);
            renderer.setClearColor(c, 1);
            renderer.clear();
            renderer.setRenderTarget(rtB);
            renderer.clear();
            renderer.setRenderTarget(null);
        }

        function setSize() {
            w = Math.max(2, Math.floor(window.innerWidth * dpr));
            h = Math.max(2, Math.floor(window.innerHeight * dpr));
            renderer.setPixelRatio(dpr);
            renderer.setSize(window.innerWidth, window.innerHeight, false);
            uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
            allocTargets();
        }

        setSize();
        window.addEventListener("resize", setSize);

        const mouse = new THREE.Vector2(0.5, 0.5);
        const prevMouse = new THREE.Vector2(0.5, 0.5);
        let prevMoving = 0;
        let cleanPending = false;

        function onPointer(e) {
            const x = e.clientX / window.innerWidth;
            const y = 1 - e.clientY / window.innerHeight;
            mouse.set(x, y);
        }
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("pointerdown", onPointer, { passive: true });

        if (cleanBtn) {
            cleanBtn.addEventListener("click", function () {
                cleanPending = true;
            });
        }

        const clock = new THREE.Clock();

        function tick() {
            const dt = Math.min(clock.getDelta(), 0.1);
            const dist = mouse.distanceTo(prevMouse);
            let speed = dist * 420 * (dt > 0 ? 1 / dt : 60);
            speed = Math.min(speed, 80);

            let moving = 0;
            if (dist > 0.0012) {
                moving = 1;
                uniforms.u_stop_time.value = 0;
            } else {
                if (prevMoving === 1) {
                    uniforms.u_stop_randomizer.value.set(Math.random(), Math.random());
                }
                moving = 0;
                uniforms.u_stop_time.value += dt * 0.45;
                if (uniforms.u_stop_time.value > 1) uniforms.u_stop_time.value = 1;
            }
            prevMoving = moving;

            uniforms.u_moving.value = moving;
            uniforms.u_speed.value = speed;
            uniforms.u_point.value.copy(mouse);
            prevMouse.copy(mouse);
            uniforms.u_clean.value = 1;

            if (cleanPending) {
                clearBoth();
                cleanPending = false;
            }

            uniforms.u_texture.value = read.texture;

            renderer.setRenderTarget(write);
            renderer.render(scene, camera);

            blitMat.map = write.texture;
            blitMat.needsUpdate = true;
            renderer.setRenderTarget(null);
            renderer.render(blitScene, blitCam);

            const tmp = read;
            read = write;
            write = tmp;

            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    window.initFlowerCursor = initFlowerCursor;
})();
