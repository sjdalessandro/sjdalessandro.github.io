var vidrioFragmentShader = `
    precision highp float;
 
    // Passed in from the vertex shader.
    varying vec3 vPosWorld;
    varying vec3 vNormal;

    // The texture.
    uniform samplerCube uSkybox;

    // The position of the camera
    uniform vec3 viewPos;

    void main() {
        float ambientStrength = 0.5;
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
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 4096.0);
        vec3 specular = specularStrength * spec * specularLightColor;  
        
        vec3 worldNormal = normalize(vNormal);
        vec3 eyeToSurfaceDir = normalize(vPosWorld - viewPos);
        vec3 direction = reflect(eyeToSurfaceDir, worldNormal);

        vec3 color = textureCube(uSkybox, direction).xyz * vec3(0.6, 0.9, 0.6);
        vec3 result = (ambient + diffuse) * color + specular;

        gl_FragColor = vec4(result, 1.0);
    }
`;