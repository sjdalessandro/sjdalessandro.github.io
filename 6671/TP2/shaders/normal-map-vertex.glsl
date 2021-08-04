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
        vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;
        vNormal=normalize(normalMatrix*aVertexNormal);
        vTangent=normalize(normalMatrix*aVertexTangent);
        vUv = aUv;
        /*
        vec3 T = normalize(vec3(modelMatrix * vec4(aVertexTangent,   0.0)));
        vec3 N = normalize(vec3(modelMatrix * vec4(aVertexNormal,    0.0)));
        vec3 B = cross(T, N);
        //vTBN = mat3(N, B, T);
        vTBN = mat3(N, B, T);
        */
    }
`;
