class CabezalBezierCuadratica extends CabezalCuadratica {

    constructor(puntosDeControl, abierta) {

        super(puntosDeControl, abierta);
    }

    initialize() {

        this.base0 = function(u) { return (1-u)*(1-u); }
        this.base1 = function(u) { return 2*(1-u)*u; }
        this.base2 = function(u) { return u*u; }

        this.base0der = function(u) { return -2+2*u; }
        this.base1der = function(u) { return  2-4*u; }
        this.base2der = function(u) { return  2*u; }

        this.stepTramo = 2;
    }
}