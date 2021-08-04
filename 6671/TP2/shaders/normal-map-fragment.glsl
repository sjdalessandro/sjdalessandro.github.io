var normalMapFragmentShader = `
    precision highp float;
    uniform vec3 viewPos;

    varying vec3 vNormal;
    varying vec3 vTangent;
    varying vec3 vPosWorld;
    varying vec2 vUv;
    //varying mat3 vTBN;

    uniform sampler2D normalMap;
    uniform sampler2D textura;

    void main(void) {

        vec3 T = normalize(vTangent);
        vec3 N = normalize(vNormal);
        vec3 B = cross(N, T);
        mat3 vTBN = mat3(N, B, T);

        vec3 normal = texture2D(normalMap, vUv).xyz;
        normal = normal * 2.0 - 1.0;   
        normal = normalize(vTBN * normal); 

        float ambientStrength = 0.2;
        vec3 lightColor = vec3(1.0, 1.0, 1.0);
        vec3 ambient = ambientStrength * lightColor;

        vec3 norm = normalize(normal);
        float diffuseStrength = 0.8;
        vec3 lightPos = vec3(160.0, 20.0, 128.0);
        vec3 lightDir = normalize(lightPos - vPosWorld);  
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = diffuseStrength * diff * lightColor;

        vec3 specularLightColor = vec3(1.0, 1.0, 1.0);
        float specularStrength = 0.5;
        vec3 viewDir = normalize(viewPos - vPosWorld);
        vec3 reflectDir = reflect(-lightDir, norm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 256.0);
        vec3 specular = specularStrength * spec * specularLightColor;  
        
        vec4 color=texture2D(textura, vUv); 
        vec3 result = (ambient + diffuse + specular) * color.xyz;
        gl_FragColor = vec4(result, 1.0);
    }
`;
