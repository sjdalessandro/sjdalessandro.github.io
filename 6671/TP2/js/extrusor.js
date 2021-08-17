class Extrusor {
    constructor(cabezal, trayectoria, tapar, tipoTextura, tipoTexturaEnTapa, factorRepeticionTapa = 1, calcularTangentes = false) {
        this.modelMatrix = mat4.create();
        mat4.identity(this.modelMatrix);
        this.cabezal = cabezal;
        this.trayectoria = trayectoria;
        this.tapar = tapar;
        this.tipoTextura = tipoTextura;
        this.tipoTexturaEnTapa = tipoTexturaEnTapa;
        this.factorRepeticionTapa = factorRepeticionTapa;
        this.columnas = cabezal.getVerticesLength();
        this.filas = trayectoria.getMatricesLength() - 1;
        this.malla = undefined;
        this.calcularTangentes = calcularTangentes;
        cabezal.getCentro();
        this.generarSuperficie();
    }

    getPosicion(u, v) {

        let pos = this.cabezal.getPosicion(u);
        pos = this.trayectoria.getPosicion(pos, v);
        return pos;
    }

    getNormal(u, v) {

        let normal = this.cabezal.getNormal(u);
        normal = this.trayectoria.getNormal(normal, v);
        return normal;
    }

    getTangente(u, v) {

        let tangente = this.cabezal.getTangente(u);
        tangente = this.trayectoria.getTangente(tangente, v);
        return tangente;
    }

    getCentro(v) {

        let pos = this.cabezal.getCentro();
        pos = this.trayectoria.getCentro(pos, v);
        return pos;
    }

    getUVCentro(posCentro) {

        let uvCentro;
        if (this.tipoTexturaEnTapa == texturaAjustada) {
            uvCentro = this.cabezal.escalarATextura([posCentro[0], posCentro[2]]);
        } else {
            uvCentro = [posCentro[0]*this.factorRepeticionTapa, posCentro[2]*this.factorRepeticionTapa];
        }
        return uvCentro;
    }

    agregarTapaCentro(v, n, positionBuffer, normalBuffer, uvBuffer, tangentBuffer) {

        var pos = this.getCentro(v);
        let uvs = this.getUVCentro(pos);
 
        for (var j=0; j <= this.columnas; j++) {

            this.push3(positionBuffer, pos);

            if (!this.calcularTangentes) {
                var tan = [n, 0, 0];
                this.push3(tangentBuffer, tan);
            }

            var nrm=[0, n, 0];
            this.push3(normalBuffer, nrm);

            this.push2(uvBuffer, uvs);
        }
    }

    agregarTapaRepetido(v, n, positionBuffer, normalBuffer, uvBuffer, tangentBuffer) {

        let posCentro = this.getCentro(v);
        let uvCentro = this.getUVCentro(posCentro);
        let tangents = []; // Tangentes de los triángulos que conforman la tapa.
        let prevPos, prevUV;

        for (var j=0; j <= this.columnas; j++) {
    
            var u=j/this.columnas;

            var pos=this.getPosicion(u,v);
            this.push3(positionBuffer, pos);

            if (!this.calcularTangentes) {
                var tan = [n, 0, 0];
                this.push3(tangentBuffer, tan);
            }

            var nrm=[0, n, 0];
            this.push3(normalBuffer, nrm);

            var uvs = this.getUVCentro(pos);
            this.push2(uvBuffer, uvs);

            if (this.calcularTangentes) {
                if (j > 0) {
                    // A partir del segundo vértice, con el anterior y el centro
                    // tengo un triángulo para el que calculo la tangente.
                    let t = this.calcularTangente(n, prevPos, pos, posCentro, prevUV, uvs, uvCentro);
                    tangents.push(t);
                }
                prevPos = pos;
                prevUV = uvs;
            }
        }

        if (this.calcularTangentes) {
            if (v == 1) {
                this.agregarTangentesCentro(tangentBuffer, tangents);
                this.agregarTangentesPerimetro(tangentBuffer, tangents);
            } else {
                this.agregarTangentesPerimetro(tangentBuffer, tangents);
                this.agregarTangentesCentro(tangentBuffer, tangents);
            }
        }
    }

    calcularTangente(n, pos1, pos2, pos3, uv1, uv2, uv3) {

        if (this.esTrianguloDegenerado(pos1, pos2, pos3)) {
            return [0, 0, 0];
        }
        let edge1 = vec3.create();
        let edge2 = vec3.create();
        vec3.sub(edge1, pos2, pos1);
        vec3.sub(edge2, pos3, pos1);

        let deltaUV1 = vec2.create();
        let deltaUV2 = vec2.create();
        vec2.sub(deltaUV1, uv2, uv1);
        vec2.sub(deltaUV2, uv3, uv1);

        let f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);
        let tangent = vec3.create();
        tangent[0] = n * f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]);
        tangent[1] = n * f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]);
        tangent[2] = n * f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]);

        return tangent;
    }

    calcularTangenteCentro(tangents) {

        let avg = vec3.fromValues(0, 0, 0);
        for (let i = 0; i < tangents.length; i++) {
            vec3.add(avg, avg, tangents[i]);
        }
        vec3.normalize(avg, avg);
        return avg;
    }

    agregarTangentesCentro(tangentBuffer, tangents) {

        let avg = this.calcularTangenteCentro(tangents);
        for (var j=0; j <= this.columnas; j++) {
            this.push3(tangentBuffer, avg);
        }
    }

    agregarTangentesPerimetro(tangentBuffer, tangents) {

        // La tangente del primer vértice se calcula con la del primer y último triángulo.
        let prevTangent = tangents[tangents.length - 1];
        let lastAvgTangent;
        for (let i = 0; i < tangents.length; i++) {
            let tangent = tangents[i];
            let avgTangent = vec3.create();
            vec3.add(avgTangent, tangent, prevTangent);
            vec3.normalize(avgTangent, avgTangent);
            this.push3(tangentBuffer, avgTangent);
            if(i == 0) {
                // La tangente del último vértice es igual a la del primero.
                lastAvgTangent = avgTangent;
            }
            prevTangent = tangent;
        }
        this.push3(tangentBuffer, lastAvgTangent);
    }

    esTrianguloDegenerado(pos1, pos2, pos3) {

        return vec3.equals(pos1, pos2) ||
               vec3.equals(pos2, pos3) ||
               vec3.equals(pos3, pos1);
    }

    agregarTapa(v, positionBuffer, normalBuffer, uvBuffer, tangentBuffer) {

        if (v == 1) {
            this.agregarTapaRepetido(v, 1, positionBuffer, normalBuffer, uvBuffer, tangentBuffer);
            this.agregarTapaCentro(v, 1, positionBuffer, normalBuffer, uvBuffer, tangentBuffer);
        } else {
            this.agregarTapaCentro(v, -1, positionBuffer, normalBuffer, uvBuffer, tangentBuffer);
            this.agregarTapaRepetido(v, -1, positionBuffer, normalBuffer, uvBuffer, tangentBuffer);
        }
    }

    generarSuperficie() {
        
        let positionBuffer = [];
        let normalBuffer = [];
        let uvBuffer = [];
        let tangentBuffer = [];

        if (this.tapar) {
            this.agregarTapa(0, positionBuffer, normalBuffer, uvBuffer, tangentBuffer);
        }

        for (var i=0; i <= this.filas; i++) {
            for (var j=0; j <= this.columnas; j++) {
    
                var u=j/this.columnas;
                var v=i/this.filas;
    
                var pos=this.getPosicion(u,v);
                this.push3(positionBuffer, pos);
    
                var tan=this.getTangente(u,v);
                this.push3(tangentBuffer, tan);

                var nrm = this.getNormal(u,v);
                this.push3(normalBuffer, nrm);
    
                var uvs = [];
                if (this.tipoTextura == texturaAjustadaXRepetidaY) {
                    let x = this.cabezal.getCoordenadaTextura(u);
                    let y = this.trayectoria.getCoordenadaTexturaRepetida(v, this.cabezal.acc);
                    uvs = [x, y];
                } else if (this.tipoTextura == texturaRepetida) {
                    let x = this.cabezal.getCoordenadaTexturaRepetida(u);
                    let y = this.trayectoria.getCoordenadaTexturaRepetida(v, 1);
                    uvs = [x, y];
                } else {
                    let x = this.cabezal.getCoordenadaTextura(u);
                    let y = this.trayectoria.getCoordenadaTextura(v);
                    uvs = [x, y];
                }
                this.push2(uvBuffer, uvs);
            }
        }

        if (this.tapar) {
            if (this.tapar) {
                this.agregarTapa(1, positionBuffer, normalBuffer, uvBuffer, tangentBuffer);
            }
            this.filas += 4;
        }
    
        // Buffer de indices de los triángulos
        
        let indexBuffer = [];
        let stride = this.columnas + 1;
    
        for (i=0; i < this.filas; i++) {
            let ri = i * stride;
            let ni = (i + 1) * stride;
            let nj;
            indexBuffer.push(ri);
            indexBuffer.push(ni);
            for (j=0; j < this.columnas; j++) {
    
                // completar la lógica necesaria para llenar el indexbuffer en funcion de filas y columnas
                // teniendo en cuenta que se va a dibujar todo el buffer con la primitiva "triangle_strip" 
                
                nj = j + 1;

                indexBuffer.push(ri + nj);
                indexBuffer.push(ni + nj);
            }
            if (i + 1 < this.filas) {
                indexBuffer.push(ni + nj);
                indexBuffer.push(ni);
            }
        }

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
    
        let webgl_tangent_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_tangent_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangentBuffer), gl.STATIC_DRAW);
        webgl_tangent_buffer.itemSize = 3;
        webgl_tangent_buffer.numItems = tangentBuffer.length / 3;
    
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
            webgl_tangent_buffer,
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

    drawTierra(drawMalla, textura0, textura1, textura2) {
        glPrograms.tierra.setup(this.getModelMatrix(), glPrograms.tierra, textura0, textura1, textura2);
        drawMalla(this.getMalla(), glPrograms.tierra);
    }

    drawTexturado(drawMalla, textura) {
        glPrograms.texturado.setup(this.getModelMatrix(), glPrograms.texturado, textura);
        drawMalla(this.getMalla(), glPrograms.texturado);
    }

    drawWithNormalMap(drawMalla, textura, normalMap) {
        glPrograms.normalMap.setup(this.getModelMatrix(), glPrograms.normalMap, textura, normalMap);
        drawMalla(this.getMalla(), glPrograms.normalMap, true);
    }

    drawSolido(drawMalla, color) {
        glPrograms.solido.setup(this.getModelMatrix(), glPrograms.solido, color);
        drawMalla(this.getMalla(), glPrograms.solido);
    }

    drawVidrio(drawMalla) {
        glPrograms.vidrio.setup(this.getModelMatrix(), glPrograms.vidrio);
        drawMalla(this.getMalla(), glPrograms.vidrio);
    }

    push3(array, e) {
        array.push(e[0]);
        array.push(e[1]);
        array.push(e[2]);
    }

    push2(array, e) {
        array.push(e[0]);
        array.push(e[1]);
    }
}