var normalMapVertexShader = `
    precision highp float;

    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec3 aVertexTangent;
    attribute vec2 aUv;

    uniform mat4 modelMatrix;            
    uniform mat4 viewMatrix;
    uniform mat4 projMatrix;

    uniform mat3 normalMatrix;

    varying vec3 vPosWorld;  
    varying vec3 vNormal;    
    varying vec3 vTangent;
    varying vec2 vUv;

    void main(void) {
        gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);
        vUv = aUv;
        vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;
        vTangent = normalize(normalMatrix * aVertexTangent);
        vNormal = normalize(normalMatrix * aVertexNormal);
    }
`;
