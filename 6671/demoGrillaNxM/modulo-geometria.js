

/*

    Tareas:
    ------

    1) Modificar a función "generarSuperficie" para que tenga en cuenta los parametros filas y columnas al llenar el indexBuffer
       Con esta modificación deberían poder generarse planos de N filas por M columnas

    2) Modificar la funcion "dibujarMalla" para que use la primitiva "triangle_strip"

    3) Crear nuevos tipos funciones constructoras de superficies

        3a) Crear la función constructora "Esfera" que reciba como parámetro el radio

        3b) Crear la función constructora "TuboSenoidal" que reciba como parámetro la amplitud de onda, longitud de onda, radio del tubo y altura.
        (Ver imagenes JPG adjuntas)
        
        
    Entrega:
    -------

    - Agregar una variable global que permita elegir facilmente que tipo de primitiva se desea visualizar [plano,esfera,tubosenoidal]
    
*/

const Formas = {
	PLANO: "plano",
	ESFERA: "esfera",
	TUBO: "tubo"
}

var superficie3D;
var mallaDeTriangulos;

var filas=40;
var columnas=40;
var forma=Formas.PLANO;
var anchoPlano=3;
var altoPlano=3;
var radioEsfera=1.5;
var amplitudTubo = 0.1;
var longitudTubo = 0.4;
var altoTubo = 2.0;
var radioTubo = 0.7;


function obtenerParametroEntero(url,nombre,valorOmision){
    var param = parseInt(url.searchParams.get(nombre));
    return param? param : valorOmision;
}

function obtenerParametroReal(url,nombre,valorOmision){
    var param = parseFloat(url.searchParams.get(nombre));
    return param? param : valorOmision;
}

function procesarParametros(){
    var url = new URL(window.location.href);

    filas=obtenerParametroEntero(url,"filas", filas);
    columnas=obtenerParametroEntero(url,"columnas", columnas);

    param = url.searchParams.get("forma");
    if (param === null || Formas[param.toUpperCase()] === undefined) {
        return;
    }
    forma=param.toLowerCase();

    anchoPlano=obtenerParametroReal(url,"ancho", anchoPlano);
    altoPlano=obtenerParametroReal(url,"alto", altoPlano);
    radioEsfera=obtenerParametroReal(url,"radio", radioEsfera);

    amplitudTubo=obtenerParametroReal(url,"amplitud", amplitudTubo);
    longitudTubo=obtenerParametroReal(url,"longitud", longitudTubo);
    altoTubo=obtenerParametroReal(url,"alto_tubo", altoTubo);
    radioTubo=obtenerParametroReal(url,"radio_tubo", radioTubo);
}

function generarSuperficie2D(){

    switch (forma) {
        case Formas.PLANO:
            return new Plano(anchoPlano,altoPlano);
        case Formas.ESFERA:
            return new Esfera(radioEsfera);
        case Formas.TUBO:
            return new TuboSenoidal(amplitudTubo,longitudTubo,altoTubo,radioTubo);
    }
}

function crearGeometria(){

    superficie3D=generarSuperficie2D();
    mallaDeTriangulos=generarSuperficie(superficie3D,filas,columnas);
}

function dibujarGeometria(){

    dibujarMalla(mallaDeTriangulos);

}

function Plano(ancho,largo){

    this.getPosicion=function(u,v){

        var x=(u-0.5)*ancho;
        var z=(v-0.5)*largo;
        return [x,0,z];
    }

    this.getNormal=function(u,v){
        return [0,1,0];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function Esfera(radio){

    this.getPosicion=function(u,v){
        var nrm = this.getNormal(u,v);
        return nrm.map(x => x * radio);
    }

    this.getNormal=function(u,v){
        // Ver demoPlanetaTierra y explicación en
        // Integration and differentiation in spherical coordinates
        // https://en.wikipedia.org/wiki/Spherical_coordinate_system
        var theta = Math.PI*v;
        var phi = 2.0*Math.PI*u;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
        var x = cosPhi*sinTheta;
        var y = cosTheta;
        var z = sinPhi*sinTheta;
        return [x,y,z];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function TuboSenoidal(amplitud,longitud,alto,radio){

    this.getData=function(u,v){

        var phi = 2.0*Math.PI*u;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
        var y = (v-0.5)*alto;
        var k = 2.0*Math.PI/longitud;
        var theta0 = 3.0*Math.PI/2.0;
        var theta = k*y + theta0;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        var r = radio+amplitud*sinTheta;

        return [y, k, r, cosPhi, sinPhi, cosTheta, sinTheta];
    }

    this.getPosicion=function(u,v){

        const [y, k, r, cosPhi, sinPhi, cosTheta, sinTheta] = this.getData(u,v);

        var x = r*cosPhi;
        var z = r*sinPhi;
        return [x,y,z];
    }

    this.getNormal=function(u,v){

        const [y, k, r, cosPhi, sinPhi, cosTheta, sinTheta] = this.getData(u,v);

        var dx_dt = cosPhi*amplitud*cosTheta;
        var dy_dt = 1/k;
        var dz_dt = sinPhi*amplitud*cosTheta;

        var dx_dp = -sinPhi*r;
        var dy_dp = 0;
        var dz_dp = cosPhi*r;

        var nx = -dy_dp*dz_dt+dz_dp*dy_dt;
        var ny = dx_dp*dz_dt-dz_dp*dx_dt;
        var nz = -dx_dp*dy_dt+dy_dp*dx_dt;
        var nl = Math.sqrt(nx**2+ny**2+nz**2);
        return [nx/nl,ny/nl,nz/nl];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function generarSuperficie(superficie,filas,columnas){
    
    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];

    for (var i=0; i <= filas; i++) {
        for (var j=0; j <= columnas; j++) {

            var u=j/columnas;
            var v=i/filas;

            var pos=superficie.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs=superficie.getCoordenadasTextura(u,v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
    }

    // Buffer de indices de los triángulos
    
    indexBuffer = [];
    stride = columnas + 1;

    for (i=0; i < filas; i++) {
        ri = i * stride;
        ni = (i + 1) * stride;
        indexBuffer.push(ri);
        indexBuffer.push(ni);
        for (j=0; j < columnas; j++) {

            // completar la lógica necesaria para llenar el indexbuffer en funcion de filas y columnas
            // teniendo en cuenta que se va a dibujar todo el buffer con la primitiva "triangle_strip" 
            
            nj = j + 1;
            indexBuffer.push(ri + nj);
            indexBuffer.push(ni + nj);
        }
        if (i + 1 < filas) {
            indexBuffer.push(ni + nj);
            indexBuffer.push(ni);
        }
    }

    // Creación e Inicialización de los buffers

    webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}

function dibujarMalla(mallaDeTriangulos){
    
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
       
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);


    if (modo!="wireframe"){
        gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));                    
        /*
            Aqui es necesario modificar la primitiva por triangle_strip
        */
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    if (modo!="smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform,false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
 
}

