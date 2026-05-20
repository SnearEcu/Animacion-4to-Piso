# Banda Pixel Animada

La demo usa la imagen original de la banda como fuente:

```text
personajes.png
```

Desde esa imagen se generaron 5 mascaras PNG transparentes en `assets/`.
La pagina usa solo los sprite sheets de correr en `assets/video-run/`.

Tambien incluye un modo de juego de ensayo: pulsa `Iniciar`, marca el ritmo con
`Correr` y acumula puntaje, combo y energia. Controles rapidos:

```text
3 = correr
Enter = iniciar partida
```

El modo `Correr` usa fotogramas extraidos del video:

```text
Band_members_running_in_loop_202605192212.mp4
```

Los sprite sheets resultantes estan en `assets/video-run/`.
Para evitar pedazos de personajes vecinos, `Todos + Correr` usa `assets/video-run/band.png`, que conserva la banda completa en cada fotograma.
Ahora el ciclo de correr usa solo 6 fotogramas limpios del video: `8, 10, 12, 18, 20, 22`.

El escenario usa `assets/backgrounds/fondo-4to-piso.png`, basado en `fondo 1.png`, y se desplaza horizontalmente cuando la accion es `Correr`.
