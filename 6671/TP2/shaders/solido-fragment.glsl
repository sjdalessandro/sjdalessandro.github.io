var solidoFragmentShader = `
    precision highp float;
    uniform vec3 color;
    uniform vec3 viewPos;

    varying vec3 vNormal;
    varying vec3 vPosWorld;

    void main(void) {

        float ambientStrength = 0.4;
        vec3 lightColor = vec3(1.0, 1.0, 0.9);
        vec3 ambient = ambientStrength * lightColor;

        vec3 norm = normalize(vNormal);
        float diffuseStrength = 0.8;
        vec3 lightPos = vec3(160.0, 20.0, 128.0);
        vec3 lightDir = normalize(lightPos - vPosWorld);  
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = diffuseStrength * diff * lightColor;

        vec3 specularLightColor = vec3(1.0, 1.0, 1.0);
        float specularStrength = 1.0;
        vec3 viewDir = normalize(viewPos - vPosWorld);
        vec3 reflectDir = reflect(-lightDir, norm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 256.0);
        vec3 specular = specularStrength * spec * specularLightColor;

        vec3 result = (ambient + diffuse) * color + specular;
        gl_FragColor = vec4(result, 1.0);
    }
`;