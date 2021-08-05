class Grua {
    constructor(getCamara, posicion) {
        this.posicion = posicion;
        this.posicionCamaraCabina = undefined;
        this.anguloCamaraCabina = 0;
        this.alturaSegmentoColumna = 4;
        this.elevacionSegmentoColumna1 = this.alturaSegmentoColumna;
        this.factorDeEscaladoPiston = 1;
        this.largoEje = 1.5;
        this.largoBrazo = 24;
        this.anguloBrazo = 0;
        this.anguloCabina = 23*Math.PI/32;
        this.largoSoga = 3;
        this.largoSogaExtra = 3;
        this.colorEje = [0.3, 0.3, 0.3];
        this.colorSoga = [0.3, 0.1, 0.0];
        this.colorContrapeso = [0.5, 0.5, 0.5];
        this.colorPiston = [0.3, 0.3, 0.5];
        this.getCamara = getCamara;
        this.resetDeltas();
    
        this.extrusorCuboA = this.crearColumna(1.5);
        this.extrusorCuboB = this.crearColumna(1.2);

        let cabezalCuboC = new CabezalCilindro(0.8);
        let trayectoriaRectaC = new TrayectoriaRecta(this.alturaSegmentoColumna);
        this.extrusorCuboC = new Extrusor(cabezalCuboC, trayectoriaRectaC, true);

        this.cabina = new Cabina();

        this.extrusorEjeE = this.crearEje(0.5);

        this.brazo = new Cuboide(0.7, 0.7, this.largoBrazo, true, texturaAjustadaXRepetidaY, texturaAjustada);

        this.extrusorEjeG = this.crearEje(0.5);

        let cabezalSoga = new CabezalCilindro(0.05);
        let trayectoriaSoga = new TrayectoriaRecta(1);
        this.extrusorSoga = new Extrusor(cabezalSoga, trayectoriaSoga, true);
        let trayectoriaSogaExtra = new TrayectoriaRecta(this.largoSogaExtra);
        this.extrusorSogaA = new Extrusor(cabezalSoga, trayectoriaSogaExtra, true);
        this.extrusorSogaB = new Extrusor(cabezalSoga, trayectoriaSogaExtra, true);
        this.extrusorSogaC = new Extrusor(cabezalSoga, trayectoriaSogaExtra, true);
        this.extrusorSogaD = new Extrusor(cabezalSoga, trayectoriaSogaExtra, true);

        this.plataforma = new Cuboide(3.3, 3.3, 0.05, true, texturaAjustada, texturaAjustada);

        this.contrapeso = new Cuboide(4, 2, 2, true);

        this.actualizar();

        window.addEventListener("keydown", event => {
            this.keyDown(event);
        }, false);
        window.addEventListener("keyup", event => {
            this.keyUp(event);
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
        mat4.translate(modelMatrixB, modelMatrixA, [0, this.elevacionSegmentoColumna1, 0]);
        this.extrusorCuboB.setModelMatrix(modelMatrixB);

        let modelMatrixC = mat4.create();
        mat4.translate(modelMatrixC, modelMatrixB, [0, this.alturaSegmentoColumna, 0]);
        mat4.scale(modelMatrixC, modelMatrixC, [1, this.factorDeEscaladoPiston, 1]);
        this.extrusorCuboC.setModelMatrix(modelMatrixC);

        let modelMatrixCabina = mat4.create();
        if (this.factorDeEscaladoPiston != 0) {
            mat4.translate(modelMatrixCabina, modelMatrixC, [0, this.alturaSegmentoColumna, 0]);
            mat4.scale(modelMatrixCabina, modelMatrixCabina, [1, 1/this.factorDeEscaladoPiston, 1]);
        } else {
            mat4.translate(modelMatrixCabina, modelMatrixB, [0, this.alturaSegmentoColumna, 0]);
        }
        mat4.rotate(modelMatrixCabina, modelMatrixCabina, this.anguloCabina, [0, 1, 0]);
        modelMatrixCabina = this.cabina.actualizar(modelMatrixCabina);

        this.posicionCamaraCabina = [
            -this.posicion[0],
            -this.posicion[1] - this.alturaSegmentoColumna - this.elevacionSegmentoColumna1 - this.factorDeEscaladoPiston*this.alturaSegmentoColumna - this.cabina.altura/2,
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

    draw(drawMalla, vista) {
        if (this.modificada()) {
            this.reconfigurar();
            this.actualizar();
            vista();
        }
        this.extrusorCuboA.drawTexturado(drawMalla, texturas.metalOxidado);
        this.extrusorCuboB.drawTexturado(drawMalla, texturas.metalOxidado);
        this.extrusorCuboC.drawSolido(drawMalla, this.colorPiston);
        this.cabina.draw(drawMalla, texturas.metalOxidado);
        this.extrusorEjeE.draw(drawMalla, this.colorEje);
        this.brazo.drawTexturado(drawMalla, texturas.metalOxidado);
        this.extrusorEjeG.draw(drawMalla, this.colorEje);
        this.extrusorSoga.drawSolido(drawMalla, this.colorSoga);
        this.extrusorSogaA.drawSolido(drawMalla, this.colorSoga);
        this.extrusorSogaB.drawSolido(drawMalla, this.colorSoga);
        this.extrusorSogaC.drawSolido(drawMalla, this.colorSoga);
        this.extrusorSogaD.drawSolido(drawMalla, this.colorSoga);
        this.plataforma.drawTexturado(drawMalla, texturas.maderaPiso);
        //this.plataforma.drawWithNormalMap(drawMalla, texturas.maderaPoste, texturas.maderaPosteNormalMap);
        this.contrapeso.drawSolido(drawMalla, this.colorContrapeso);
    }
    
    keyDown(event) {
        let key = event.keyCode || event.which;
        let keychar = String.fromCharCode(key);
        if (keychar == "I") {
            this.deltaElevacionGrua = 0.05;
        }
        if (keychar == "K") {
            this.deltaElevacionGrua = -0.05;
        }
        if (keychar == "O") {
            this.deltaLargoSoga = -0.1;
        }
        if (keychar == "L") {
            this.deltaLargoSoga = 0.1;
        }
        if (keychar == "G") {
            this.deltaAnguloBrazo = -0.01;
        }
        if (keychar == "B") {
            this.deltaAnguloBrazo = 0.01;
        }
        if (keychar == "V") {
            this.deltaAnguloCabina = 0.01;
        }
        if (keychar == "N") {
            this.deltaAnguloCabina = -0.01;
        }
    }

    resetDeltas() {
        this.deltaElevacionGrua = 0;
        this.deltaLargoSoga = 0;
        this.deltaAnguloBrazo = 0;
        this.deltaAnguloCabina = 0;
    }

    modificada() {
        return this.deltaElevacionGrua ||
               this.deltaLargoSoga ||
               this.deltaAnguloBrazo ||
               this.deltaAnguloCabina;
    }

    keyUp(event) {
        let key = event.keyCode || event.which;
        let keychar = String.fromCharCode(key);
        if (keychar == "I") {
            this.deltaElevacionGrua = 0;
        }
        if (keychar == "K") {
            this.deltaElevacionGrua = 0;
        }
        if (keychar == "O") {
            this.deltaLargoSoga = 0;
        }
        if (keychar == "L") {
            this.deltaLargoSoga = 0;
        }
        if (keychar == "G") {
            this.deltaAnguloBrazo = 0;
        }
        if (keychar == "B") {
            this.deltaAnguloBrazo = 0;
        }
        if (keychar == "V") {
            this.deltaAnguloCabina = 0;
        }
        if (keychar == "N") {
            this.deltaAnguloCabina = 0;
        }
    }

    reconfigurar() {
        const f = 4;
        if (this.deltaElevacionGrua > 0) {
            this.elevacionSegmentoColumna1 += this.deltaElevacionGrua * f;
            let deltaFactorDeEscaladoPiston = 0;
            if (this.elevacionSegmentoColumna1 > this.alturaSegmentoColumna) {
                deltaFactorDeEscaladoPiston = (this.elevacionSegmentoColumna1 - this.alturaSegmentoColumna) / f;
                this.elevacionSegmentoColumna1 = this.alturaSegmentoColumna;
            }
            this.factorDeEscaladoPiston += deltaFactorDeEscaladoPiston;
        } else {
            this.factorDeEscaladoPiston += this.deltaElevacionGrua;
            let deltaElevacionColumna1 = 0;
            if (this.factorDeEscaladoPiston < 0) {
                deltaElevacionColumna1 = this.factorDeEscaladoPiston * f;
                this.factorDeEscaladoPiston = 0;
            }
            this.elevacionSegmentoColumna1 += deltaElevacionColumna1;
            if (this.elevacionSegmentoColumna1 < 0) {
                this.elevacionSegmentoColumna1 = 0;
            }
        }
        
        this.largoSoga += this.deltaLargoSoga;
        if (this.largoSoga < 1) {
            this.largoSoga = 1;
        }

        this.anguloBrazo += this.deltaAnguloBrazo;
        if (this.anguloBrazo < -Math.PI/8) {
            this.anguloBrazo = -Math.PI/8;
        } else if (this.anguloBrazo > Math.PI/8) {
            this.anguloBrazo = Math.PI/8;
        }

        this.anguloCabina +=  this.deltaAnguloCabina;
    }
}