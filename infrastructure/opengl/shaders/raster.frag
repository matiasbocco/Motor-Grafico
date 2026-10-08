#version 330 core

in vec2 v_uv;

out vec4 frag_color;

uniform vec3 u_color;
uniform sampler2D u_base_color_map;

void main() {
    vec3 albedo = u_color * texture(u_base_color_map, v_uv).rgb;
    frag_color = vec4(albedo, 1.0);
}
