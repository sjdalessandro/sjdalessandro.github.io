var cieloFragmentShader = `
    precision highp float;
 
    uniform samplerCube uSkybox;
    uniform mat4 viewMatrixInverse;

    varying vec3 vPosition;
    void main() {
        vec4 t = viewMatrixInverse * vec4(vPosition, 1.0);
        gl_FragColor = textureCube(uSkybox, normalize(t.xyz / t.w));
    }
`;