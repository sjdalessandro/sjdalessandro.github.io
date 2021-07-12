class Cabezal {
    constructor() {
        this.vertices = undefined;
        this.normales = undefined;
    }

    getVerticesLength() {
        return this.vertices.length;
    }

    getIndiceVertice(u) {
        let l = this.getVerticesLength();
        return Math.round(u*l)%l;
     }

    getPosicion(u) {
        let i = this.getIndiceVertice(u);
        return this.vertices[i];
    }

    getNormal(u) {
        let i = this.getIndiceVertice(u);
        if (!this.normales) {
            return [0, 1, 0];
        }
        return this.normales[i];
    }

    getCentro() {
        // Fuente: https://stackoverflow.com/questions/49062795/average-a-columns-in-a-2d-array-with-functional-programming
        return this.vertices[0].map((col, i) => this.vertices.map(row => row[i]).reduce((acc, c) => acc + c, 0) / this.vertices.length);
    }

    pcruz(a, b) {
        return [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
    }

    normalize(v) {
        let magnitude = (v[0]**2 + v[1]**2 + v[2]**2)**0.5;
        return [v[0]/magnitude, v[1]/magnitude, v[2]/magnitude];
    }
}