'use client';

import { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2, Transform } from "ogl";

const vertex = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 uResolution;
uniform float uTime;
uniform float uHueShift;
uniform float uNoise;
uniform float uScan;
uniform float uScanFreq;
uniform float uWarp;

#define iTime uTime
#define iResolution uResolution

float rand(vec2 c){return fract(sin(dot(c, vec2(12.9898,78.233))) * 43758.5453);}

mat3 rgb2yiq = mat3(
    0.299, 0.587, 0.114,
    0.596, -0.274, -0.322,
    0.211, -0.523, 0.312
);
mat3 yiq2rgb = mat3(
    1.0, 0.956, 0.621,
    1.0, -0.272, -0.647,
    1.0, -1.106, 1.703
);

vec3 hueShiftRGB(vec3 col, float deg){
    vec3 yiq = rgb2yiq * col;
    float rad = radians(deg);
    float cosh = cos(rad);
    float sinh = sin(rad);
    vec3 yiqShift = vec3(
        yiq.x,
        yiq.y * cosh - yiq.z * sinh,
        yiq.y * sinh + yiq.z * cosh
    );
    return clamp(yiq2rgb * yiqShift, 0.0, 1.0);
}

vec4 cppn_fn(vec2 coordinate, float in0, float in1, float in2){
    return vec4(
        0.5 + 0.5 * sin(coordinate.x * 3.0 + iTime),
        0.5 + 0.5 * cos(coordinate.y * 3.0 + iTime),
        0.5,
        1.0
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / uResolution.xy * 2.0 - 1.0;
    uv.y *= -1.0;
    uv += uWarp * vec2(
        sin(uv.y * 6.283 + iTime * 0.5),
        cos(uv.x * 6.283 + iTime * 0.5)
    ) * 0.05;
    fragColor = cppn_fn(uv, 0.1 * sin(0.3 * iTime), 0.1 * sin(0.69 * iTime), 0.1 * sin(0.44 * iTime));
}

void main(){
    vec4 col;
    mainImage(col, gl_FragCoord.xy);
    col.rgb = hueShiftRGB(col.rgb, uHueShift);
    float scanline_val = sin(gl_FragCoord.y * uScanFreq) * 0.5 + 0.5;
    col.rgb *= 1.0 - (scanline_val * scanline_val) * uScan;
    col.rgb += (rand(gl_FragCoord.xy + uTime) - 0.5) * uNoise;
    gl_FragColor = vec4(clamp(col.rgb, 0.0, 1.0), 1.0);
}
`;

export default function DarkVeil({
    hueShift = 0,
    noiseIntensity = 0,
    scanlineIntensity = 0,
    speed = 0.5,
    scanlineFrequency = 0,
    warpAmount = 0,
    resolutionScale = 1,
}) {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;

        const canvas = ref.current;
        const parent = canvas.parentElement;

        // Initialize renderer
        const renderer = new Renderer({
            dpr: Math.min(window.devicePixelRatio, 2),
            canvas,
        });
        const gl = renderer.gl;

        // Geometry & Program
        const geometry = new Triangle(gl);
        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vec2(1, 1) },
                uHueShift: { value: hueShift },
                uNoise: { value: noiseIntensity },
                uScan: { value: scanlineIntensity },
                uScanFreq: { value: scanlineFrequency },
                uWarp: { value: warpAmount },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });

        // Wrap mesh in Transform
        const scene = new Transform();
        mesh.setParent(scene);

        // Resize handling
        const resize = () => {
            const w = parent.clientWidth;
            const h = parent.clientHeight;
            renderer.setSize(w * resolutionScale, h * resolutionScale);
            program.uniforms.uResolution.value.set(w, h);
        };
        window.addEventListener("resize", resize);
        resize();

        // Animation loop
        let frame;
        const start = performance.now();

        const loop = () => {
            program.uniforms.uTime.value = ((performance.now() - start) / 1000) * speed;
            renderer.render({ scene });
            frame = requestAnimationFrame(loop);
        };

        loop();

        // Cleanup
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
            renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
    }, [
        hueShift,
        noiseIntensity,
        scanlineIntensity,
        speed,
        scanlineFrequency,
        warpAmount,
        resolutionScale,
    ]);

    return (
        <canvas
            ref={ref}
            className="absolute inset-0 -z-10 w-full h-full block"
        />
    );
}
