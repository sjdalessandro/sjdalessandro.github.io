class Grua {
    constructor(posicion) {
        this.posicion = posicion;
        this.posicionCamaraCabina = undefined;
        this.anguloCamaraCabina = 0;
        this.alturaSegmentoColumna = 4;
        this.elevacionSegmentoColumna = 1;
        this.modificada = true;
        this.largoEje = 1.5;
        this.largoBrazo = 24;
        this.anguloBrazo = 0;
        this.anguloCabina = 23*Math.PI/32;
        this.largoSoga = 3;
        this.largoSogaExtra = 3;
        this.colorColumna = [0.7, 0.7, 0.0];
        this.colorColumnaC = [0.3, 0.3, 0.5];
        this.colorEje = [0.3, 0.3, 0.3];
        this.colorBrazo = this.colorColumna;
        this.colorSoga = [0.3, 0.1, 0.0];
        this.colorPlataforma = [0.4, 0.2, 0.0];
        this.colorContrapeso = [0.5, 0.5, 0.5];
    
        this.extrusorCuboA = this.crearColumna(1.5);
        this.extrusorCuboB = this.crearColumna(1.2);

        let cabezalCuboC = new CabezalCilindro(0.8);
        let trayectoriaRectaC = new TrayectoriaRecta(this.alturaSegmentoColumna);
        this.extrusorCuboC = new Extrusor(cabezalCuboC, trayectoriaRectaC, true);

        this.cabina = new Cabina();

        this.extrusorEjeE = this.crearEje(0.5);

        this.brazo = new Cuboide(0.7, 0.7, this.largoBrazo, true);

        this.extrusorEjeG = this.crearEje(0.5);

        let cabezalSoga = new CabezalCilindro(0.05);
        let trayectoriaSoga = new TrayectoriaRecta(1);
        this.extrusorSoga = new Extrusor(cabezalSoga, trayectoriaSoga, true);
        let trayectoriaSogaExtra = new TrayectoriaRecta(this.largoSogaExtra);
        this.extrusorSogaA = new Extrusor(cabezalSoga, trayectoriaSogaExtra, true);
        this.extrusorSogaB = new Extrusor(cabezalSoga, trayectoriaSogaExtra, true);
        this.extrusorSogaC = new Extrusor(cabezalSoga, trayectoriaSogaExtra, true);
        this.extrusorSogaD = new Extrusor(cabezalSoga, trayectoriaSogaExtra, true);

        this.plataforma = new Cuboide(3.3, 3.3, 0.05, true);

        this.contrapeso = new Cuboide(4, 2, 2, true);

        this.actualizar();

        window.addEventListener("keydown", event => {
            this.keyEvent(event);
        }, false);
    }

    crearColumna(ancho) {
        return new Cuboide(ancho, ancho, this.alturaSegmentoColumna, true);
    }

    crearEje(diametro) {
        let cabezalEjeE = new CabezalCilindro(diametro);
        let trayectoriaEjeE = new TrayectoriaRecta(this.largoEje);
        return new Extrusor(cabezalEjeE, trayectoriaEjeE, true);
    }

    actualizar(modelMatrixA) {

        if (!modelMatrixA) {
            modelMatrixA = mat4.create();
            mat4.identity(modelMatrixA);
        }

        if (this.posicion) {
            mat4.translate(modelMatrixA, modelMatrixA, this.posicion);
        }

        this.extrusorCuboA.setModelMatrix(modelMatrixA);

        let modelMatrixB = mat4.create();
        mat4.translate(modelMatrixB, modelMatrixA, [0, this.alturaSegmentoColumna, 0]);
        this.extrusorCuboB.setModelMatrix(modelMatrixB);

        let modelMatrixC = mat4.create();
        mat4.translate(modelMatrixC, modelMatrixB, [0, this.alturaSegmentoColumna, 0]);
        mat4.scale(modelMatrixC, modelMatrixC, [1, this.elevacionSegmentoColumna, 1]);
        this.extrusorCuboC.setModelMatrix(modelMatrixC);

        let modelMatrixCabina = mat4.create();
        mat4.translate(modelMatrixCabina, modelMatrixC, [0, this.alturaSegmentoColumna, 0]);
        mat4.scale(modelMatrixCabina, modelMatrixCabina, [1, 1/this.elevacionSegmentoColumna, 1]);
        mat4.rotate(modelMatrixCabina, modelMatrixCabina, this.anguloCabina, [0, 1, 0]);
        modelMatrixCabina = this.cabina.actualizar(modelMatrixCabina);

        this.posicionCamaraCabina = [
            -this.posicion[0],
            -this.posicion[1] - 2*this.alturaSegmentoColumna - this.elevacionSegmentoColumna*this.alturaSegmentoColumna - this.cabina.altura/2,
            -this.posicion[2]
        ];

        this.actualizarEje(this.extrusorEjeE, modelMatrixCabina, 0);

        let modelMatrixContrapeso = mat4.clone(modelMatrixCabina);
        mat4.rotate(modelMatrixContrapeso, modelMatrixContrapeso, this.anguloBrazo, [0, 0, 1]);
        mat4.translate(modelMatrixContrapeso, modelMatrixContrapeso, [9, -1, 0]);
        this.contrapeso.setModelMatrix(modelMatrixContrapeso);

        let modelMatrixBrazo = mat4.clone(modelMatrixCabina);
        mat4.rotate(modelMatrixBrazo, modelMatrixBrazo, Math.PI/2 + this.anguloBrazo, [0, 0, 1]);
        mat4.translate(modelMatrixBrazo, modelMatrixBrazo, [0, -7, 0]);
        this.brazo.setModelMatrix(modelMatrixBrazo);

        this.anguloCamaraCabina = -Math.PI/2 - this.anguloCabina;

        let modelMatrixEjeG = this.actualizarEje(this.extrusorEjeG, modelMatrixBrazo, this.largoBrazo-0.5);

        let modelMatrixSoga = mat4.create();
        mat4.translate(modelMatrixSoga, modelMatrixEjeG, [0, this.largoEje/2, 0]);
        mat4.rotate(modelMatrixSoga, modelMatrixSoga, Math.PI/2, [0, 0, 1]);
        mat4.rotate(modelMatrixSoga, modelMatrixSoga, -this.anguloBrazo, [1, 0, 0]); // Compenso el ángulo del brazo
        mat4.scale(modelMatrixSoga, modelMatrixSoga, [1, this.largoSoga, 1]);
        this.extrusorSoga.setModelMatrix(modelMatrixSoga);

        this.actualizarSoga(this.extrusorSogaA, modelMatrixSoga, 1, 1);
        this.actualizarSoga(this.extrusorSogaB, modelMatrixSoga, -1, 1);
        this.actualizarSoga(this.extrusorSogaC, modelMatrixSoga, 1, -1);
        this.actualizarSoga(this.extrusorSogaD, modelMatrixSoga, -1, -1);

        let modelMatrixPlataforma = mat4.create();
        mat4.translate(modelMatrixPlataforma, modelMatrixSoga, [0, 1, 0]);
        mat4.scale(modelMatrixPlataforma, modelMatrixPlataforma, [1, 1/this.largoSoga, 1]);
        mat4.translate(modelMatrixPlataforma, modelMatrixPlataforma,
            [0, this.largoSogaExtra*Math.cos(Math.PI/4), 0]);
        this.plataforma.setModelMatrix(modelMatrixPlataforma);

        this.modificada = false;
    }

    actualizarSoga(soga, modelMatrix, a, v) {
        let modelMatrixSoga = mat4.create();
        mat4.translate(modelMatrixSoga, modelMatrix, [0, 1, 0]);
        mat4.scale(modelMatrixSoga, modelMatrixSoga, [1, 1/this.largoSoga, 1]);
        mat4.rotate(modelMatrixSoga, modelMatrixSoga, a*Math.PI/4, [v*1, 0, 1]);
        soga.setModelMatrix(modelMatrixSoga);
        return modelMatrixSoga;
    }

    actualizarEje(eje, modelMatrix, delta) {
        let modelMatrixEje = mat4.create();
        mat4.translate(modelMatrixEje, modelMatrix, [0, delta, -this.largoEje/2]);
        mat4.rotate(modelMatrixEje, modelMatrixEje, Math.PI/2, [1, 0, 0]);
        eje.setModelMatrix(modelMatrixEje);
        return modelMatrixEje;
    }

    draw(setupVertexShaderMatrix, drawMalla, vista) {
        if (this.modificada) {
            this.actualizar();
            vista();
        }

        this.extrusorCuboA.draw(setupVertexShaderMatrix, drawMalla, this.colorColumna);
        this.extrusorCuboB.draw(setupVertexShaderMatrix, drawMalla, this.colorColumna);
        this.extrusorCuboC.draw(setupVertexShaderMatrix, drawMalla, this.colorColumnaC);
        this.cabina.draw(setupVertexShaderMatrix, drawMalla, this.colorColumna);
        this.extrusorEjeE.draw(setupVertexShaderMatrix, drawMalla, this.colorEje);
        this.brazo.draw(setupVertexShaderMatrix, drawMalla, this.colorBrazo);
        this.extrusorEjeG.draw(setupVertexShaderMatrix, drawMalla, this.colorEje);
        this.extrusorSoga.draw(setupVertexShaderMatrix, drawMalla, this.colorSoga);
        this.extrusorSogaA.draw(setupVertexShaderMatrix, drawMalla, this.colorSoga);
        this.extrusorSogaB.draw(setupVertexShaderMatrix, drawMalla, this.colorSoga);
        this.extrusorSogaC.draw(setupVertexShaderMatrix, drawMalla, this.colorSoga);
        this.extrusorSogaD.draw(setupVertexShaderMatrix, drawMalla, this.colorSoga);
        this.plataforma.draw(setupVertexShaderMatrix, drawMalla, this.colorPlataforma);
        this.contrapeso.draw(setupVertexShaderMatrix, drawMalla, this.colorContrapeso);
    }
    
    keyEvent(event) {
        let key = event.keyCode || event.which;
        let keychar = String.fromCharCode(key);
        if (keychar == "Q") {
            if (this.elevacionSegmentoColumna < 10) {
                this.elevacionSegmentoColumna += 0.05;
                this.modificada = true;
            }
        } else if (keychar == "A") {
            if (this.elevacionSegmentoColumna > 0) {
                this.elevacionSegmentoColumna -= 0.05;
                this.modificada = true;
            }
        }
        if (keychar == "W") {
            if (this.largoSoga > 1) {
                this.largoSoga -= 0.1;
                this.modificada = true;
            }
        } else if (keychar == "S") {
            this.largoSoga += 0.1;
            this.modificada = true;
        }
        if (keychar == "I") {
            if (this.anguloBrazo > -Math.PI/8) {
                this.anguloBrazo -= 0.01;
                this.modificada = true;
            }
        } else if (keychar == "K") {
            if (this.anguloBrazo < Math.PI/8) {
                this.anguloBrazo += 0.01;
                this.modificada = true;
            }
        }
        if (keychar == "J") {
            this.anguloCabina += 0.01;
            this.modificada = true;
        } else if (keychar == "L") {
            this.anguloCabina -= 0.01;
            this.modificada = true;
        }
    }
}