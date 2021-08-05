class Tobogan {
    constructor(edificio, diametro, niveles) {
        this.edificio = edificio;
        this.diametro = diametro;
        this.colorSemiarco = [0.9, 0.3, 0.1];
        this.alturaNivel = 2.15;

        this.reset(niveles);
    }

    reset(niveles) {
        this.modificada = true;
        this.alturaColumna = (niveles + 0.5)*this.alturaNivel;
        this.semiarcos = this.crearSemiarcos(niveles, this.diametro);
        if (this.semiarcos.length > 0) {
            let cabezalColumna = new CabezalCilindro(0.8);
            let trayectoriaColumna = new TrayectoriaRecta(this.alturaColumna);
            this.columnaA = new Extrusor(cabezalColumna, trayectoriaColumna, true, texturaAjustadaXRepetidaY, texturaRepetida);
            this.columnaB = new Extrusor(cabezalColumna, trayectoriaColumna, true, texturaAjustadaXRepetidaY, texturaRepetida);
        }
        this.posicion = [...edificio.posicion];
        this.posicion[2] += this.edificio.getToboganZ();
        this.actualizar();
    }

    crearSemiarcos(cantidad, diametro) {
        let cabezalSemiarco = new CabezalSemiarco(diametro, diametro/2, diametro/10);
        let trayectoriaSemiarco = new TrayectoriaTobogan(1);
        let semiarcos = [];
        for (let i = 0; i < cantidad; i++) {
            semiarcos.push(new Extrusor(cabezalSemiarco, trayectoriaSemiarco, false));
        }
        return semiarcos;
    }

    actualizar(modelMatrixA) {

        if (!modelMatrixA) {
            modelMatrixA = mat4.create();
            mat4.identity(modelMatrixA);
        }

        if (this.posicion) {
            mat4.translate(modelMatrixA, modelMatrixA, this.posicion);
        }

        this.semiarcos.forEach((s, i) => {
            let modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrixA, [0, i*this.alturaNivel, 0]);
            s.setModelMatrix(modelMatrix);
        });

        if (this.semiarcos.length > 0) {
            let modelMatrixColumnaA = mat4.create();
            mat4.translate(modelMatrixColumnaA, modelMatrixA, [-1, 0, 0]);
            this.columnaA.setModelMatrix(modelMatrixColumnaA);

            let modelMatrixColumnaB = mat4.create();
            mat4.translate(modelMatrixColumnaB, modelMatrixA, [1, 0, 0]);
            this.columnaB.setModelMatrix(modelMatrixColumnaB);
        }

        this.modificada = false;
    }

    draw(drawMalla) {
        if (this.modificada) {
            this.actualizar();
        }

        this.semiarcos.forEach(s => {
            s.drawSolido(drawMalla, this.colorSemiarco);
        });

        if (this.semiarcos.length > 0) {
            this.columnaA.drawWithNormalMap(drawMalla, texturas.maderaPoste, texturas.maderaPosteNormalMap);
            this.columnaB.drawWithNormalMap(drawMalla, texturas.maderaPoste, texturas.maderaPosteNormalMap);
        }
    }
}