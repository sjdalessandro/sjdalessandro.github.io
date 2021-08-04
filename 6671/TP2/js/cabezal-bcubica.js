class CabezalBCubica extends Cabezal {
    constructor(puntosDeControl) {
        console.assert(puntosDeControl.length >= 4, "Al menos se requieren 4 puntos de control.");
        super();

        this.base0 = function(u) { return (1-3*u+3*u*u-u*u*u)*1/6; }
        this.base1 = function(u) { return (4-6*u*u+3*u*u*u)*1/6; }
        this.base2 = function(u) { return (1+3*u+3*u*u-3*u*u*u)*1/6; }
        this.base3 = function(u) { return (u*u*u)*1/6; }

        this.base0der = function(u) { return (-3 +6*u -3*u*u)/6 }
        this.base1der = function(u) { return (-12*u+9*u*u)/6 }
        this.base2der = function(u) { return (3+6*u-9*u*u)/6;}
        this.base3der = function(u) { return (3*u*u)*1/6; }	

        this.step = 0.05;
        
        // Cierro la curva
        puntosDeControl = [...puntosDeControl, ...puntosDeControl.slice(0, 3)];

        const tramos = puntosDeControl.length - 3;

        this.vertices = [];
        this.normales = [];
        this.tangentes = [];
        for (var t=0; t < tramos; t++){
            let pctrl = [puntosDeControl[t], puntosDeControl[t+1], puntosDeControl[t+2], puntosDeControl[t+3]];
            
            let verticesTramo = this.getVertices(pctrl);
            this.vertices = [...this.vertices, ...verticesTramo];

            let normalesTramo = this.getNormales(pctrl);
            this.normales = [...this.normales, ...normalesTramo];

            let tangentesTramo = this.getTangentes(pctrl);
            this.tangentes = [...this.tangentes, ...tangentesTramo];
        }
    }

    curva(u, puntosDeControl) {
		var p0 = puntosDeControl[0];
		var p1 = puntosDeControl[1];
		var p2 = puntosDeControl[2];
		var p3 = puntosDeControl[3];
		
		let x = this.base0(u)*p0[0] + this.base1(u)*p1[0] + this.base2(u)*p2[0] + this.base3(u)*p3[0];
        let y = this.base0(u)*p0[1] + this.base1(u)*p1[1] + this.base2(u)*p2[1] + this.base3(u)*p3[1];

		return [x, y];
	}

    getVertices(puntosDeControl) {
        let puntos = [];
		for (var u=0; u <= 1.0; u += this.step){
			puntos.push(this.curva(u, puntosDeControl));
        }
        return puntos;
    }

    tangente(u, puntosDeControl) {
		var p0 = puntosDeControl[0];
		var p1 = puntosDeControl[1];
		var p2 = puntosDeControl[2];
		var p3 = puntosDeControl[3];
		
		let x = this.base0der(u)*p0[0] + this.base1der(u)*p1[0] + this.base2der(u)*p2[0] + this.base3der(u)*p3[0];
        let y = this.base0der(u)*p0[1] + this.base1der(u)*p1[1] + this.base2der(u)*p2[1] + this.base3der(u)*p3[1];

		return [x, y];
	}

    getNormales(puntosDeControl) {
        let puntos = [];
		for (var u=0; u <= 1.0; u += this.step){
            let der = this.tangente(u, puntosDeControl);
            let normal = this.pcruz([der[0], 0, der[1]], [0, 1, 0]);
 			puntos.push(this.normalize(normal));
        }
        return puntos;
    }

    getTangentes(puntosDeControl) {
        let puntos = [];
		for (var u=0; u <= 1.0; u += this.step){
            let tangente2D = this.tangente(u, puntosDeControl);
            let tangente = [tangente2D[0], 0, tangente2D[1]];
            puntos.push(this.normalize(tangente));
         }
        return puntos;
    }
}