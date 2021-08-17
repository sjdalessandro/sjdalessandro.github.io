class CabezalCuadratica extends Cabezal {

    constructor(puntosDeControl, abierta) {
        console.assert(puntosDeControl.length >= 3, "Al menos se requieren 3 puntos de control.");
        super();
        this.initialize();

        this.step = 0.1;

        // Cierro la curva
        if (!abierta) {
            puntosDeControl = [...puntosDeControl, ...puntosDeControl.slice(0, 2)];
        }
        this.puntosDeControl = puntosDeControl;

        this.tramos = puntosDeControl.length - 2;

        this.vertices = [];
        this.tangentes = [];
        this.normales = [];
		for (var t=0; t < this.tramos; t += this.stepTramo){
            let pctrl = [puntosDeControl[t], puntosDeControl[t+1], puntosDeControl[t+2]];

            let verticesTramo = this.getVertices(pctrl);
            if (this.vertices.length > 0) {
                verticesTramo.shift();
            }
            this.vertices = [...this.vertices, ...verticesTramo];

            let tangentesTramo = this.getTangentes(pctrl);
            if (this.tangentes.length > 0) {
                tangentesTramo.shift();
            }
            this.tangentes = [...this.tangentes, ...tangentesTramo];

            let normalesTramo = this.getNormales(pctrl);
            if (this.normales.length > 0) {
                normalesTramo.shift();
            }
            this.normales = [...this.normales, ...normalesTramo];
        }

        this.calcularMedidas();
    }

    getVertice(u) {
        let p = (u%1) * this.tramos;
        let t = Math.floor(p);
        u = p - t;
        let pctrl = this.puntosDeControl.slice(t, t+3);
        return this.curva(u, pctrl);
    }
    
    getNormal(u) {
        let p = (u%1) * this.tramos;
        let t = Math.floor(p);
        u = p - t;
        let pctrl = this.puntosDeControl.slice(t, t+3);
        let tangente = this.tangente(u, pctrl);
        let normal = this.pcruz(tangente, this.binormal);
        return this.normalize(normal);
    }

    curva(u, puntosDeControl) {
		var p0 = puntosDeControl[0];
		var p1 = puntosDeControl[1];
		var p2 = puntosDeControl[2];
		
		let x = this.base0(u)*p0[0] + this.base1(u)*p1[0] + this.base2(u)*p2[0];
        let y = this.base0(u)*p0[1] + this.base1(u)*p1[1] + this.base2(u)*p2[1];
        let z = this.base0(u)*p0[2] + this.base1(u)*p1[2] + this.base2(u)*p2[2];

		return [x, y, z];
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
		
		let x = this.base0der(u)*p0[0] + this.base1der(u)*p1[0] + this.base2der(u)*p2[0];
        let y = this.base0der(u)*p0[1] + this.base1der(u)*p1[1] + this.base2der(u)*p2[1];
        let z = this.base0der(u)*p0[2] + this.base1der(u)*p1[2] + this.base2der(u)*p2[2];

		return [x, y, z];
	}

    getTangentes(puntosDeControl) {
        let puntos = [];
		for (var u=0; u <= 1.0; u += this.step){
            let tangente = this.tangente(u, puntosDeControl);
            puntos.push(this.normalize(tangente));
        }
        return puntos;
    }

    getNormales(puntosDeControl) {
        let puntos = [];
		for (var u=0; u <= 1.0; u += this.step){
            let tangente = this.tangente(u, puntosDeControl);
            let normal = this.pcruz(tangente, this.binormal);
            puntos.push(this.normalize(normal));
        }
        return puntos;
    }
}
