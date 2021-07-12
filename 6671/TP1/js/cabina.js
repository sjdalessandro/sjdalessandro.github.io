class Cabina {
    constructor(posicion) {
        this.posicion = posicion;
        this.modificada = true;
        this.altura = 2;
        this.ancho = 3;
        this.pared = 0.2;
        this.alturaSoporte = 2;

        this.extrusorPiso = this.crearPlataforma(5, this.ancho);
        this.extrusorTecho = this.crearPlataforma(4, this.ancho);
        this.extrusorSoporteA = this.crearSoporte(0.8);
        this.extrusorSoporteB = this.crearSoporte(0.8);

        this.lateralA = new Cuboide(3, this.altura, this.pared, true);
        this.lateralB = new Cuboide(3, this.altura, this.pared, true);

        this.fondo = new Cuboide(this.altura, 3, this.pared, true);

        this.actualizar();
    }

    crearPlataforma(ancho, largo) {
        return new Cuboide(ancho, largo, this.pared, true);
    }

    crearSoporte(ancho) {
        return new Cuboide(ancho, this.alturaSoporte, this.pared, true);
    }

    actualizar(modelMatrixPiso) {

        if (!modelMatrixPiso) {
            modelMatrixPiso = mat4.create();
            mat4.identity(modelMatrixPiso);
        }

        if (this.posicion) {
            mat4.translate(modelMatrixPiso, modelMatrixPiso, this.posicion);
        }

        this.extrusorPiso.setModelMatrix(modelMatrixPiso);

        this.actualizarLateral(this.lateralA, modelMatrixPiso, 1, -this.pared);
        this.actualizarLateral(this.lateralB, modelMatrixPiso, -1, 0);

        let modelMatrixFondo = mat4.create();
        mat4.translate(modelMatrixFondo, modelMatrixPiso,
                [2.5, this.altura/2, 0]);
        mat4.rotate(modelMatrixFondo, modelMatrixFondo, Math.PI/2, [0, 0, 1]);
        this.fondo.setModelMatrix(modelMatrixFondo);

        let modelMatrixTecho = mat4.create();
        mat4.translate(modelMatrixTecho, modelMatrixPiso,
                [0.5, this.altura, 0]);
        this.extrusorTecho.setModelMatrix(modelMatrixTecho);

        this.actualizarSoporte(this.extrusorSoporteA, modelMatrixTecho, 0.45);
        this.actualizarSoporte(this.extrusorSoporteB, modelMatrixTecho, -0.45);

        this.modificada = false;

        let modelMatrixCabina = mat4.create();
        mat4.translate(modelMatrixCabina, modelMatrixTecho,
            [0, 3*this.alturaSoporte/4, 0]);
        return modelMatrixCabina;
    }

    actualizarLateral(lateral, modelMatrix, f, g) {
            let modelMatrixLateral = mat4.create();
        mat4.translate(modelMatrixLateral, modelMatrix,
                [1, this.altura/2, f*(this.ancho/2 + g)]);
        mat4.rotate(modelMatrixLateral, modelMatrixLateral, Math.PI/2, [1, 0, 0]);
        lateral.setModelMatrix(modelMatrixLateral);
        return modelMatrixLateral;
    }

    actualizarSoporte(extrusor, modelMatrix, delta) {
        let modelMatrixSoporte = mat4.create();
        mat4.translate(modelMatrixSoporte, modelMatrix,
                [0, this.pared + this.alturaSoporte/2, delta]);
        mat4.rotate(modelMatrixSoporte, modelMatrixSoporte, Math.PI/2, [1, 0, 0]);
        mat4.translate(modelMatrixSoporte, modelMatrixSoporte,
            [0, -this.pared/2, 0]);
        extrusor.setModelMatrix(modelMatrixSoporte);
    }

    draw(setupVertexShaderMatrix, drawMalla, color) {
        if (this.modificada) {
            this.actualizar();
        }

        this.extrusorPiso.draw(setupVertexShaderMatrix, drawMalla, color);
        this.lateralA.draw(setupVertexShaderMatrix, drawMalla, color);
        this.lateralB.draw(setupVertexShaderMatrix, drawMalla, color);
        this.extrusorTecho.draw(setupVertexShaderMatrix, drawMalla, color);
        this.extrusorSoporteA.draw(setupVertexShaderMatrix, drawMalla, color);
        this.extrusorSoporteB.draw(setupVertexShaderMatrix, drawMalla, color);
        this.fondo.draw(setupVertexShaderMatrix, drawMalla, color);
    }
}