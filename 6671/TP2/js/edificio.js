class Edificio {
    constructor(posicion, ventanasLargo, ventanasAncho, pisosGrandes, pisosChicos, columnasLen) {
        this.posicion = posicion;

        this.ventanaLado = 2.0;
        this.ventanaEspesor = 0.05;
        this.colorVentana = [0, 0.3, 0.8];

        this.toboganZ = 0;

        this.alturaLosa = 0.3;
        this.factorRepeticionTapaLosa = 0.3;
        this.alturaBase = this.ventanaLado;
        this.colorBase = [0.15, 0.15, 0.15];
        this.colorBase = [0.4, 0.25, 0.25];

        this.reset(ventanasLargo, ventanasAncho, pisosGrandes, pisosChicos, columnasLen);
    }

    reset(ventanasLargo, ventanasAncho, pisosGrandes, pisosChicos, columnasLen) {
        this.ventanasLargo = ventanasLargo;
        this.ventanasAncho = ventanasAncho;
        this.pisosGrandes = pisosGrandes;
        this.pisosChicos = pisosChicos;
        this.columnasLen = columnasLen;
        this.pisosTotales = this.pisosGrandes + this.pisosChicos;
        this.modificada = true;

        this.ancho = this.ventanasAncho * this.ventanaLado;
        this.largo = this.ventanasLargo * this.ventanaLado;

        this.verticesLosa = this.getVerticesLosa();

        let cabezalBase = new CabezalBaseEdificio(this.ancho/2, this.largo/2, this.ancho/4);
        let trayectoriaBase = new TrayectoriaRecta(this.alturaBase);
        this.base = new Extrusor(cabezalBase, trayectoriaBase, false, texturaRepetida);
        this.entrada = new Cuboide(this.ancho/4, 0.5, this.alturaBase, true, texturaRepetida);

        this.altoAscensores = (this.ventanaLado + this.alturaLosa) * (this.pisosTotales + 1);
        this.ascensores = new Cuboide(3, 7, this.altoAscensores, true, texturaAjustadaXRepetidaY, texturaAjustada);

        this.pisos = this.crearPisosGrandes();
        this.losa = this.crearLosa(this.verticesLosa);
        this.pisosChicos = this.crearPisosChicos();

        this.actualizar();
    }

    getToboganZ() {
        return this.toboganZ + 1.5;
    }

    getVerticesLosa() {
        const stepY = this.largo/(this.ventanasLargo/2);
        const stepX = this.ancho/(this.ventanasAncho/2);
        const d = this.ancho/4;
        const x0 = -this.ancho/2 - d;
        const xf = this.ancho/2 + d;
        const y0 = -this.largo/2 - d;
        const yf = this.largo/2 + d;
        let xvertices0 = [];
        let xverticesf = [];
        for (let x = x0 + stepX; x <= xf; x += stepX) {
            xvertices0.push([x, 0, y0]);
            xverticesf.push([x, 0, yf]);
        }
        xverticesf.reverse();
        let yvertices0 = [];
        let yverticesf = [];
        for (let y = y0 + stepY; y <= yf; y += stepY) {
            yvertices0.push([x0, 0, y]);
            yverticesf.push([xf, 0, y]);
        }
        yvertices0.reverse();
        let vertices = [...xvertices0, ...yverticesf, ...xverticesf, ...yvertices0];
        this.desplazar(vertices, -d/2, d/2);
        return vertices;
    }

    desplazar(vertices, min, max) {
        this.toboganZ = 0;
        for (let i = 0; i < vertices.length; i++) {
            let v = vertices[i];
            v[0] += Math.random()*(max - min) + min;
            v[2] += Math.random()*(max - min) + min;
            if (this.toboganZ < v[2]) {
                this.toboganZ = v[2];
            }
        }
    }

    crearLosa(verticesLosa) {
        let cabezalLosa = new CabezalBSplineCuadratica(verticesLosa);
        let trayectoriaLosa = new TrayectoriaRecta(this.alturaLosa);
        return new Extrusor(cabezalLosa, trayectoriaLosa, true, texturaRepetida, texturaRepetida, this.factorRepeticionTapaLosa, true);
    }

    crearPisosGrandes() {
        let pisos = [];
        for (let i = 0; i < this.pisosGrandes; i++) {
            pisos.push(new Piso(
                [0, 0, 0],
                this.verticesLosa,
                this.ventanasAncho,
                this.ventanasLargo,
                false,
                this.columnasLen
            ));
        }
        return pisos;
    }

    crearPisosChicos() {
        let pisos = [];
        let vertices = this.escalarVertices(this.verticesLosa, 0.85);
        for (let i = 0; i < this.pisosChicos; i++) {
            pisos.push(new Piso(
                [0, 0, 0],
                vertices,
                this.ventanasAncho,
                this.ventanasLargo,
                true,
                this.columnasLen
            ));
        }
        return pisos;
    }


    escalarVertices(vertices, f) {
        let verticesChico = [];
        for (let i = 0; i < vertices.length; i++) {
            verticesChico.push([f*vertices[i][0], vertices[i][1], f*vertices[i][2]]);
        }
        return verticesChico;
    }

    actualizar(modelMatrixA) {

        if (!modelMatrixA) {
            modelMatrixA = mat4.create();
            mat4.identity(modelMatrixA);
        }

        if (this.posicion) {
            mat4.translate(modelMatrixA, modelMatrixA, this.posicion);
        }

        this.base.setModelMatrix(modelMatrixA);

        let modelMatrixEntrada = mat4.create();
        mat4.translate(modelMatrixEntrada, modelMatrixA, [0, 0, this.largo/2-1]);
        this.entrada.setModelMatrix(modelMatrixEntrada);

        let modelMatrixBase = mat4.create();
        mat4.translate(modelMatrixBase, modelMatrixA, [0, this.alturaBase, 0]);

        let modelMatrixAscensores = mat4.create();
        mat4.translate(modelMatrixAscensores, modelMatrixBase,
                [0, 0.1, 0]);
        this.ascensores.setModelMatrix(modelMatrixAscensores);

        let modelMatrixUltimoPiso = undefined;
        this.pisos.forEach((piso, i) => {
            let modelMatrixPiso = mat4.create();
            mat4.translate(modelMatrixPiso, modelMatrixBase,
                    [0, i*(this.alturaLosa + this.ventanaLado), 0]);
            modelMatrixUltimoPiso = piso.actualizar(modelMatrixPiso);
        });

        this.losa.setModelMatrix(modelMatrixUltimoPiso);

        let modelMatrixPisosChicos = mat4.create();
        mat4.translate(modelMatrixPisosChicos, modelMatrixUltimoPiso,
                [0, this.alturaLosa, 0]);
        this.pisosChicos.forEach((piso, i) => {
            let modelMatrixPiso = mat4.create();
            mat4.translate(modelMatrixPiso, modelMatrixPisosChicos,
                    [0, i*(this.alturaLosa + this.ventanaLado), 0]);
            modelMatrixUltimoPiso = piso.actualizar(modelMatrixPiso);
        });

        this.modificada = false;
    }

    draw(drawMalla) {
        if (this.modificada) {
            this.actualizar();
        }

        this.pisos.forEach((piso, i) => {
            piso.draw(drawMalla);
        });
        this.ascensores.drawWithNormalMap(drawMalla, texturas.ascensores, texturas.ascensoresNormalMap);
        this.losa.drawWithNormalMap(drawMalla, texturas.cemento, texturas.cementoNormalMap);
        this.pisosChicos.forEach((piso, i) => {
            piso.draw(drawMalla);
        });
        this.base.drawWithNormalMap(drawMalla, texturas.baseEdificio, texturas.baseEdificioNormalMap);
        this.entrada.drawWithNormalMap(drawMalla, texturas.maderaEntrada, texturas.maderaEntradaNormalMap);
    }
}