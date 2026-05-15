import { useEffect, useRef } from 'react';

type Uniforms = Record<string, number | [number, number] | [number, number, number]>;

interface Options {
  vertex: string;
  fragment: string;
  uniforms: Uniforms;
  paused?: boolean;
}

export function useWebGLShader(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  { vertex, fragment, uniforms, paused = false }: Options,
) {
  const startRef = useRef<number>(performance.now());
  const rafRef = useRef<number | null>(null);
  const uniformsRef = useRef<Uniforms>(uniforms);
  uniformsRef.current = uniforms;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, alpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.error('shader compile error', gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, vertex);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      // eslint-disable-next-line no-console
      console.error('program link error', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations cache
    const locs = new Map<string, WebGLUniformLocation | null>();
    const loc = (name: string) => {
      if (!locs.has(name)) locs.set(name, gl.getUniformLocation(prog, name));
      return locs.get(name) ?? null;
    };

    let alive = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // Cap small screens to half-res for perf
      const scale = w < 768 ? 0.65 : 1;
      const pw = Math.max(2, Math.floor(w * dpr * scale));
      const ph = Math.max(2, Math.floor(h * dpr * scale));
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
        gl.viewport(0, 0, pw, ph);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const setUniforms = () => {
      // resolution
      const rl = loc('u_resolution');
      if (rl) gl.uniform2f(rl, canvas.width, canvas.height);
      // user uniforms
      for (const [name, val] of Object.entries(uniformsRef.current)) {
        const ul = loc(name);
        if (!ul) continue;
        if (typeof val === 'number') gl.uniform1f(ul, val);
        else if (val.length === 2) gl.uniform2f(ul, val[0], val[1]);
        else if (val.length === 3) gl.uniform3f(ul, val[0], val[1], val[2]);
      }
    };

    const drawOnce = (t: number) => {
      const tl = loc('u_time');
      if (tl) gl.uniform1f(tl, (t - startRef.current) / 1000);
      setUniforms();
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const tick = (t: number) => {
      if (!alive) return;
      drawOnce(t);
      rafRef.current = requestAnimationFrame(tick);
    };

    if (paused) {
      drawOnce(performance.now());
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      alive = false;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [vertex, fragment, paused, canvasRef]);
}
