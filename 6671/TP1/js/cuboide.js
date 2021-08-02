class Cuboide {
    constructor(ladoA, ladoB, ladoC, tapar) {
        this.modelMatrix = mat4.create();
        mat4.identity(this.modelMatrix);
        this.tapar = tapar;
        this.ladoA = ladoA;
        this.ladoB = ladoB;
        this.ladoC = ladoC;
        this.malla = undefined;
        this.generarSuperficie();
    }

    generarSuperficie() {
            
        let positionBuffer = [];
        let normalBuffer = [];
        let uvBuffer = [];
        let indexBuffer = [];

        const mitadA = this.ladoA/2;
        const mitadB = this.ladoB/2;

        // Cara frente
        positionBuffer.push(-mitadA, 0, -mitadB);
        normalBuffer.push(0, 0, -1);
        uvBuffer.push(0, 0);
        
        positionBuffer.push(-mitadA, this.ladoC, -mitadB);
        normalBuffer.push(0, 0, -1);
        uvBuffer.push(0, 1);
        
        positionBuffer.push(mitadA, 0, -mitadB);
        normalBuffer.push(0, 0, -1);
        uvBuffer.push(1, 0);
        

        positionBuffer.push(mitadA, this.ladoC, -mitadB);
        normalBuffer.push(0, 0, -1);
        uvBuffer.push(1, 1);

        // Cara derecha
        positionBuffer.push(mitadA, 0, -mitadB);
        normalBuffer.push(1, 0, 0);
        uvBuffer.push(1, 0);

        positionBuffer.push(mitadA, this.ladoC, -mitadB);
        normalBuffer.push(1, 0, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(mitadA, 0, mitadB);
        normalBuffer.push(1, 0, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(mitadA, this.ladoC, mitadB);
        normalBuffer.push(1, 0, 0);
        uvBuffer.push(1, 1);

        // Cara fondo
        positionBuffer.push(mitadA, 0, mitadB);
        normalBuffer.push(0, 0, 1);
        uvBuffer.push(1, 1);

        positionBuffer.push(mitadA, this.ladoC, mitadB);
        normalBuffer.push(0, 0, 1);
        uvBuffer.push(1, 1);

        positionBuffer.push(-mitadA, 0, mitadB);
        normalBuffer.push(0, 0, 1);
        uvBuffer.push(1, 1);

        positionBuffer.push(-mitadA, this.ladoC, mitadB);
        normalBuffer.push(0, 0, 1);
        uvBuffer.push(1, 1);

        // Cara izquierda
        positionBuffer.push(-mitadA, 0, mitadB);
        normalBuffer.push(-1, 0, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(-mitadA, this.ladoC, mitadB);
        normalBuffer.push(-1, 0, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(-mitadA, 0, -mitadB);
        normalBuffer.push(-1, 0, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(-mitadA, this.ladoC, -mitadB);
        normalBuffer.push(-1, 0, 0);
        uvBuffer.push(1, 1);

        // Tapa superior
        positionBuffer.push(-mitadA, this.ladoC, -mitadB);
        normalBuffer.push(0, 1, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(mitadA, this.ladoC, -mitadB);
        normalBuffer.push(0, 1, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(-mitadA, this.ladoC, mitadB);
        normalBuffer.push(0, 1, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(mitadA, this.ladoC, mitadB);
        normalBuffer.push(0, 1, 0);
        uvBuffer.push(1, 1);

        // Tapa inferior
        positionBuffer.push(mitadA, 0, -mitadB);
        normalBuffer.push(0, -1, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(-mitadA, 0, -mitadB);
        normalBuffer.push(0, -1, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(mitadA, 0, mitadB);
        normalBuffer.push(0, -1, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(-mitadA, 0, mitadB);
        normalBuffer.push(0, -1, 0);
        uvBuffer.push(1, 1);

        /*
        positionBuffer.push(mitadA, this.ladoC, mitadB);
        normalBuffer.push(0, -1, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(mitadA, 0, mitadB);
        normalBuffer.push(0, -1, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(mitadA, 0, mitadB);
        normalBuffer.push(0, -1, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(mitadA, 0, -mitadB);
        normalBuffer.push(0, -1, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(-mitadA, 0, mitadB);
        normalBuffer.push(0, -1, 0);
        uvBuffer.push(1, 1);

        positionBuffer.push(-mitadA, 0, -mitadB);
        normalBuffer.push(0, -1, 0);
        uvBuffer.push(1, 1);
        */

        // Buffer de indices de los triángulos
            
        indexBuffer.push(0, 1, 2, 3);
        indexBuffer.push(4, 5, 6, 7);
        indexBuffer.push(8, 9, 10, 11);
        indexBuffer.push(12, 13, 14, 15);
        indexBuffer.push(16, 17, 18, 19);
        //indexBuffer.push(20, 21, 22, 23, 24, 25, 26);
        indexBuffer.push(20, 21, 22, 23);

        // Creación e Inicialización de los buffers
    
        let webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = positionBuffer.length / 3;
    
        let webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = normalBuffer.length / 3;
    
        let webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = uvBuffer.length / 2;
    
    
        let webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
        webgl_index_buffer.itemSize = 1;
        webgl_index_buffer.numItems = indexBuffer.length;
    
        this.malla = {
            webgl_position_buffer,
            webgl_normal_buffer,
            webgl_uvs_buffer,
            webgl_index_buffer
        }
    }

    getMalla() {
        return this.malla;
    }

    getModelMatrix() {
        return this.modelMatrix;
    }

    setModelMatrix(modelMatrix) {
        this.modelMatrix = modelMatrix;
    }

    draw(setupVertexShaderMatrix, drawMalla, color) {
        setupVertexShaderMatrix(this.getModelMatrix(), color);
        drawMalla(this.getMalla());
    }
}