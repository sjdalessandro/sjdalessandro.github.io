class Trayectoria {
    constructor() {
        this.matrices = undefined;
    }

    getMatricesLength() {
        return this.matrices.length;
    }

    getIndiceMatriz(v) {
        let l = this.getMatricesLength();
        return Math.round(v*(l - 1));
     }

    getPosicion(pos2D, v) {
        let vector = [pos2D[0], 0, pos2D[1], 1];
        let i = this.getIndiceMatriz(v);
        let matriz = this.matrices[i];
        glMatrix.vec4.transformMat4(vector, vector, matriz);
        return vector;
    }

    getCentro(pos2D, v) {
        let vector = [pos2D[0], 0, pos2D[1], 1];
        let i = this.getIndiceMatriz(v);
        let matriz = this.matrices[i];
        glMatrix.vec4.transformMat4(vector, vector, matriz);
        return vector;
    }
}