class Cabezal {
    constructor() {
        this.vertices = undefined;
        this.normales = undefined;
        this.tangentes = undefined;
    }

    calcularMedidas() {
        let x = this.vertices.map(v => v[0]);
        this.minx = Math.min( ...x );
        let maxx = Math.max( ...x );
        this.width = maxx - this.minx;

        let y = this.vertices.map(v => v[1]);
        this.miny = Math.min( ...y );
        let maxy = Math.max( ...y );
        this.height = maxy - this.miny;

        this.acc = 0;
        this.distanciasAlPrimero = [this.acc];
        for (let i = 1; i < this.vertices.length; i++) {
            this.acc += this.distance2D(this.vertices[i], this.vertices[i-1]);
            this.distanciasAlPrimero.push(this.acc);
        }
    }

    escalarATextura(pos) {
        return [(pos[0] - this.minx) / this.width,
                (pos[1] - this.miny) / this.height];
    }

    getCoordenadaTextura(u) {
        let i = this.getIndiceVertice(u);
        return this.distanciasAlPrimero[i]/this.acc;
    }

    getCoordenadaTexturaRepetida(u) {
        let i = this.getIndiceVertice(u);
        return this.distanciasAlPrimero[i];
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
        return this.normales[i];
    }

    getTangente(u) {
        let i = this.getIndiceVertice(u);
        return this.tangentes[i];
    }

    getCentro() {
        // Fuente: https://stackoverflow.com/questions/49062795/average-a-columns-in-a-2d-array-with-functional-programming
        return this.vertices[0].map((col, i) => this.vertices.map(row => row[i]).reduce((acc, c) => acc + c, 0) / this.vertices.length);
    }

    pcruz(a, b) {
        return [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
    }

    magnitude(v) {
        return (v[0]**2 + v[1]**2 + v[2]**2)**0.5;
    }

    normalize(v) {
        let magnitude = this.magnitude(v);
        return [v[0]/magnitude, v[1]/magnitude, v[2]/magnitude];
    }

    distance(v1, v2) {
        return this.magnitude([v2[0]-v1[0], v2[1]-v1[1], v2[2]-v1[2]]);
    }

    distance2D(v1, v2) {
        return this.magnitude([v2[0]-v1[0], 0, v2[1]-v1[1]]);
    }
}