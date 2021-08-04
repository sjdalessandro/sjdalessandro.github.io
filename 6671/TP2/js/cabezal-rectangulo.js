class CabezalRectangulo extends Cabezal {
    constructor(ancho, largo) {
        super();
        const mitadA = ancho/2;
        const mitadB = largo/2;
        this.vertices = [[-mitadA, -mitadB],
                         [-mitadA, mitadB],
                         [mitadA, mitadB],
                         [mitadA, -mitadB]];
        this.normales = [[-1, 0, 0],
                         [0, 0, 1],
                         [1, 0, 0],
                         [0, 0, -1]];

        this.tangentes = [[0, 0, 1],
                          [0, 0, 1],
                          [1, 0, 0],
                          [0, 0, -1],
                          [1, 0, 0],
                          [0, 0, -1],
                          [-1, 0, 0],
                          [-1, 0, 0]];

        let v = [this.vertices[0]];
        for (let i = 1; i < this.vertices.length; i++) {
            v.push(this.vertices[i]);
            v.push(this.vertices[i]);
        }
        v.push(this.vertices[0]);
        this.vertices = v;

        let n = [];
        for (let i = 0; i < this.normales.length; i++) {
            n.push(this.normales[i]);
            n.push(this.normales[i]);
        }
        this.normales = n;

        this.calcularMedidas();
    }

    getCentro() {
        return [0, 0, 0];
    }
}