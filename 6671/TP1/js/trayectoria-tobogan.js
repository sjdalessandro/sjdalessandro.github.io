class TrayectoriaTobogan extends TrayectoriaBCuadratica {
    constructor() {
        let puntosDeControl = [
            [1, -1],
            [0, -1],
            [-1, -1],
            [-2, -1],
            [-2, 0],
            [-2, 1],
            [-1, 1],
            [0, 1],
            [1, 1],
            [2, 1],
            [2, 0],
            [2, -1],
            [1, -1],
            [-0.1, -1]]; 
        super(puntosDeControl);
    }
}