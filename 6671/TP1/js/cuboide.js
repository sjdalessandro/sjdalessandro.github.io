class Cuboide extends Extrusor {
    constructor(ladoA, ladoB, ladoC, tapar) {
        let cabezalRectangulo = new CabezalRectangulo(ladoA, ladoB, ladoA/5);
        let trayectoriaBase = new TrayectoriaRecta(ladoC);
        super(cabezalRectangulo, trayectoriaBase, tapar);
    }
}