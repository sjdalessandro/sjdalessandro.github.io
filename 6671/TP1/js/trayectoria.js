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

    getNormal(normal2D, v) {
        let vector = [normal2D[0], 0, normal2D[2], 1];
        let i = this.getIndiceMatriz(v);
        let matriz = glMatrix.mat4.clone(this.matrices[i]);
        matriz[12] = 0;
        matriz[13] = 0;
        matriz[14] = 0;
        glMatrix.vec4.transformMat4(vector, vector, matriz);
        return this.normalize(vector);
    }

    getCentro(pos2D, v) {
        let vector = [pos2D[0], 0, pos2D[1], 1];
        let i = this.getIndiceMatriz(v);
        let matriz = this.matrices[i];
        glMatrix.vec4.transformMat4(vector, vector, matriz);
        return vector;
    }

    magnitude(v) {
        return (v[0]**2 + v[1]**2 + v[2]**2)**0.5;
    }

    normalize(v) {
        let magnitude = this.magnitude(v);
        return [v[0]/magnitude, v[1]/magnitude, v[2]/magnitude];
    }
}