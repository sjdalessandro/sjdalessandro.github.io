class TrayectoriaTobogan extends Trayectoria {
    constructor() {
        const step = 0.1791;
        let puntosDeControl = [
            [ 1, 0*step, -1],
            [ 0, 1*step, -1],
            [-1, 2*step, -1],
            [-2, 3*step, -1],
            [-2, 4*step, 0],
            [-2, 5*step, 1],
            [-1, 6*step, 1],
            [ 0, 7*step, 1],
            [ 1, 8*step, 1],
            [ 2, 9*step, 1],
            [ 2, 10*step, 0],
            [ 2, 11*step, -1],
            [ 1, 12*step, -1]]; 
        super();

        this.cabezalBezierCuadratica = new CabezalBezierCuadratica(puntosDeControl, true);
        this.matrices = [];
        this.cabezalBezierCuadratica.vertices.forEach((posicion, i) => {
            let tangente = this.cabezalBezierCuadratica.tangentes[i];
            let normal = this.cabezalBezierCuadratica.normales[i];
            let bitangente = this.pcruz(normal, tangente);
            let matriz = this.matrizDeNivel(normal, tangente, bitangente, posicion);
            this.matrices.push(matriz);
        });
        this.calcularMedidas();
    }

    matrizDeNivel(normal, tangente, bitangente, posicion) {
        let matriz = [...normal, 0,
                      ...bitangente, 0,
                      ...tangente, 0,
                      ...posicion, 1];
        return matriz;
    }

    pcruz(a, b) {
        return [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
    }
}