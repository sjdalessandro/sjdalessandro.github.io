class CabezalSemiarco extends CabezalBezierCuadratica {
    constructor(diametro, altura, espesor) {
        const d = 1.0925*diametro/2;
        const e = espesor;
        const a = altura;
        super([
            [-d, d, 0],
            [0, -a, 0],
            [d, d, 0],
            [d-e/2, d+e, 0], 
            [d-e, d, 0],
            [0, -a+e/2, 0],
            [-d+e, d, 0],
            [-d+e/2, d+e, 0]
        ]);
        this.binormal = [0, 0, -1];
    }
}