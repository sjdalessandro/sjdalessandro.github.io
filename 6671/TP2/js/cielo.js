class Cielo {
    constructor() {
        this.modificada = false;

        // Create a texture.
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        const faceInfos = [
            {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            url: './texturas/Cielo/px.png',
            },
            {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            url: './texturas/Cielo/nx.png',
            },
            {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            url: './texturas/Cielo/ny.png',
            },
            {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            url: './texturas/Cielo/py.png',
            },
            {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            url: './texturas/Cielo/pz.png',
            },
            {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            url: './texturas/Cielo/nz.png',
            },
        ];

        faceInfos.forEach(async (faceInfo) => {
            this.load(faceInfo, texture);
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        this.generar();
    }

    async load(faceInfo, texture) {
        const {target, url} = faceInfo;

        // setup each face so it's immediately renderable
        gl.texImage2D(target, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        // Asynchronously load an image
        const image = new Image();
        image.src = url;

        image.addEventListener('load', function() {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        });
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