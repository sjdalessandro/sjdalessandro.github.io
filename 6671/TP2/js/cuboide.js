class Cuboide extends Extrusor {
    constructor(ladoA, ladoB, ladoC, tapar, tipoTextura, tipoTexturaEnTapa) {
        let cabezalRectangulo = new CabezalRectangulo(ladoA, ladoB);
        let trayectoriaBase = new TrayectoriaRecta(ladoC);
        super(cabezalRectangulo, trayectoriaBase, tapar, tipoTextura, tipoTexturaEnTapa);
    }
}