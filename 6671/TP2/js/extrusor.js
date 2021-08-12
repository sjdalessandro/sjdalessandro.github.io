class Extrusor {
    constructor(cabezal, trayectoria, tapar, tipoTextura, tipoTexturaEnTapa) {
        this.modelMatrix = mat4.create();
        mat4.identity(this.modelMatrix);
        this.cabezal = cabezal;
        this.trayectoria = trayectoria;
        this.tapar = tapar;
        this.tipoTextura = tipoTextura;
        this.tipoTexturaEnTapa = tipoTexturaEnTapa;
        this.columnas = cabezal.getVerticesLength();
        this.filas = trayectoria.getMatricesLength() - 1;
        this.malla = undefined;
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

    agregarTapaCentro(v, n, positionBuffer, normalBuffer, uvBuffer, tangentBuffer) {
        var pos=this.getCentro(v);

        for (var j=0; j <= this.columnas; j++) {

            var u=j/this.columnas;

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var tan = [1, 0, 0];

            tangentBuffer.push(tan[0]);
            tangentBuffer.push(tan[1]);
            tangentBuffer.push(tan[2]);

            var nrm=[0, n, 0];

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs = [pos[0], pos[2]];
            if (this.tipoTexturaEnTapa == texturaAjustada) {
                uvs = this.cabezal.escalarATextura(uvs);
            }

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
    }

    agregarTapaRepetido(v, n, positionBuffer, normalBuffer, uvBuffer, tangentBuffer) {
        for (var j=0; j <= this.columnas; j++) {
    
            var u=j/this.columnas;

            var pos=this.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var tan = [1, 0, 0];
    
            tangentBuffer.push(tan[0]);
            tangentBuffer.push(tan[1]);
            tangentBuffer.push(tan[2]);

            var nrm=[0, n, 0];

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs = [pos[0], pos[2]];
            if (this.tipoTexturaEnTapa == texturaAjustada) {
                uvs = this.cabezal.escalarATextura(uvs);
            }

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
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
    
                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);
    
                var tan=this.getTangente(u,v);
    
                tangentBuffer.push(tan[0]);
                tangentBuffer.push(tan[1]);
                tangentBuffer.push(tan[2]);
    
                var nrm = this.getNormal(u,v);
    
                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);
    
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

                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
    
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
}