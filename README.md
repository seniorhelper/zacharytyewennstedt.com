# zacharytyewennstedt.com

Hand-coded static site. No build step, no dependencies, no page builder.

## Deploying (GitHub web upload)

1. Unzip.
2. Open the repo home page on GitHub, click **Add file → Upload files**.
3. Drag ALL of these in at once and commit:
   `index.html  404.html  sitemap.html  thank-you.html  CNAME  robots.txt  sitemap.xml  llms.txt  README.md`
   plus the folders `css/  js/  images/  what-i-build/  fractional-cmo/
   conversion-optimization/  projects/  my-story/  arcade/  lets-talk/`

Dragging a folder keeps its structure, so this is one drag and one commit.
Nothing already in the repo gets deleted by an upload — your existing
`images/` files (the four .mp4 videos and the original JPG/PNG artwork) stay
exactly where they are. The lightning video is still referenced by the home
page at `images/lightning-top hero video.mp4`, so leave it in place.

## Structure

- `css/ztw.css` — all shared chrome and base styles. Cached across every page.
- `js/ztw.js` — nav, equalizer, scroll reveals, runtime email assembly, hardened forms.
- `js/zach.js` — the Zach character: arrival scene and the chat guide. One file,
  injects its own markup. Never inline it per page.
- `js/booth.js` — the selfie booth on the home page. All eight backdrops are
  drawn with canvas primitives, so there are no scene images to manage. Faces
  come from `images/zach-face.webp` and `images/zach-face-shades.webp`. There is
  no upload endpoint anywhere in this file by design.
- Each page carries its own scoped `<style>` and page JS. Nothing is shared
  that should not be.

## Forms

All forms post to the address assembled at runtime from base64 chunks — the
address appears nowhere in the served HTML except the JSON-LD, which is
deliberate, since that is the channel AI engines read. Protection is a
`_honey` honeypot, a four-second time trap and an interaction gate, so a
headless POST fails silently and a real person never sees a captcha.

## Adding a page later

Copy the chrome from any existing page (header, music bar, mobile nav, footer)
and keep `css/ztw.css`, `js/ztw.js` and `js/zach.js` in place. Then add the URL
to `sitemap.xml`, `sitemap.html` and `llms.txt`.
