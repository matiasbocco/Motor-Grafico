#ifndef RAYTRACING_GLSL
#define RAYTRACING_GLSL

#include "common/scene_query.glsl"
#include "common/sky.glsl"
#include "common/lighting.glsl"

uniform vec3 u_to_light;
uniform vec3 u_light_color;
uniform float u_ambient;

const float SURFACE_OFFSET = 1e-3;

// Luz que el punto de la superficie refleja hacia quien lo mira (dirección view_direction).
vec3 shade(Surface surface, vec3 view_direction) {
    vec3 offset_point = surface.point + surface.geometric_normal * SURFACE_OFFSET;
    float visibility = occluded(offset_point, u_to_light) ? 0.0 : 1.0;
    return blinn_phong(surface.albedo, surface.normal, view_direction, u_to_light,
                       u_light_color, u_ambient, surface.shininess, visibility);
}

// Color que ve un rayo: el color de la superficie más cercana, o el cielo.
vec3 trace(Ray ray) {
    Hit hit;
    if (!closest_hit(ray, hit)) {
        return sky_color(ray.direction);
    }
    return shade(surface_at(ray, hit), -ray.direction);
}

#endif
