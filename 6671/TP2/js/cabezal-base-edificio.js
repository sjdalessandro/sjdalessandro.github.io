class CabezalBaseEdificio extends Cabezal {
    constructor(ancho, largo, puerta) {
        super();
        this.vertices = [[-ancho, 0, -largo],
                         [-ancho, 0, largo],

                         [-puerta/2, 0, largo],
                         [-puerta/2, 0, -largo*0.9],
                         [puerta/2, 0, -largo*0.9],
                         [puerta/2, 0, largo],
                         
                         [ancho, 0, largo],
                         [ancho, 0, -largo]];
        this.normales = [[-1, 0, 0],
                         [0, 0, 1],

                         [1, 0, 0],
                         [0, 0, 1],
                         [-1, 0, 0],
                         [0, 0, 1],

                         [1, 0, 0],
                         [0, 0, -1]];

        this.tangentes = [[0, 0, 1],
                          [1, 0, 0],

                          [0, 0, -1],
                          [1, 0, 0],
                          [0, 0, 1],
                          [1, 0, 0],

                          [0, 0, -1],
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

        let t = [];
        for (let i = 0; i < this.tangentes.length; i++) {
            t.push(this.tangentes[i]);
            t.push(this.tangentes[i]);
        }
        this.tangentes = t;

        this.calcularMedidas();
    }

    getCentro() {
        return [0, 0, 0];
    }
}