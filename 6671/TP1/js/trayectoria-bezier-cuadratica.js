class TrayectoriaBezierCuadratica extends Trayectoria {
    constructor(puntosDeControl) {
        super();
        this.cabezalBezierCuadratica = new CabezalBezierCuadratica(puntosDeControl, true);
        this.matrices = [];
        let y = 0.4;
        this.cabezalBezierCuadratica.vertices.forEach((v, i) => {
            let normal = this.cabezalBezierCuadratica.normales[i];
            let tangente = this.cabezalBezierCuadratica.tangentes[i];
            let matriz = this.matrizDeNivel(normal, tangente, v[0], y, v[1]);
            this.matrices.push(matriz);
            y += 0.018;
        });
    }
    
    getPosicion(pos2D, v) {
        let vector = [pos2D[0], pos2D[1], 0, 1];
        let i = this.getIndiceMatriz(v);
        let matriz = this.matrices[i];
        glMatrix.vec4.transformMat4(vector, vector, matriz);
        return vector;
    }

    matrizDeNivel(normal, tangente, x, y, z) {
        let matriz = [normal[0], normal[1], normal[2], 0,
                      0, 1, 0, 0,
                      tangente[0], tangente[1], tangente[2], 0,
                      x, y, z, 1];
        return matriz;
    }
}