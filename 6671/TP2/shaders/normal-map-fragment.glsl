var normalMapFragmentShader = `
    precision highp float;
    uniform vec3 viewPos;

    varying vec3 vNormal;
    varying vec3 vTangent;
    varying vec3 vPosWorld;
    varying vec2 vUv;

    uniform sampler2D normalMap;
    uniform sampler2D textura;

    vec3 calcBumpedNormal()
    {
        vec3 normal = normalize(vNormal);
        vec3 tangent = normalize(vTangent);
        tangent = normalize(tangent - dot(tangent, normal) * normal);
        vec3 bitangent = cross(normal, tangent);
        vec3 bumpMapNormal = texture2D(normalMap, vUv).xyz;
        bumpMapNormal = 2.0 * bumpMapNormal - vec3(1.0, 1.0, 1.0);
        vec3 newNormal;
        mat3 TBN = mat3(tangent, bitangent, normal);
        newNormal = TBN * bumpMapNormal; // Tangent-space to world-space.
        newNormal = normalize(newNormal);
        return newNormal;
    }

    void main(void) {

        vec3 norm = calcBumpedNormal();

        float ambientStrength = 0.6;
        vec3 lightColor = vec3(1.0, 1.0, 1.0);
        vec3 ambient = ambientStrength * lightColor;

        float diffuseStrength = 0.6;
        vec3 lightPos = vec3(160.0, 20.0, 128.0);
        vec3 lightDir = normalize(lightPos - vPosWorld);  
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = diffuseStrength * diff * lightColor;

        vec3 specularLightColor = vec3(1.0, 1.0, 1.0);
        float specularStrength = 0.3;
        vec3 viewDir = normalize(viewPos - vPosWorld);
        vec3 reflectDir = reflect(-lightDir, norm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
        vec3 specular = specularStrength * spec * specularLightColor;  
        
        vec4 color=texture2D(textura, vUv); 
        vec3 result = (ambient + diffuse) * color.xyz + specular;

        gl_FragColor = vec4(result, 1.0);
    }
`;
