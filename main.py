from infrastructure.pyglet_window import Window

WIDTH, HEIGHT = 800, 600


def main() -> None:
    window = Window(WIDTH, HEIGHT, "Bocco Matias")
    window.run()


if __name__ == "__main__":
    main()
