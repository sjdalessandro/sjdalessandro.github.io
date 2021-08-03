class Cielo {
    constructor() {
        this.modificada = false;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texturas.cielo);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        this.generar();
    }

    generar() {
        var positions = new Float32Array(
            [
              -1, -1, 
               1, -1, 
              -1,  1, 
              -1,  1,
               1, -1,
               1,  1,
            ]);

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    }

    draw() {
        if (this.modificada) {
            this.actualizar();
        }

        glPrograms.cielo.setup(glPrograms.cielo);

        // Draw the geometry.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(glPrograms.cielo.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}