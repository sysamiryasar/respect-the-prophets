# Your own artwork

Anything you put in this folder replaces the rendered plate of the same name.
Export from Canva (or anywhere else), drop the file here, and run:

```bash
npm run plates:import
```

That builds the same assets the renderer produces — AVIF and WebP at 1600 and
800 wide, plus the tiny inline blur-up placeholder — and records the id in
`imported.json` so `npm run plates` will not overwrite your file later.

## Naming

The filename is the plate id. `-light` is the parchment theme.

```
art/musa.png          the night plate for Musa
art/musa-light.png    the parchment plate for Musa
art/ch-home.jpg       the opening chapter
```

`png`, `jpg`, `jpeg`, `webp` and `avif` all work. Supply only the ids you want
to replace — everything else keeps its render, and the two mix freely on the
same page. To go back to the rendered version, delete the file from here, the
matching entry from `imported.json`, and re-run `npm run plates`.

## Sizing

Export **16:9**. 1920×1080 is ideal; 1600×900 is the native size. Anything
else is centre-cropped to 16:9, so you may lose the edges.

These are *backdrops*. The symbolic vector artwork, the headings and the body
text are all drawn on top of them, so the middle of the frame wants to stay
quiet — sky, haze, distance. Busy detail through the centre will fight the
words.

## Plate ids

**Chapters** — `ch-home`, `ch-why`, `ch-pillars`, `ch-prophets`, `ch-stories`,
`ch-quran`, `ch-lessons`, `ch-respect`, `ch-constellation`, `ch-final`

**Prophets** — `adam`, `nuh`, `ibrahim`, `ismail`, `ishaq`, `yaqub`, `yusuf`,
`musa`, `harun`, `dawud`, `sulayman`, `yunus`, `zakariyya`, `yahya`, `isa`,
`muhammad`

## What these images may show

The same rule that governs the rest of this project governs whatever you put
in this folder, and it is the reason the renderer is built the way it is:

> **No depiction of any Prophet.** No faces, no bodies, no portraits, no
> silhouettes or shadows standing in for one. The stories are told through
> symbolism and environment.

So: landscape, weather, light, water, architecture, pattern, calligraphic
ornament. If you generate images with an AI tool, check the output rather than
trusting the prompt — these models add human figures readily, and a distant
figure on a dune is still a depiction.

Please also keep any Arabic or Qur'anic text out of generated imagery. Verses
in this project are set as real text from `src/data/content.ts`, with surah
and ayah numbers, precisely so that nothing scriptural is ever left to a
generator to invent.

## A note on this folder and git

The exports themselves are not committed — they are large, and the built
assets in `public/img/` are what actually ship. `imported.json` *is*
committed, so a fresh checkout still knows which plates are yours and leaves
them alone. Keep your source files somewhere you can find them again.
