# Zhi Yang · 个人主页 (ruayz.github.io)

A plain static site: `index.html` (content), `style.css` (look), `script.js`
(optional extras: theme switch, sticky nav, copy-email, and the Bernese lying
at the bottom of the page).
No build step. Push to GitHub and Pages serves it. `.nojekyll` must stay.

```
index.html      all the text: bio, publications, projects, …
style.css       colours, fonts, layout
script.js       small interactions (theme switch, nav, copy, the dog)
favicon.svg     browser-tab icon (Bernese face)
404.html        shown for missing pages (e.g. old links from the previous site)
images/         profile.jpg (800×800) and profile-400.jpg (same photo, 400×400)
files/          CV.pdf, paper and slide PDFs
```

## 本地预览 · Preview locally

```bash
cd path/to/this/folder
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. (Opening `index.html` directly also works.
The "Copy" button next to the email address needs a secure page: https,
localhost, or a file opened directly. On other plain-http addresses it stays
hidden and the address can still be selected and copied by hand.)

## 添加论文 · Add a publication

Search `index.html` for `id="publications"`. Copy the template from the comment
above the list to the **top** of the list that starts with `<ol class="pubs"`.
Things to change:

- `id="pub-short-name"`: a short unique name, e.g. `pub-neurips26`. Projects
  can link to it with `href="#pub-neurips26"`.
- the badge (`<span class="badge">NeurIPS 2026</span>`), or for a preprint
  `<span class="badge badge-preprint">Preprint</span><span class="pub-year">2026</span>`
- title, authors (keep `<strong class="me">Zhi Yang</strong>` so your name is
  emphasised), venue, one-line summary
- links: put PDFs in `files/` and link them as `files/your_paper.pdf`

## 添加项目 · Add a research project

Search `index.html` for `id="projects"` and copy the template from the comment
to the top of the list. Every project shows one status pill:
`<span class="pill pill-live">Ongoing</span>`, or once it has ended
`<span class="pill">Concluded</span>`. A thesis also gets
`<span class="pill pill-note">M.Eng. thesis</span>`. Link to a paper on this
page (Publications is below Projects, hence the ↓) instead of repeating its title:
`<a class="meta-link" href="#pub-short-name">Paper (VENUE 2026)<span aria-hidden="true"> ↓</span></a>`.

## 添加奖项 / 助教 / 学位 · Add an award, a teaching entry or a degree

Search `index.html` for `id="honors"`, `id="teaching"` or `id="education"`.
Each has a comment just below its heading with a ready-made entry. Copy it to
the **top** of the list underneath and edit it. For an award, the grey detail
in `<span class="muted">(…)</span>` is optional, and an award won in several
years uses `<span class="date">2027, 2026</span>` in place of the `<time>` part.

## 更换照片 · Swap the photo

1. Replace `images/profile.jpg` with a square photo (800×800 is ideal).
2. Re-make the small copy (macOS):
   ```bash
   sips -s format jpeg -z 400 400 images/profile.jpg --out images/profile-400.jpg
   ```
3. The rounded frame (slightly taller than wide, 11 : 12) crops the photo. To
   choose what stays visible, edit these lines near the top of `style.css`:
   ```css
   --photo-pos: 64% 38%;   /* x% y%: which part of the picture stays in view */
   --photo-zoom: 1.12;     /* 1 = whole height; bigger = zoom in */
   --photo-w: 236px;       /* photo width on wide screens */
   --photo-r: 32px;        /* corner roundness */
   ```
   A bigger first number moves the view to the right side of the photo, a bigger
   second number moves it down. The current values keep the water bottle at the
   lower-left corner of `profile.jpg` out of the frame; with a new photo,
   `--photo-pos: 50% 40%` and `--photo-zoom: 1` are a good start. The tinted tile
   behind the photo is `--photo-tile`: the light value is at the very top; the
   dark value appears twice, in the `prefers-color-scheme: dark` block and in
   `:root[data-theme="dark"]` just below it. Change both dark lines.
4. If you change the file name, also update the `src` / `srcset` of
   `<img class="portrait"` in the hero (that is the photo people see), plus
   `og:image` / `twitter:image` and the JSON-LD `"image"` in the `<head>` of
   `index.html`.

## 更换简历 · Replace the CV

Overwrite `files/CV.pdf` with the new file (same name). Nothing else to change.

## 狗狗 · The dog

A Bernese Mountain Dog lies at the right-hand end of the footer line, chin on
its paw, with three faint paw prints leading up to it: it walked along the line
and lay down. In the light theme its eyes are open; in the dark theme it is
asleep (eyes closed, little z's). It is the same drawing in both themes, only
the eyes and the z's change. While you are at the footer it takes a slow breath
or two now and then (awake it blinks, asleep its z's drift; a few rounds, then
it lies still); pointing at it or reaching it with the Tab key brings a couple
more. Click or tap it and a heart floats up and its tail thumps. With "reduce
motion" switched on nothing moves (a pet just shows the heart). With JavaScript
off it simply lies there; pressing it still shows the heart for a moment, but
there is no tail thump or screen-reader message.

- **Size**: `--dog-w` under "Footer" in `style.css` (the width of the drawing,
  about 101px; its height follows). Phones use a smaller value
  (`--dog-w: 89.175px`) under `@media (max-width: 640px)` further down, so
  change both. If you make it much bigger, also raise the `height` of
  `.footer-ground` (90px, and 82px on phones) so the heart still has room
  above it.
- **Breathing speed**: `--breath-time` (5.2s for one breath, with one blink in
  it when awake) in `style.css`, next to the breathing animations.
- **Eyes**: the open eye is `<g class="eye-open">` and the closed one
  `<path class="lid">`, both in the dog's head in `index.html`. Which shows is
  set by `--dog-awake` / `--dog-asleep` with the theme colours at the top of
  `style.css` (to keep it asleep in both themes, set `--dog-awake: none` and
  `--dog-asleep: inline` in the light block too).
- **Colours**: the `--bmd-*` colours at the top of `style.css`. Most of them
  also colour the little dog on the theme switch in the top right; only
  `--bmd-outline` (the outline: a soft slate by day, a lighter blue-grey after
  dark) and `--bmd-soft` (the faint fur lines) are the footer dog's alone. The
  heart is `--heart`. Every dark colour is written twice, so change both.
- **Remove it**: to remove the dog and its paw prints, delete the whole
  `<div class="footer-ground">…</div>` in the footer of `index.html` (the strip
  above the footer line goes with it). To remove only the dog, delete the
  `<button class="dog" …>…</button>` inside it; to remove only the paw prints,
  delete the `<div class="paw-trail" …>…</div>`. Nothing else needs to change.
- **The drawing** is the `<svg class="dog-art">` inside that button. It is
  hand-tuned artwork; there is no need to edit it.

## 其他 · Other notes

- **After editing `style.css` or `script.js`**: in the `<head>` of `index.html`,
  raise the number in `style.css?v=8` / `script.js?v=8` (e.g. to `v=9`).
  Browsers keep these files for about 10 minutes; a new number makes them
  fetch the new version at once instead of mixing new HTML with old styles.

- **Footer date**: edit "Last updated: Oct 2026" at the bottom of `index.html`.
- **Theme**: follows the visitor's system setting; the Bernese button in the top
  right switches it and the choice is remembered.
- **Colours** live at the top of `style.css` (`--accent` is the terracotta).
  The light colours come first. Every dark colour is written twice, in the
  `prefers-color-scheme: dark` block and in `:root[data-theme="dark"]`, so
  change a dark colour in both places.
- Everything works with JavaScript turned off (the theme switch and the Copy
  buttons are then hidden, and the dog just lies at the end of the line).
- **Email address**: shown under the links at the top of `index.html`
  (search `email-list`), with its Copy button; to show another address, copy
  that `<li class="email-line">` line and give it a new `id`. The "Email" link
  above it opens the same W&M address (`mailto:zyang23&#64;wm.edu`).
- Respecting "reduce motion": all animation stops if the visitor asks for it.
