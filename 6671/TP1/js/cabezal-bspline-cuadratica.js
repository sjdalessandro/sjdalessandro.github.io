class CabezalBSplineCuadratica extends CabezalCuadratica {

    constructor(puntosDeControl, abierta) {
        
        super(puntosDeControl, abierta);
    }

    initialize() {

        this.base0 = function(u) { return 0.5*(1-u)*(1-u); }
        this.base1 = function(u) { return 0.5+u*(1-u); }
        this.base2 = function(u) { return 0.5*u*u; }

        this.base0der = function(u) { return -1+u; }
        this.base1der = function(u) { return  1-2*u; }
        this.base2der = function(u) { return  u; }

        this.stepTramo = 1;
    }
}