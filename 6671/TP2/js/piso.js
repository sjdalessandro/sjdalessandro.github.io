class Piso {
    constructor(posicion, verticesLosa, ventanasAncho, ventanasLargo, chico, columnasLen) {
        this.posicion = posicion;
        this.ventanasAncho = ventanasAncho;
        this.ventanasLargo = ventanasLargo;
        this.columnasLen = columnasLen;
        this.modificada = true;

        this.chico = chico;
        if (chico) {
            this.ventanasAncho -= 2;
            this.ventanasLargo -= 2;
        }

        this.ventanaLado = 2.0;
        this.ventanaEspesor = 0.05;
        this.ancho = this.ventanasAncho * this.ventanaLado;
        this.largo = this.ventanasLargo * this.ventanaLado;
        this.colorVentana = [0, 0.3, 0.8];

        this.alturaLosa = 0.3;

        this.diametroColumna = 0.8;
        this.colorColumna = [0.3, 0.7, 0.3];

        this.colorMarco = [0.1, 0.0, 0.0];

        this.verticesLosa = verticesLosa;

        this.losa = this.crearLosa(verticesLosa, chico);

        this.ventanalA = new Cuboide(this.largo, this.ventanaEspesor, this.ventanaLado, true);
        this.ventanalB = new Cuboide(this.ancho, this.ventanaEspesor, this.ventanaLado, true);
        this.ventanalC = new Cuboide(this.largo, this.ventanaEspesor, this.ventanaLado, true);
        this.ventanalD = new Cuboide(this.ancho, this.ventanaEspesor, this.ventanaLado, true);

        this.marcos = this.crearMarcos();

        this.columnas = this.crearColumnas();

        this.actualizar();

        window.addEventListener("keydown", event => {
            this.keyEvent(event);
        }, false);
    }

    desplazar(vertices, min, max) {
        for (let i = 0; i < vertices.length; i++) {
            let v = vertices[i];
            v[0] += Math.random()*(max - min) + min;
            v[1] += Math.random()*(max - min) + min;
        }
    }

    crearColumna() {
        let cabezalColumna = new CabezalCilindro(this.diametroColumna);
        let trayectoriaColumna = new TrayectoriaRecta(this.ventanaLado);
        return new Extrusor(cabezalColumna, trayectoriaColumna, true);
    }

    crearColumnas() {
        let columnas = [];
        for (let i = 0; i < this.columnasLen; i++) {
            columnas.push(this.crearColumna());
        }
        return columnas;
    }

    crearMarcos() {
        let marcos = [];
        const cantidad = 2*this.ventanasAncho + 2*this.ventanasLargo;
        for (let i = 0; i < cantidad; i++) {
            marcos.push(new Cuboide(0.1, this.ventanaEspesor + 0.2, this.ventanaLado, true));
        }
        return marcos;
    }

    crearLosa(verticesLosa, chico) {
        let cabezalLosa = new CabezalBSplineCuadratica(verticesLosa);
        let trayectoriaLosa = new TrayectoriaRecta(this.alturaLosa);
        return new Extrusor(cabezalLosa, trayectoriaLosa, true, texturaRepetida, texturaAjustada);
    }

    actualizar(modelMatrixA) {

        if (!modelMatrixA) {
            modelMatrixA = mat4.create();
            mat4.identity(modelMatrixA);
        }

        if (this.posicion) {
            mat4.translate(modelMatrixA, modelMatrixA, this.posicion);
        }

        let desplazamientoInicial = 0;
        if (this.chico) {
            let modelMatrixPiso = mat4.create();
            mat4.translate(modelMatrixPiso, modelMatrixA,
                    [0, this.ventanaLado, 0]);
            this.losa.setModelMatrix(modelMatrixPiso);
        } else {
            this.losa.setModelMatrix(modelMatrixA);
            desplazamientoInicial = this.alturaLosa;
        }

        this.columnas.forEach((columna, i) => {
            let modelMatrixColumna = mat4.create();
            let u = i/this.columnasLen;
            let ver = this.losa.cabezal.getVertice(u);
            let normal = this.losa.cabezal.getNormal(u);
            const f = 1;
            let pos = [ver[0] - f*normal[0], ver[1] - f*normal[2]];
            mat4.translate(modelMatrixColumna, modelMatrixA,
                    [0 + pos[0], desplazamientoInicial, 0 + pos[1]]);
            columna.setModelMatrix(modelMatrixColumna);
        });

        let modelMatrixVentanalA = mat4.create();
        mat4.translate(modelMatrixVentanalA, modelMatrixA,
                [-this.ancho/2, desplazamientoInicial, 0]);
        mat4.rotate(modelMatrixVentanalA, modelMatrixVentanalA, Math.PI/2, [0, 1, 0]);
        this.ventanalA.setModelMatrix(modelMatrixVentanalA);

        let modelMatrixVentanalB = mat4.create();
        mat4.translate(modelMatrixVentanalB, modelMatrixA,
                [0, desplazamientoInicial, -this.largo/2]);
        this.ventanalB.setModelMatrix(modelMatrixVentanalB);

        let modelMatrixVentanalC = mat4.create();
        mat4.translate(modelMatrixVentanalC, modelMatrixA,
                [this.ancho/2, desplazamientoInicial, 0]);
        mat4.rotate(modelMatrixVentanalC, modelMatrixVentanalC, Math.PI/2, [0, 1, 0]);
        this.ventanalC.setModelMatrix(modelMatrixVentanalC);

        let modelMatrixVentanalD = mat4.create();
        mat4.translate(modelMatrixVentanalD, modelMatrixA,
                [0, desplazamientoInicial, this.largo/2]);
        this.ventanalD.setModelMatrix(modelMatrixVentanalD);


        this.actualizarMarcos(modelMatrixA, desplazamientoInicial);


        let modelMatrixResult = mat4.create();
        mat4.translate(modelMatrixResult, modelMatrixA,
            [0, this.alturaLosa + this.ventanaLado, 0]);

        this.modificada = false;

        return modelMatrixResult;
    }

    actualizarMarcos(modelMatrixA, desplazamientoInicial) {
        
        let j = 0;
        for (let i = 0; i < this.ventanasLargo; i++) {
            let modelMatrixMarco = mat4.create();
            mat4.translate(modelMatrixMarco, modelMatrixA,
                    [-this.ancho/2, desplazamientoInicial, -this.largo/2 + i*this.ventanaLado]);
            this.marcos[j++].setModelMatrix(modelMatrixMarco);
        }
        for (let i = 0; i < this.ventanasAncho; i++) {
            let modelMatrixMarco = mat4.create();
            mat4.translate(modelMatrixMarco, modelMatrixA,
                    [-this.ancho/2 + i*this.ventanaLado, desplazamientoInicial, this.largo/2]);
            this.marcos[j++].setModelMatrix(modelMatrixMarco);
        }
        for (let i = 0; i < this.ventanasLargo; i++) {
            let modelMatrixMarco = mat4.create();
            mat4.translate(modelMatrixMarco, modelMatrixA,
                    [this.ancho/2, desplazamientoInicial, this.largo/2 - i*this.ventanaLado]);
            this.marcos[j++].setModelMatrix(modelMatrixMarco);
        }
        for (let i = 0; i < this.ventanasAncho; i++) {
            let modelMatrixMarco = mat4.create();
            mat4.translate(modelMatrixMarco, modelMatrixA,
                    [this.ancho/2 - i*this.ventanaLado, desplazamientoInicial, -this.largo/2]);
            this.marcos[j++].setModelMatrix(modelMatrixMarco);
        }
    }

    draw(drawMalla) {
        if (this.modificada) {
            this.actualizar();
        }

        this.losa.drawTexturado(drawMalla, texturas.cemento);
        this.ventanalA.draw(drawMalla, this.colorVentana);
        this.ventanalB.draw(drawMalla, this.colorVentana);
        this.ventanalC.draw(drawMalla, this.colorVentana);
        this.ventanalD.draw(drawMalla, this.colorVentana);
        this.marcos.forEach(marco => {
            marco.drawTexturado(drawMalla, texturas.marco);
        });
        this.columnas.forEach(columna => {
           columna.drawTexturado(drawMalla, texturas.columna);
        });
    }
    
    keyEvent(event) {
        let key = event.keyCode || event.which;
        let keychar = String.fromCharCode(key);
        // if (keychar == "Q") {}
    }
}