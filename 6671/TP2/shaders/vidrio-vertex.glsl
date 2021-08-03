var vidrioVertexShader = `
    precision highp float;

    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aUv;

    uniform mat4 modelMatrix;            
    uniform mat4 viewMatrix;
    uniform mat4 projMatrix;

    uniform mat3 normalMatrix;

    varying vec3 vPosWorld;  
    varying vec3 vNormal;    
    varying vec2 vUv;

    void main(void) {
        gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);
        vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;
        vNormal=normalize(normalMatrix*aVertexNormal);
        vUv = aUv;
    }
`;