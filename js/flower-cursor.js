/**
 * WebGL 游標：金粉虛化莖線（貼圖回授）＋停住時小桃花（每幀繪製，移動即消失）
 * 透明疊加，不改變底層頁面粉色背景
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
uniform vec2 u_point;
uniform sampler2D u_texture;
uniform float u_time;
varying vec2 vUv;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

/* 小桃花：五瓣輪廓＋淡黃花心，隨 u_stop_time 綻放 */
float peach_blossom(vec2 p, float bloom) {
    float r = length(p);
    float ang = atan(p.y, p.x);
    float petals = 5.0;
    float radius = 0.018 + 0.006 * sin(ang * petals + 0.9);
    float petal = 1.0 - smoothstep(radius - 0.004, radius + 0.008, r * 48.0);
    float center = 1.0 - smoothstep(0.0, 0.0065, r * 48.0);
    return max(petal * 0.95, center * 0.92) * bloom;
}

void main() {
    vec4 trail = texture2D(u_texture, vUv);
    trail.rgb *= 0.93;
    trail.a *= 0.93;

    vec2 cursor = vUv - u_point.xy;
    vec2 pc = cursor;
    pc.x *= u_ratio;

    /* —— 粉色莖線（僅移動時累積到 trail） —— */
    if (u_moving > 0.5) {
        float dist = length(pc);
        float spd = clamp(u_speed, 0.5, 60.0);
        float sigma = 0.003 + spd * 0.00005;
        float core = exp(-dist * dist / (sigma * sigma));
        float glow = exp(-dist * dist / ((sigma * 2.8) * (sigma * 2.8)));
        vec2 nuv = vUv * 1400.0 + u_point * 40.0 + u_time * 2.0;
        float g1 = noise2(nuv);
        float g2 = noise2(nuv * 1.7 + 19.0);
        float sparkle = 0.55 + 0.45 * mix(g1, g2, 0.5);
        vec3 pinkA = mix(vec3(1.0, 0.78, 0.85), vec3(0.96, 0.6, 0.72), sparkle);
        vec3 pinkB = mix(vec3(0.95, 0.65, 0.76), vec3(0.88, 0.45, 0.62), sparkle * 0.8);
        vec3 pinkTrail = mix(pinkA, pinkB, glow);
        float strength = core * 0.75 + glow * 0.25;
        strength *= 0.55 + 0.45 * sparkle;
        float alpha = strength * 0.65;
        vec3 rgb = mix(trail.rgb, pinkTrail, alpha);
        float a = trail.a + (1.0 - trail.a) * alpha;
        trail = vec4(rgb, a);
    }

    /* —— 桃花：僅停住時繪製，停留越久花色越深 —— */
    vec3 col = trail.rgb;
    float alpha = trail.a;

    if (u_moving < 0.5 && u_stop_time > 0.02) {
        float bloom = smoothstep(0.0, 0.92, min(u_stop_time * 1.15, 1.0));
        float deepen = smoothstep(0.0, 1.0, u_stop_time);
        float b = peach_blossom(pc, bloom);
        vec3 lightPink = vec3(1.0, 0.82, 0.88);
        vec3 deepPink = vec3(0.78, 0.22, 0.45);
        vec3 petalColor = mix(lightPink, deepPink, deepen * 0.7);
        vec3 pink = mix(petalColor, petalColor * 0.85, b * 0.3);
        float r = length(pc);
        float centerDot = 1.0 - smoothstep(0.0, 0.012, r * 65.0);
        vec3 centerCol = mix(vec3(1.0, 0.93, 0.62), vec3(0.85, 0.55, 0.35), deepen * 0.4);
        vec3 fcol = mix(pink, centerCol, centerDot * 0.85);
        float fa = b * 0.9;
        col = mix(col, fcol, fa);
        alpha = max(alpha, fa * 0.92);
    }

    gl_FragColor = vec4(col, alpha);
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
            u_speed: { value: 0 },
            u_point: { value: new THREE.Vector2(0.5, 0.5) },
            u_texture: { value: null },
            u_time: { value: 0 },
        };

        const material = new THREE.RawShaderMaterial({
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

        function onPointer(e) {
            const x = e.clientX / window.innerWidth;
            const y = 1 - e.clientY / window.innerHeight;
            mouse.set(x, y);
        }
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("pointerdown", onPointer, { passive: true });

        if (cleanBtn) {
            cleanBtn.addEventListener("click", function () {
                clearBoth();
            });
        }

        const clock = new THREE.Clock();

        function tick() {
            const dt = Math.min(clock.getDelta(), 0.1);
            uniforms.u_time.value += dt;

            const dist = mouse.distanceTo(prevMouse);
            let speed = dist * 420 * (dt > 0 ? 1 / dt : 60);
            speed = Math.min(speed, 80);

            let moving = 0;
            if (dist > 0.0012) {
                moving = 1;
                uniforms.u_stop_time.value = 0;
            } else {
                moving = 0;
                uniforms.u_stop_time.value += dt * 0.5;
                if (uniforms.u_stop_time.value > 1) uniforms.u_stop_time.value = 1;
            }
            uniforms.u_moving.value = moving;
            uniforms.u_speed.value = speed;
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

            const tmp = read;
            read = write;
            write = tmp;

            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    window.initFlowerCursor = initFlowerCursor;
})();
