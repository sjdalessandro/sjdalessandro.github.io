class TrayectoriaRecta extends Trayectoria {
    constructor(longitud) {
        super();
        this.matrices = [[1, 0, 0, 0,
                          0, 1, 0, 0,
                          0, 0, 1, 0,
                          0, 0, 0, 1],
                         [1, 0, 0, 0,
                          0, 1, 0, 0,
                          0, 0, 1, 0,
                          0, longitud, 0, 1]];
    }
}