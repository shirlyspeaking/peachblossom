/**
 * WebGL 游標：粉色莖線（回授）＋桃花（停留漸深），透明疊加不改頁面粉底。
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
uniform float u_clean;
uniform vec2 u_point;
uniform float u_time;
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
    float petals_number = 5.;
    float angle_animated_offset = .7 * (random_by_uv - .5) / (1. + 30. * u_stop_time);
    float flower_angle = atan(_point.y, _point.x) - angle_animated_offset;
    float flower_sectoral_shape = abs(sin(flower_angle * .5 * petals_number + _angle_offset)) + _tickniess * petals_thickness;
    vec2 flower_size_range = vec2(6., 14.);
    float flower_radial_shape = length(_point) * (flower_size_range[0] + flower_size_range[1] * u_stop_randomizer[0]);
    float radius_noise = sin(flower_angle * 13. + 15. * random_by_uv);
    flower_radial_shape += _noise * radius_noise;
    float flower_radius_grow = min(20000. * u_stop_time, 1.);
    flower_radius_grow = 1. / flower_radius_grow;
    float f = 1. - smoothstep(0., _size * flower_sectoral_shape, _outline * flower_radius_grow * flower_radial_shape);
    f *= (1. - u_moving);
    return f;
}

void main() {
    vec4 prev = texture2D(u_texture, vUv);
    vec3 base = prev.rgb;
    float prevA = prev.a;

    /* 衰減：讓舊軌跡慢慢淡出 */
    base *= 0.96;
    prevA *= 0.96;

    vec2 cursor = vUv - u_point.xy;
    cursor.x *= u_ratio;

    /* —— 粉色莖線（移動時） —— */
    if (u_moving > 0.5) {
        float dist = length(cursor);
        float sigma = 0.004;
        float core = exp(-dist * dist / (sigma * sigma));
        float glow = exp(-dist * dist / (sigma * sigma * 8.0));
        vec2 nuv = vUv * 1400.0 + u_point * 40.0 + u_time * 2.0;
        float sparkle = 0.55 + 0.45 * noise(nuv);
        vec3 pinkA = vec3(1.0, 0.76, 0.84);
        vec3 pinkB = vec3(0.92, 0.52, 0.68);
        vec3 trail = mix(pinkA, pinkB, glow + sparkle * 0.3);
        float strength = core * 0.85 + glow * 0.35;
        strength *= 0.5 + 0.5 * sparkle;
        base = mix(base, trail, strength);
        prevA = max(prevA, strength * 0.85);
    }

    /* —— 桃花：停住時綻放，停留越久越深 —— */
    float s0 = flower_shape(cursor, 1., .96, 1., .15, 0.);
    float s1 = flower_shape(cursor, 1.05, 1.07, 1., .15, 0.);
    float center_s = flower_shape(cursor, .15, 1., 2., .1, 1.9);

    float deepen = smoothstep(0.0, 1.0, u_stop_time);

    /* 花瓣：淺粉→深桃紅 */
    vec3 lightPink = vec3(1.0, 0.82, 0.88);
    vec3 deepPink = vec3(0.82, 0.24, 0.48);
    vec3 petal_color = mix(lightPink, deepPink, deepen * 0.75);

    vec3 flower_new = petal_color * s0;
    vec3 flower_mask = 1. - vec3(s1);

    /* 花心：淡黃→暖棕 */
    vec3 lightCenter = vec3(1.0, 0.94, 0.68);
    vec3 deepCenter = vec3(0.88, 0.58, 0.38);
    vec3 center_col = mix(lightCenter, deepCenter, deepen * 0.5);
    vec3 flower_mid = center_col * center_s * 0.7;

    vec3 color = base * flower_mask + flower_new + flower_mid;
    color *= u_clean;
    color = clamp(color, vec3(0.), vec3(1.));

    float flowerVis = max(s0, s1 * 0.85);
    float alpha = max(prevA * 0.993, flowerVis * clamp(u_stop_time * 1.4, 0., 1.));
    alpha = min(alpha, 1.0);

    gl_FragColor = vec4(color, alpha);
}`;

    function initFlowerCursor(canvas, cleanBtn) {
        if (!canvas || typeof THREE === "undefined") return;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: false,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
        });
        renderer.setClearColor(0x000000, 0);

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
        camera.position.z = 1;

        const geometry = new THREE.PlaneGeometry(2, 2);

        const uniforms = {
            u_ratio: { value: 1 },
            u_moving: { value: 0 },
            u_stop_time: { value: 0 },
            u_stop_randomizer: { value: new THREE.Vector2(0.5, 0.5) },
            u_clean: { value: 1 },
            u_point: { value: new THREE.Vector2(0.5, 0.5) },
            u_texture: { value: null },
            u_time: { value: 0 },
        };

        const material = new THREE.ShaderMaterial({
            vertexShader: VERTEX,
            fragmentShader: FRAGMENT,
            uniforms: uniforms,
            transparent: true,
            depthWrite: false,
            depthTest: false,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const blitScene = new THREE.Scene();
        const blitCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
        blitCam.position.z = 1;
        const blitMat = new THREE.MeshBasicMaterial({
            map: null,
            transparent: true,
            opacity: 1,
            depthWrite: false,
            depthTest: false,
        });
        const blitMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blitMat);
        blitScene.add(blitMesh);

        let w = 0, h = 0;
        let rtA = null, rtB = null;
        let read = null, write = null;

        function allocTargets() {
            if (rtA) rtA.dispose();
            if (rtB) rtB.dispose();
            rtA = new THREE.WebGLRenderTarget(w, h, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
            });
            rtB = new THREE.WebGLRenderTarget(w, h, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
            });
            rtA.texture.flipY = false;
            rtB.texture.flipY = false;
            read = rtA;
            write = rtB;
            clearBoth();
        }

        function clearBoth() {
            uniforms.u_clean.value = 1;
            renderer.setRenderTarget(rtA);
            renderer.setClearColor(0x000000, 0);
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

        function onPointer(e) {
            mouse.set(
                e.clientX / window.innerWidth,
                1 - e.clientY / window.innerHeight
            );
        }
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("pointerdown", onPointer, { passive: true });

        if (cleanBtn) {
            cleanBtn.addEventListener("click", function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                clearBoth();
            });
        }

        const clock = new THREE.Clock();

        function tick() {
            var dt = Math.min(clock.getDelta(), 0.1);
            uniforms.u_time.value += dt;

            var dist = mouse.distanceTo(prevMouse);
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
            prevMouse.copy(mouse);

            uniforms.u_texture.value = read.texture;

            renderer.setRenderTarget(write);
            renderer.render(scene, camera);

            blitMat.map = write.texture;
            blitMat.needsUpdate = true;
            renderer.setRenderTarget(null);
            renderer.setClearColor(0x000000, 0);
            renderer.clear();
            renderer.render(blitScene, blitCam);

            var tmp = read;
            read = write;
            write = tmp;

            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    window.initFlowerCursor = initFlowerCursor;
})();
