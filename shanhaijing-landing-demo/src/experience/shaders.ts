export const cloudVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const cloudFragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vWorldPos;

  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uScale;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * vec2(uScale, uScale * 0.42);
    float n = fbm(uv + vec2(uTime * 0.012, uTime * 0.007));
    n = smoothstep(0.28, 0.82, n);

    float edgeX = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);
    float edgeY = smoothstep(0.0, 0.28, vUv.y) * smoothstep(1.0, 0.52, vUv.y);
    float alpha = n * edgeX * edgeY * uOpacity;

    if (alpha < 0.018) discard;

    vec3 lit = mix(uColor * 0.78, vec3(0.94, 0.96, 0.99), n * 0.5);
    gl_FragColor = vec4(lit, alpha);
  }
`

export const iceVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vObjectPos;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vObjectPos = position;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const iceFragment = /* glsl */ `
  precision highp float;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vObjectPos;

  uniform vec3 uIce;
  uniform vec3 uGlow;
  uniform float uSeed;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i);
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));
    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    return mix(mix(nx00, nx10, f.y), mix(nx01, nx11, f.y), f.z);
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);
    float ndv = max(dot(N, V), 0.0);
    float fresnel = pow(1.0 - ndv, 2.8);

    vec3 L = normalize(vec3(0.35, 0.82, 0.28));
    float diff = 0.62 + max(dot(N, L), 0.0) * 0.28;

    float grain = noise(vObjectPos * 2.2 + uSeed) * 0.08;
    float crack = smoothstep(0.78, 0.92, noise(vObjectPos * 6.4 + uSeed * 2.1)) * 0.12;

    vec3 ice = uIce * diff + grain;
    ice = mix(ice, uGlow, 0.1 + fresnel * 0.62 + crack);
    ice += uGlow * pow(fresnel, 1.6) * 0.35;
    float alpha = 0.84 + fresnel * 0.12;

    gl_FragColor = vec4(ice, alpha);
  }
`
