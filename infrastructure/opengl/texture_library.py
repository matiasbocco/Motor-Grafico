from pathlib import Path

import moderngl
import pyglet

PROJECT_ROOT = Path(__file__).resolve().parents[2]
WHITE_TEXEL = bytes((255, 255, 255, 255))


class TextureLibrary:
    """Loads each image once and keeps it in GPU memory, indexed by its path."""

    def __init__(self, context: moderngl.Context) -> None:
        self._context = context
        self._textures: dict[str, moderngl.Texture] = {}
        self._defaults = {
            "base": self._solid_texture(WHITE_TEXEL),
        }

    def texture(self, relative_path: str | None, kind: str) -> moderngl.Texture:
        if relative_path is None:
            return self._defaults[kind]
        if relative_path not in self._textures:
            self._textures[relative_path] = self._load(relative_path)
        return self._textures[relative_path]

    def _load(self, relative_path: str) -> moderngl.Texture:
        image = pyglet.image.load(str(PROJECT_ROOT / relative_path)).get_image_data()
        data = image.get_data("RGBA", image.width * 4)
        return self._context.texture((image.width, image.height), 4, data)

    def _solid_texture(self, texel: bytes) -> moderngl.Texture:
        return self._context.texture((1, 1), 4, texel)
