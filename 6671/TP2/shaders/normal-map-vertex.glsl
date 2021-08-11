var normalMapVertexShader = initVertexShader +
`
    attribute vec3 aVertexTangent;

    varying vec3 vTangent;

    void main(void) {
        vTangent = normalize(normalMatrix * aVertexTangent);
        gl_Position = init();
    }
`;
