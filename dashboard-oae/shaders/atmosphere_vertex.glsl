varying vec3 vertexNormal;

void main() {
    vertexNormal = normalize(normalMatrix * normal); // Pass the normal vector to the fragment shader
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // Set the position of the vertex
}

