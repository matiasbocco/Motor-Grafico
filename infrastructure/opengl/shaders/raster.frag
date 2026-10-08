#version 330 core

in vec2 v_uv;
in vec3 v_normal;

out vec4 frag_color;

uniform vec3 u_color;
uniform sampler2D u_base_color_map;
uniform vec3 u_to_light;
uniform vec3 u_light_color;
uniform float u_ambient;

void main() {
    vec3 albedo = u_color * texture(u_base_color_map, v_uv).rgb;
    vec3 normal = normalize(v_normal);
    float diffuse = max(dot(normal, u_to_light), 0.0);
    vec3 color = albedo * u_ambient + albedo * diffuse * u_light_color;
    frag_color = vec4(color, 1.0);
}
