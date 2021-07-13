class Edificio {
    constructor(posicion, ventanasLargo, ventanasAncho, pisosGrandes, pisosChicos, columnasLen) {
        this.posicion = posicion;

        this.ventanaLado = 2.0;
        this.ventanaEspesor = 0.05;
        this.colorVentana = [0, 0.3, 0.8];

        this.alturaLosa = 0.3;
        this.alturaBase = 3;
        this.colorBase = [0.15, 0.15, 0.15];
        this.colorBase = [0.4, 0.25, 0.25];

        this.reset(ventanasLargo, ventanasAncho, pisosGrandes, pisosChicos, columnasLen);

        window.addEventListener("keydown", event => {
            this.keyEvent(event);
        }, false);
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

        let cabezalBase = new CabezalBaseEdificio(5, 7, 2);
        let trayectoriaBase = new TrayectoriaRecta(this.alturaBase);
        this.base = new Extrusor(cabezalBase, trayectoriaBase, true);

        this.colorAscensores = [0.4, 0.3, 0.3];
        this.altoAscensores = (this.ventanaLado + this.alturaLosa) * (this.pisosTotales + 1);
        this.ascensores = new Cuboide(3, 7, this.altoAscensores, true);

        this.pisos = this.crearPisosGrandes();
        this.losa = this.crearLosa(this.verticesLosa);
        this.pisosChicos = this.crearPisosChicos();

        this.actualizar();
    }

    getVerticesLosa() {
        const stepY = this.largo/5;
        const stepX = this.ancho/3;
        const d = this.ancho/4;
        const x0 = -this.ancho/2 - d;
        const xf = this.ancho/2 + d;
        const y0 = -this.largo/2 - d;
        const yf = this.largo/2 + d;
        let xvertices0 = [];
        let xverticesf = [];
        for (let x = x0 + stepX; x <= xf; x += stepX) {
            xvertices0.push([x, y0]);
            xverticesf.push([x, yf]);
        }
        xverticesf.reverse();
        let yvertices0 = [];
        let yverticesf = [];
        for (let y = y0 + stepY; y <= yf; y += stepY) {
            yvertices0.push([x0, y]);
            yverticesf.push([xf, y]);
        }
        yvertices0.reverse();
        let vertices = [...xvertices0, ...yverticesf, ...xverticesf, ...yvertices0];
        this.desplazar(vertices, -d/2, d/2);
        return vertices;
    }

    desplazar(vertices, min, max) {
        for (let i = 0; i < vertices.length; i++) {
            let v = vertices[i];
            v[0] += Math.random()*(max - min) + min;
            v[1] += Math.random()*(max - min) + min;
        }
    }

    crearLosa(verticesLosa) {
        let cabezalLosa = new CabezalBCuadratica(verticesLosa);
        let trayectoriaLosa = new TrayectoriaRecta(this.alturaLosa);
        return new Extrusor(cabezalLosa, trayectoriaLosa, true);
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
            verticesChico.push([f*vertices[i][0], f*vertices[i][1]]);
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

        let modelMatrixBase = mat4.create();
        mat4.translate(modelMatrixBase, modelMatrixA, [0, this.alturaBase, 0]);

        let modelMatrixAscensores = mat4.create();
        mat4.translate(modelMatrixAscensores, modelMatrixBase,
                [0, 0, 0]);
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

    draw(setupVertexShaderMatrix, drawMalla) {
        if (this.modificada) {
            this.actualizar();
        }

        this.pisos.forEach((piso, i) => {
            piso.draw(setupVertexShaderMatrix, drawMalla);
        });
        this.ascensores.draw(setupVertexShaderMatrix, drawMalla, this.colorAscensores);
        this.losa.draw(setupVertexShaderMatrix, drawMalla, this.pisos[0].colorLosa);
        this.pisosChicos.forEach((piso, i) => {
            piso.draw(setupVertexShaderMatrix, drawMalla);
        });
        this.base.draw(setupVertexShaderMatrix, drawMalla, this.colorBase);
    }
 
    keyEvent(event) {
        let key = event.keyCode || event.which;
        let keychar = String.fromCharCode(key);
        // if (keychar == "Q") {}
    }
}