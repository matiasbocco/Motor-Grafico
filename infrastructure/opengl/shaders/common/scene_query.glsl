#ifndef SCENE_QUERY_GLSL
#define SCENE_QUERY_GLSL

#include "common/ray.glsl"
#include "common/scene_types.glsl"
#include "common/intersections.glsl"

// El shader principal declara el arreglo objects[] y el uniform u_object_count antes de incluir este archivo.
uniform sampler2DArray u_textures;

struct Hit {
    float distance;
    int object_index;
    vec3 local_point;
    vec3 local_normal;
};

struct Surface {
    vec3 point;
    vec3 normal;
    vec3 albedo;
};

// Lleva el rayo al espacio local del objeto (sin normalizar la dirección) y prueba su forma.
bool intersect_object(int index, Ray ray, out float distance, out vec3 local_point, out vec3 local_normal) {
    mat4 inverse_model = objects[index].inverse_model;
    vec3 origin = (inverse_model * vec4(ray.origin, 1.0)).xyz;
    vec3 direction = (inverse_model * vec4(ray.direction, 0.0)).xyz;
    bool found;
    if (int(objects[index].shape_layers.x) == SHAPE_BOX) {
        found = intersect_local_box(origin, direction, distance, local_normal);
    } else {
        found = intersect_local_rect(origin, direction, distance, local_normal);
    }
    local_point = origin + direction * distance;
    return found;
}

// El objeto más cercano que golpea el rayo. Igual que closest_hit en Python.
bool closest_hit(Ray ray, out Hit hit) {
    hit.distance = NO_HIT;
    hit.object_index = -1;
    for (int i = 0; i < u_object_count; i++) {
        float distance;
        vec3 local_point;
        vec3 local_normal;
        if (intersect_object(i, ray, distance, local_point, local_normal) && distance < hit.distance) {
            hit.distance = distance;
            hit.object_index = i;
            hit.local_point = local_point;
            hit.local_normal = local_normal;
        }
    }
    return hit.object_index >= 0;
}

// Lo que necesitamos saber de la superficie en el punto de impacto.
Surface surface_at(Ray ray, Hit hit) {
    SceneObject object = objects[hit.object_index];
    Surface surface;
    surface.point = ray.origin + ray.direction * hit.distance;
    surface.normal = normalize(transpose(mat3(object.inverse_model)) * hit.local_normal);
    vec2 uv = face_uv(hit.local_point, hit.local_normal) * object.shape_layers.w;
    // En el compute shader no hay derivadas de pantalla para elegir el mipmap: leemos el nivel 0.
    vec3 base_color = textureLod(u_textures, vec3(uv, object.shape_layers.y), 0.0).rgb;
    surface.albedo = object.color_reflectivity.rgb * base_color;
    return surface;
}

#endif
