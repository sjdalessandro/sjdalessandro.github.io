class CabezalCilindro extends CabezalBCubica {
    constructor(diametro) {
        const a = 1.0925*diametro/2;
        super([[-a, -a], [-a, a], [a, a], [a, -a]]);
    }
}