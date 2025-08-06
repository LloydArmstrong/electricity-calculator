// Simplified OGL implementation for light rays
export class Renderer {
    constructor(options = {}) {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            throw new Error('WebGL not supported');
        }

        this.gl = gl;
        this.dpr = options.dpr || 1;
        
        // Enable blending for transparency
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    setSize(width, height) {
        const canvas = this.gl.canvas;
        canvas.width = width * this.dpr;
        canvas.height = height * this.dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        this.gl.viewport(0, 0, canvas.width, canvas.height);
    }

    render({ scene }) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        scene.draw();
    }
}

export class Program {
    constructor(gl, { vertex, fragment, uniforms = {} }) {
        this.gl = gl;
        this.uniforms = uniforms;
        
        const vertexShader = this.createShader(gl.VERTEX_SHADER, vertex);
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragment);
        
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            throw new Error('Program failed to link: ' + gl.getProgramInfoLog(this.program));
        }

        this.uniformLocations = {};
        Object.keys(uniforms).forEach(name => {
            this.uniformLocations[name] = gl.getUniformLocation(this.program, name);
        });
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error('Shader compilation error: ' + this.gl.getShaderInfoLog(shader));
        }
        
        return shader;
    }

    use() {
        this.gl.useProgram(this.program);
        
        // Update uniforms
        Object.keys(this.uniforms).forEach(name => {
            const uniform = this.uniforms[name];
            const location = this.uniformLocations[name];
            
            if (location && uniform.value !== undefined) {
                if (Array.isArray(uniform.value)) {
                    if (uniform.value.length === 2) {
                        this.gl.uniform2fv(location, uniform.value);
                    } else if (uniform.value.length === 3) {
                        this.gl.uniform3fv(location, uniform.value);
                    }
                } else {
                    this.gl.uniform1f(location, uniform.value);
                }
            }
        });
    }
}

export class Triangle {
    constructor(gl) {
        this.gl = gl;
        
        // Create triangle vertices that cover the entire screen
        const vertices = new Float32Array([
            -1, -1,
             3, -1,
            -1,  3
        ]);
        
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        this.positionLocation = null;
    }

    bind(program) {
        this.positionLocation = this.gl.getAttribLocation(program.program, 'position');
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    }
}

export class Mesh {
    constructor(gl, { geometry, program }) {
        this.gl = gl;
        this.geometry = geometry;
        this.program = program;
    }

    draw() {
        this.program.use();
        this.geometry.bind(this.program);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }
}