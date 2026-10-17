#ifndef RAYTRACING_GLSL
#define RAYTRACING_GLSL

#include "common/scene_query.glsl"
#include "common/sky.glsl"

// Color que ve un rayo: el color de la superficie más cercana, o el cielo.
vec3 trace(Ray ray) {
    Hit hit;
    if (!closest_hit(ray, hit)) {
        return sky_color(ray.direction);
    }
    return surface_at(ray, hit).albedo;
}

#endif
