class CabezalSemiarco extends CabezalBCuadratica {
    constructor(diametro, altura, espesor) {
        const d = 1.0925*diametro/2;
        const e = espesor;
        const a = altura;
        super([
            [-d, d],
            [0, -a],
            [d, d],
            [d-e/2, d+e], 
            [d-e, d],
            [0, -a+e/2],
            [-d+e, d],
            [-d+e/2, d+e]
        ]);
    }
}