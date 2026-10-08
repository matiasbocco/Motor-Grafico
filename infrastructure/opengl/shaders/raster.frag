#version 330 core

in vec2 v_uv;

out vec4 frag_color;

uniform vec3 u_color;

void main() {
    vec3 u_color_temp = u_color;
    frag_color = vec4(v_uv, 0.0, 1.0);
}
