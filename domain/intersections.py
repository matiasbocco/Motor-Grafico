from dataclasses import dataclass

from pyglm import glm

from domain.entity import Entity
from domain.ray import Ray
from domain.shapes import Rect

EPSILON = 1e-4


@dataclass(frozen=True)
class Hit:
    """Resultado de una intersección: a qué distancia y en qué punto del mundo chocó el rayo."""
    distance: float
    point: glm.vec3


def world_aabb(entity: Entity) -> tuple[glm.vec3, glm.vec3]:
    """Caja alineada a los ejes del mundo más chica que contiene a la entidad (mínimo y máximo)."""
    model = entity.transform.model_matrix()
    y_extent = 0.0 if isinstance(entity.shape, Rect) else 1.0
    corners = [glm.vec3(model * glm.vec4(x, y, z, 1.0))
               for x in (-1.0, 1.0) for y in (-y_extent, y_extent) for z in (-1.0, 1.0)]
    box_min = glm.vec3(corners[0])
    box_max = glm.vec3(corners[0])
    for corner in corners[1:]:
        box_min = glm.min(box_min, corner)
        box_max = glm.max(box_max, corner)
    return box_min, box_max


def _safe_inverse(direction: glm.vec3) -> glm.vec3:
    """1 / dirección, componente a componente. Si una componente es 0, usa un número muy grande."""
    return glm.vec3(*(1.0 / c if abs(c) > 1e-12 else 1e12 for c in direction))


def _slab(origin: glm.vec3, direction: glm.vec3, box_min: glm.vec3, box_max: glm.vec3) -> float | None:
    """Método de slabs: distancia a la que el rayo entra en la caja, o None si no la toca."""
    inverse_direction = _safe_inverse(direction)
    t_min = (box_min - origin) * inverse_direction
    t_max = (box_max - origin) * inverse_direction
    t1 = glm.min(t_min, t_max)
    t2 = glm.max(t_min, t_max)
    t_near = max(t1.x, t1.y, t1.z)
    t_far = min(t2.x, t2.y, t2.z)
    if t_near > t_far or t_near < EPSILON:
        return None
    return t_near


def intersect_aabb(ray: Ray, entity: Entity) -> Hit | None:
    box_min, box_max = world_aabb(entity)
    distance = _slab(ray.origin, ray.direction, box_min, box_max)
    if distance is None:
        return None
    return Hit(distance, ray.point_at(distance))


def closest_hit(ray: Ray, entities: list[Entity]) -> tuple[Entity, Hit] | None:
    """La entidad más cercana que golpea el rayo, junto con su intersección."""
    closest: tuple[Entity, Hit] | None = None
    for entity in entities:
        hit = intersect_aabb(ray, entity)
        if hit is not None and (closest is None or hit.distance < closest[1].distance):
            closest = (entity, hit)
    return closest
