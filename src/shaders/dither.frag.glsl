precision highp float;

varying vec2 v_uv;
uniform float u_time;
uniform vec2  u_resolution;
uniform float u_pixelSize;   // pixel size for dithered cells (in CSS px)
uniform float u_intensity;   // 0..1, contrast of the gradient field
uniform float u_speed;       // 0..2
uniform vec3  u_colorA;      // dark
uniform vec3  u_colorB;      // mid
uniform vec3  u_colorC;      // bright accent
uniform float u_variant;     // 0=hero,1=divider,2=panel

// 8x8 Bayer matrix, normalized to 0..1
float bayer8(vec2 p) {
  int x = int(mod(p.x, 8.0));
  int y = int(mod(p.y, 8.0));
  int i = y * 8 + x;
  // unrolled lookup
  float v = 0.0;
  if (i == 0) v = 0.0;       else if (i == 1) v = 32.0;
  else if (i == 2) v = 8.0;   else if (i == 3) v = 40.0;
  else if (i == 4) v = 2.0;   else if (i == 5) v = 34.0;
  else if (i == 6) v = 10.0;  else if (i == 7) v = 42.0;
  else if (i == 8) v = 48.0;  else if (i == 9) v = 16.0;
  else if (i == 10) v = 56.0; else if (i == 11) v = 24.0;
  else if (i == 12) v = 50.0; else if (i == 13) v = 18.0;
  else if (i == 14) v = 58.0; else if (i == 15) v = 26.0;
  else if (i == 16) v = 12.0; else if (i == 17) v = 44.0;
  else if (i == 18) v = 4.0;  else if (i == 19) v = 36.0;
  else if (i == 20) v = 14.0; else if (i == 21) v = 46.0;
  else if (i == 22) v = 6.0;  else if (i == 23) v = 38.0;
  else if (i == 24) v = 60.0; else if (i == 25) v = 28.0;
  else if (i == 26) v = 52.0; else if (i == 27) v = 20.0;
  else if (i == 28) v = 62.0; else if (i == 29) v = 30.0;
  else if (i == 30) v = 54.0; else if (i == 31) v = 22.0;
  else if (i == 32) v = 3.0;  else if (i == 33) v = 35.0;
  else if (i == 34) v = 11.0; else if (i == 35) v = 43.0;
  else if (i == 36) v = 1.0;  else if (i == 37) v = 33.0;
  else if (i == 38) v = 9.0;  else if (i == 39) v = 41.0;
  else if (i == 40) v = 51.0; else if (i == 41) v = 19.0;
  else if (i == 42) v = 59.0; else if (i == 43) v = 27.0;
  else if (i == 44) v = 49.0; else if (i == 45) v = 17.0;
  else if (i == 46) v = 57.0; else if (i == 47) v = 25.0;
  else if (i == 48) v = 15.0; else if (i == 49) v = 47.0;
  else if (i == 50) v = 7.0;  else if (i == 51) v = 39.0;
  else if (i == 52) v = 13.0; else if (i == 53) v = 45.0;
  else if (i == 54) v = 5.0;  else if (i == 55) v = 37.0;
  else if (i == 56) v = 63.0; else if (i == 57) v = 31.0;
  else if (i == 58) v = 55.0; else if (i == 59) v = 23.0;
  else if (i == 60) v = 61.0; else if (i == 61) v = 29.0;
  else if (i == 62) v = 53.0; else if (i == 63) v = 21.0;
  return (v + 0.5) / 64.0;
}

// Smooth value-noise field
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int k = 0; k < 4; k++) {
    v += a * noise(p);
    p *= 2.04;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 fragCoord = v_uv * u_resolution;
  // Quantize coords to pixel grid for chunky dither cells
  vec2 cell = floor(fragCoord / u_pixelSize);
  vec2 cellCenter = (cell + 0.5) * u_pixelSize;
  vec2 nuv = cellCenter / u_resolution;

  float t = u_time * u_speed;

  // Field shaped per variant
  float field;
  if (u_variant < 0.5) {
    // hero: rolling gradient + fbm waves
    vec2 q = nuv * 1.6;
    q.x += t * 0.07;
    q.y += sin(t * 0.3 + nuv.x * 3.0) * 0.15;
    float wave = fbm(q + fbm(q * 1.7 + t * 0.05));
    float radial = 1.0 - distance(nuv, vec2(0.5, 0.62)) * 1.05;
    field = mix(wave, radial, 0.45);
  } else if (u_variant < 1.5) {
    // divider: horizontal gradient + slow stripes
    float band = smoothstep(0.0, 0.5, nuv.y) * smoothstep(1.0, 0.5, nuv.y);
    float stripe = fbm(vec2(nuv.x * 3.0 + t * 0.2, nuv.y * 1.2));
    field = band * stripe;
  } else {
    // panel: very subtle, slow drift
    field = fbm(nuv * 1.4 + t * 0.04) * 0.85;
  }

  field = clamp(field, 0.0, 1.0);
  field = pow(field, mix(1.6, 0.7, u_intensity));

  // Bayer threshold using cell coords (chunky pixels)
  float threshold = bayer8(cell);
  float lit = step(threshold, field);

  // Build palette: A = bg, B = mid (blue), C = bright (green)
  vec3 col;
  if (lit < 0.5) {
    col = u_colorA;
  } else {
    // pick B or C based on field intensity
    float pick = step(0.62, field);
    col = mix(u_colorB, u_colorC, pick);
  }

  // Vignette to anchor edges
  float vig = smoothstep(1.4, 0.4, length(nuv - 0.5));
  col *= mix(0.55, 1.0, vig);

  // Subtle grain on lit pixels
  float grain = (hash(cell + floor(t * 6.0)) - 0.5) * 0.04;
  col += grain * lit;

  gl_FragColor = vec4(col, 1.0);
}
