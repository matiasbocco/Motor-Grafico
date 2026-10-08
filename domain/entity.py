from dataclasses import dataclass, field

from domain.material import Material
from domain.shapes import Shape
from domain.transform import Transform


@dataclass
class Entity:
    name: str
    shape: Shape
    transform: Transform = field(default_factory=Transform)
    material: Material = field(default_factory=Material)
