import { Renderer, Program, Triangle, Mesh } from '../lib/ogl.js';

export class LightRaysComponent {
    constructor(options = {}) {
        this.options = {
            raysOrigin: options.raysOrigin || "top-center",
            raysColor: options.raysColor || "#ffffff",
            raysSpeed: options.raysSpeed || 1,
            lightSpread: options.lightSpread || 1.2,
            rayLength: options.rayLength || 3,
            pulsating: options.pulsating || false,
            fadeDistance: options.fadeDistance || 1.8,
            saturation: options.saturation || 1.0,
            followMouse: options.followMouse || true,
            mouseInfluence: options.mouseInfluence || 0.6,
            noiseAmount: options.noiseAmount || 0.0,
            distortion: options.distortion || 0.0,
            className: options.className || ""
        };

        this.containerRef = null;
        this.uniformsRef = null;
        this.rendererRef = null;
        this.mouseRef = { x: 0.5, y: 0.5 };
        this.smoothMouseRef = { x: 0.5, y: 0.5 };
        this.animationId = null;
        this.meshRef = null;
        this.cleanupFunction = null;
        this.isVisible = false;
        this.observer = null;
    }

    hexToRgb(hex) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m
            ? [
                parseInt(m[1], 16) / 255,
                parseInt(m[2], 16) / 255,
                parseInt(m[3], 16) / 255,
            ]
            : [1, 1, 1];
    }

    getAnchorAndDir(origin, w, h) {
        const outside = 0.2;
        switch (origin) {
            case "top-left":
                return { anchor: [0, -outside * h], dir: [0, 1] };
            case "top-right":
                return { anchor: [w, -outside * h], dir: [0, 1] };
            case "left":
                return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
            case "right":
                return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
            case "bottom-left":
                return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
            case "bottom-center":
                return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
            case "bottom-right":
                return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
            default: // "top-center"
                return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
        }
    }

    async initializeWebGL() {
        if (!this.containerRef) return;

        await new Promise((resolve) => setTimeout(resolve, 10));

        if (!this.containerRef) return;

        const renderer = new Renderer({
            dpr: Math.min(window.devicePixelRatio, 2),
            alpha: true,
        });
        this.rendererRef = renderer;

        const gl = renderer.gl;
        gl.canvas.style.width = "100%";
        gl.canvas.style.height = "100%";

        while (this.containerRef.firstChild) {
            this.containerRef.removeChild(this.containerRef.firstChild);
        }
        this.containerRef.appendChild(gl.canvas);

        const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

        const frag = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor  = color;
}`;

        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: [1, 1] },
            rayPos: { value: [0, 0] },
            rayDir: { value: [0, 1] },
            raysColor: { value: this.hexToRgb(this.options.raysColor) },
            raysSpeed: { value: this.options.raysSpeed },
            lightSpread: { value: this.options.lightSpread },
            rayLength: { value: this.options.rayLength },
            pulsating: { value: this.options.pulsating ? 1.0 : 0.0 },
            fadeDistance: { value: this.options.fadeDistance },
            saturation: { value: this.options.saturation },
            mousePos: { value: [0.5, 0.5] },
            mouseInfluence: { value: this.options.mouseInfluence },
            noiseAmount: { value: this.options.noiseAmount },
            distortion: { value: this.options.distortion },
        };
        this.uniformsRef = uniforms;

        const geometry = new Triangle(gl);
        const program = new Program(gl, {
            vertex: vert,
            fragment: frag,
            uniforms,
        });
        const mesh = new Mesh(gl, { geometry, program });
        this.meshRef = mesh;

        this.setupEventListeners();
        this.updatePlacement();
        this.startAnimationLoop();
    }

    setupEventListeners() {
        this.resizeHandler = () => this.updatePlacement();
        window.addEventListener("resize", this.resizeHandler);

        if (this.options.followMouse) {
            this.mouseHandler = (e) => this.handleMouseMove(e);
            window.addEventListener("mousemove", this.mouseHandler);
        }
    }

    handleMouseMove(e) {
        if (!this.containerRef || !this.rendererRef) return;
        const rect = this.containerRef.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        this.mouseRef = { x, y };
    }

    updatePlacement() {
        if (!this.containerRef || !this.rendererRef) return;

        this.rendererRef.dpr = Math.min(window.devicePixelRatio, 2);

        const { clientWidth: wCSS, clientHeight: hCSS } = this.containerRef;
        this.rendererRef.setSize(wCSS, hCSS);

        const dpr = this.rendererRef.dpr;
        const w = wCSS * dpr;
        const h = hCSS * dpr;

        this.uniformsRef.iResolution.value = [w, h];

        const { anchor, dir } = this.getAnchorAndDir(this.options.raysOrigin, w, h);
        this.uniformsRef.rayPos.value = anchor;
        this.uniformsRef.rayDir.value = dir;
    }

    startAnimationLoop() {
        const loop = (t) => {
            if (!this.rendererRef || !this.uniformsRef || !this.meshRef) {
                return;
            }

            this.uniformsRef.iTime.value = t * 0.001;

            if (this.options.followMouse && this.options.mouseInfluence > 0.0) {
                const smoothing = 0.92;

                this.smoothMouseRef.x =
                    this.smoothMouseRef.x * smoothing +
                    this.mouseRef.x * (1 - smoothing);
                this.smoothMouseRef.y =
                    this.smoothMouseRef.y * smoothing +
                    this.mouseRef.y * (1 - smoothing);

                this.uniformsRef.mousePos.value = [
                    this.smoothMouseRef.x,
                    this.smoothMouseRef.y,
                ];
            }

            try {
                this.rendererRef.render({ scene: this.meshRef });
                this.animationId = requestAnimationFrame(loop);
            } catch (error) {
                console.warn("WebGL rendering error:", error);
                return;
            }
        };

        this.animationId = requestAnimationFrame(loop);
    }

    mount(container) {
        this.containerRef = container;
        
        // Add CSS classes
        container.classList.add('light-rays-container');
        if (this.options.className) {
            container.classList.add(this.options.className);
        }

        // Setup intersection observer for performance
        this.observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                this.isVisible = entry.isIntersecting;
                if (this.isVisible && !this.rendererRef) {
                    this.initializeWebGL();
                }
            },
            { threshold: 0.1 }
        );

        this.observer.observe(container);
    }

    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (this.resizeHandler) {
            window.removeEventListener("resize", this.resizeHandler);
        }

        if (this.mouseHandler) {
            window.removeEventListener("mousemove", this.mouseHandler);
        }

        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        if (this.rendererRef) {
            try {
                const canvas = this.rendererRef.gl.canvas;
                const loseContextExt = this.rendererRef.gl.getExtension("WEBGL_lose_context");
                if (loseContextExt) {
                    loseContextExt.loseContext();
                }

                if (canvas && canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            } catch (error) {
                console.warn("Error during WebGL cleanup:", error);
            }
        }

        this.rendererRef = null;
        this.uniformsRef = null;
        this.meshRef = null;
        this.containerRef = null;
    }
}