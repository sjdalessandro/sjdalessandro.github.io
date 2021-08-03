var cieloVertexShader = `
    precision highp float;

    attribute vec3 aVertexPosition;

    varying vec3 vPosition;

    void main() {
        vPosition = aVertexPosition;
        gl_Position = vec4(aVertexPosition, 1.0);
        gl_Position.z = 1.0;
    }
`;