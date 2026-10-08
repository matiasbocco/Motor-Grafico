#version 330 core

in vec3 in_position;
in vec2 in_uv;

uniform mat4 u_model;
uniform mat4 u_view_projection;

out vec2 v_uv;

void main() {
    v_uv = in_uv;
    gl_Position = u_view_projection * u_model * vec4(in_position, 1.0);
}
