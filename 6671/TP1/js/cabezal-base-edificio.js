class CabezalBaseEdificio extends Cabezal {
    constructor(ancho, largo, puerta) {
        super();
        this.vertices = [[-ancho, -largo],
                         [-ancho, largo],

                         [-puerta/2, largo],
                         [-puerta/2, -largo*0.99],
                         [puerta/2, -largo*0.99],
                         [puerta/2, largo],
                         
                         [ancho, largo],
                         [ancho, -largo]];
        this.normales = [[-1, 0, 0],
                         [0, 0, 1],

                         [1, 0, 0],
                         [0, 0, 1],
                         [-1, 0, 0],
                         [0, 0, 1],

                         [1, 0, 0],
                         [0, 0, -1]];

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
    }

    getCentro() {
        return [0, 0, 0];
    }
}