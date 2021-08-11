var initVertexShader = `
    precision highp float;

    uniform mat4 modelMatrix;            
    uniform mat4 viewMatrix;
    uniform mat4 projMatrix;
    uniform mat3 normalMatrix;

    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aUv;

    varying vec3 vPosWorld;  
    varying vec3 vNormal;    
    varying vec2 vUv;

    vec4 init(void) {
        vPosWorld = vec3(modelMatrix * vec4(aVertexPosition,1.0));
        vNormal = normalize(normalMatrix * aVertexNormal);
        vUv = aUv;
        return projMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);
    }
`;
