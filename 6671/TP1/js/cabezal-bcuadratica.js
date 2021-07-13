class CabezalBCuadratica extends Cabezal {
    constructor(puntosDeControl) {
        console.assert(puntosDeControl.length >= 3, "Al menos se requieren 3 puntos de control.");
        super();

        this.base0 = function(u) { return 0.5*(1-u)*(1-u); }
        this.base1 = function(u) { return 0.5+u*(1-u); }
        this.base2 = function(u) { return 0.5*u*u; }

        this.base0der = function(u) { return -1+u; }
        this.base1der = function(u) { return  1-2*u; } 
        this.base2der = function(u) { return  u; }

        // Cierro la curva
        puntosDeControl = [...puntosDeControl, ...puntosDeControl.slice(0, 2)];
        this.puntosDeControl = puntosDeControl;

        this.tramos = puntosDeControl.length - 2;

        this.vertices = [];
        this.normales = [];
		for (var t=0; t < this.tramos; t++){
            let pctrl = [puntosDeControl[t], puntosDeControl[t+1], puntosDeControl[t+2]];

            let verticesTramo = this.getVertices(pctrl);
            this.vertices = [...this.vertices, ...verticesTramo];

            let normalesTramo = this.getNormales(pctrl);
            this.normales = [...this.normales, ...normalesTramo];
        }

        /*
        // Con los extremos sobre la curva
        let a = 4;
        this.vertices = [];

        this.base0 = function(u) { return (1-u)*(1-u); }
        this.base1 = function(u) { return 2*u*(1-u); }
        this.base2 = function(u) { return u*u; }

        console.log("tramos: ", this.vertices.length - 2);

        this.vertices = [...this.vertices, ...this.getVertices([[-a, 0], [-a, a], [0, a]])];
        this.vertices = [...this.vertices, ...this.getVertices([[0, a], [a, a], [a, 0]])];
        this.vertices = [...this.vertices, ...this.getVertices([[a, 0], [a, -a], [0, -a]])];
        this.vertices = [...this.vertices, ...this.getVertices([[0, -a], [-a, -a], [-a, 0]])];
        */
    }

    getVertice(u) {
        u %= 1;
        let t = u * this.tramos;
        let deltaU = 1/this.tramos;
        let pctrl = this.puntosDeControl.slice(t, t+3);
        return this.curva(u - t*deltaU, pctrl);
    }
    
    getNormal(u) {
        u %= 1;
        let t = u * this.tramos;
        let deltaU = 1/this.tramos;
        let pctrl = this.puntosDeControl.slice(t, t+3);
        let der = this.derivada(u - t*deltaU, pctrl);
        let normal = this.pcruz([0, 1, 0], [der[0], 0, der[1]]);
        return this.normalize(normal);
    }

    curva(u, puntosDeControl) {
		var p0 = puntosDeControl[0];
		var p1 = puntosDeControl[1];
		var p2 = puntosDeControl[2];
		
		let x = this.base0(u)*p0[0] + this.base1(u)*p1[0] + this.base2(u)*p2[0];
        let y = this.base0(u)*p0[1] + this.base1(u)*p1[1] + this.base2(u)*p2[1];

		return [x, y];
	}

    getVertices(puntosDeControl) {
        let puntos = [];
		for (var u=0; u <= 1.0; u += 0.05){
			puntos.push(this.curva(u, puntosDeControl));
        }
        return puntos;
    }

    derivada(u, puntosDeControl) {
		var p0 = puntosDeControl[0];
		var p1 = puntosDeControl[1];
		var p2 = puntosDeControl[2];
		
		let x = this.base0der(u)*p0[0] + this.base1der(u)*p1[0] + this.base2der(u)*p2[0];
        let y = this.base0der(u)*p0[1] + this.base1der(u)*p1[1] + this.base2der(u)*p2[1];

		return [x, y];
	}

    getNormales(puntosDeControl) {
        let puntos = [];
		for (var u=0; u <= 1.0; u += 0.05){
            let der = this.derivada(u, puntosDeControl);
            let normal = this.pcruz([0, 1, 0], [der[0], 0, der[1]]);
            puntos.push(this.normalize(normal));
        }
        return puntos;
    }
}