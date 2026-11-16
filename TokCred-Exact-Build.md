# TokCred: Complete Exact-Build Specification (Dark + Liquid Glass)

This file has two parts.

- **Part A** is the design and behaviour specification.
- **Part B** is the complete source code of the approved UI (`tokcred.html`), split into head, CSS, body and JavaScript. Part B is the exact visual and functional source of truth.

## How to use this file (instructions for the AI building the UI)

1. For a **web build**: assemble ONE self-contained HTML file by joining, in order: B1 (head), B2 (CSS inside `<style>`), B3 (body), B4 (JS inside `<script>`).
2. For a **native Android build**: treat Part B as the exact visual and behaviour reference and translate it using the notes in Part A section 10. Do not embed it in a WebView.
3. Do not change any CSS value, colour, SVG path, copy, animation or JS behaviour.
4. If Part A and Part B disagree, Part B wins.
5. Do not redesign, modernise or add anything. The theme is dark only.
6. After building, check the result against Part A section by section.

## Code map

| Area | Where in Part B |
|---|---|
| Light base tokens | B2, the first `:root` block (overridden by the dark block) |
| **Dark tokens and glass layer** | B2, the last block, starting with the comment `TokCred DARK + liquid glass v4` |
| Glass v3 (sticky top bar, floating nav, content under glass) | B2, the block starting `glass v3` |
| Glass v2 (blur and lit surfaces) | B2, the block starting `Liquid glass layer` |
| Backdrop glows and orbs | B2, `#app:before`, `#app:after`, `@keyframes dr2` (final versions are in the dark block) |
| Layout frame, screen transitions | B2, `#app`, `#view`, `.scr`, `@keyframes in` and `inb` |
| Components | B2, `.card .cc .vb .btn .pri .sec2 nav .fi .seg .grp .emp .toast .sheet .top` |
| Identity card with sheen | B2, `.idc`, `@keyframes sh` |
| Card materialise animation | B2, `@keyframes mat` and `.scr .card:not(.rise)` |
| Scanner | B2 `.cam .fr`, `@keyframes sc`; B4 `screens.scan` |
| Loading | B2 `.rg .stp`, `@keyframes rp`; B4 `screens.load` and `verify()` |
| Success and failed reveal | B2 `.res .rise`, `@keyframes pop dr rs` |
| Icons | B4, the `P` object (listed below) |
| Mock data | B4, the `C` array |
| QR pattern generator | B4, `qrSvg()` |
| Screens | B4, the `screens` object (role, home, creds, detail, qr, vhome, manual, scan, load, ok, no, profile) |
| Navigation and state | B4, `S`, `go()`, `draw()`, `tabs()` |
| Verification flow | B4, `verify()`, `okc()`, click handler `data-act` branches |
| Role persistence | B4, `store`, `data-pick` and `data-role` handlers |
| Share and explorer | B4, `shareV()`, the `.lk` link in `screens.ok` |

**Important about the CSS order:** the stylesheet is layered. Later rules override earlier ones with the same specificity, so the file order in B2 must be kept exactly as given. Do not reorder, merge or "clean up" rules.

## Icon set (SVG path data; stroke style is set by the `svg.i` CSS rule)

Stroke 1.7px, round caps and joins, no fill, 24x24 viewBox, rendered at 22px.

| Icon name | Path data (truncated; full data in B4) |
|---|---|
| `home` | `M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z` |
| `cards` | `<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 10h6M7 14h4"/>` |
| `shield` | `M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4` |
| `user` | `<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>` |
| `qr` | `<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" r…` |
| `share` | `M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7` |
| `chev` | `M9 6l6 6-6 6` |
| `back` | `M15 6l-6 6 6 6` |
| `check` | `M5 12.5l4.5 4.5L19 7.5` |
| `search` | `<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>` |
| `bolt` | `M13 3L5 14h6l-1 7 8-11h-6z` |
| `copy` | `<rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 …` |
| `bell` | `M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4` |
| `lock` | `<rect x="5" y="11" width="14" height="10" rx="3"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>` |
| `info` | `<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>` |
| `doc` | `M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM14 3v5h5` |
| `sun` | `<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1…` |
| `x` | `M6 6l12 12M18 6L6 18` |
| `alert` | `M12 7v6M12 17v.01` |
| `key` | `<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l3 3"/>` |
| `refresh` | `M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5` |

---

# PART A: Design and behaviour specification

# TokCred: Design and Behaviour Specification (Dark + Liquid Glass)

TokCred is a digital academic credential verification app. This document describes the current approved UI: a **full dark theme with liquid-glass surfaces**. It is UI only: no backend, blockchain or real verification. All data is mock and all state is local.

Live prototype: https://claude.ai/artifact/XeC1AcsLnt2odccR4imDyN
Reference source: `tokcred.html` (vanilla HTML, CSS and JS, included in full in Part B of TokCred-Exact-Build.md).

---

## 1. Roles

| Role | Purpose | Tabs |
|---|---|---|
| Student | View, present and share credentials | Home, Credentials, Verify, Profile |
| Verifier | Confirm a credential's authenticity | Home, Scan, Verify, Profile |

- On first launch a **role selection screen** is shown. The choice is saved in `localStorage` under `tc-role`. Later launches skip the screen.
- Profile has a **Student / Verifier** segmented control to switch roles. The switch is saved too.

---

## 2. Dark Theme Tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#090B10` | App background |
| `--s` | `#14171F` | Solid surface |
| `--s2` | `rgba(255,255,255,.07)` | Secondary surface |
| `--t` | `#F2F4F8` | Primary text |
| `--t2` | `#9AA3B2` | Secondary text |
| `--t3` | `#6B7383` | Muted text, inactive icons |
| `--b` | `#3B8CFF` | Primary blue |
| `--b2` | `#1F6FE8` | Dark blue (pressed, gradients) |
| `--bs` | `rgba(59,140,255,.16)` | Soft blue tint |
| `--g` / `--gs` | `#3DD68C` / `rgba(61,214,140,.14)` | Verified |
| `--ln` | `rgba(255,255,255,.09)` | Hairlines |

- Outside the phone frame (desktop only) the page colour is `#050608`.
- Failure uses a restrained coral: icon `#FF8A6A` on `rgba(255,122,92,.14)`. Input error uses `#FF6B66`, helper text `#FF8A84`.
- Typography: Inter (400, 500, 600, 700) with system fallbacks. H1 30px/600/-0.03em, H2 19px/600, body 15px, meta 13px, hero number 68px/600/-0.05em.
- Radii: buttons 15px, cards 22px, hero 30px, identity card 28px, nav bar 30px.
- Page padding: 22px horizontal. Section gap: about 36px.

---

## 3. Liquid Glass System

Glass only works when there is something behind it to blur and when it is lit like a material. Follow these rules.

### 3.1 Layers
1. **Backdrop layer:** near-black background with three soft glows (blue top right, violet left, teal bottom right) and three dim orbs that drift slowly (22s, alternate, small translate and scale). Orbs sit at about 60% opacity.
2. **Content layer:** text, plain rows, icons. This is not glass.
3. **Glass layer:** cards, nav bar, top bar, round buttons, secondary buttons, inputs, the segmented control, the share sheet, the toast.
4. **Tinted layer:** primary blue buttons and the identity card stay solid blue gradient with a gloss. They are the focal points.

### 3.2 Glass recipe (all glass surfaces)
- Fill: white at 15% fading to 5% on a 145° diagonal.
- Blur: 28px with saturate 1.8 (nav bar 30px / saturate 2, top bar 26px / 1.9, sheet 32px).
- Border: 1px white at 14%.
- Top rim light: inset 1.5px white at 30%.
- Bottom edge: inset 1px white at 4%.
- Soft inner glow: inset 24px white at 4%.
- Drop shadow: 14px offset, 36px blur, black at 40%.
- Hero card fill: white 17% to blue 24%.

### 3.3 Rules
- Never put glass on glass.
- Never fade a glass surface with opacity. Move it with transforms. Fading an element or its parent breaks the blur.
- Glass belongs on controls and cards, not on plain body text.
- The QR card is the one exception: it is solid near-white (`#F7F9FC`) so the code stays scannable.
- Respect reduced motion: all animation and transition durations collapse to near zero.

---

## 4. Motion

- Easing: `cubic-bezier(.32,.72,0,1)`.
- Screen transitions: slide 22px horizontally (forward and back), no fade.
- Cards **materialise** on screen entry: scale from 0.965 and rise 8px while the blur sharpens from 2px. They do not fade. Credential lists stagger by 70ms.
- Press: cards and buttons scale to 0.97; a pressed card brightens its fill and rim.
- Identity card: one light sheen sweep (3.2s, once).
- Scan line sweeps up and down in the scanner frame (2.2s, alternate).
- Loading: three expanding rings pulse around a shield tile; three step lines light up in turn (every 450ms).
- Success: the circle pops in and the check draws itself; the content below rises in with a delay.
- Bottom sheet slides up; its backdrop dims without fading the panel.

---

## 5. Components

| Component | Notes |
|---|---|
| Header / logo | Blue rounded mark with a shield icon plus "TokCred"; avatar at the right |
| Top bar | Pinned (sticky) glass bar; content scrolls under it and blurs |
| Back bar | Circular glass icon button, centred title |
| Bottom navigation | Floating glass pill 14px from the sides, over the content; the active tab is a blue-tinted glass pill |
| Credential card | Glass card with monogram tile, degree, program, institution and year, chevron, Verified badge, and a 3px blue accent bar |
| Identity card | Solid blue gradient with a rim highlight (Credential Details) |
| Verification badge | Green pill with a check icon |
| Buttons | Primary: glossy blue gradient. Secondary: glass. Both 54px high, 15px radius |
| Icon button | 40px glass circle |
| Text input | Glass field. States: default, focus (blue ring), valid (green border), error (red border and ring) |
| QR card | Solid near-white card with the generated QR pattern |
| Student & Credential card | One glass card: Student label, large name, program, a single divider, then a two-column grid (Degree, Grade / CGPA, Institution, Issue date) |
| Ledger Proof card | Glass card: Token ID row and a blue "View on Explorer →" link |
| Settings group | Glass group of chevron rows |
| Segmented control | Glass track with a brighter selected thumb |
| Empty state | Icon tile, title, text, Refresh button |
| Toast | Frosted pill near the bottom |
| Bottom sheet | Frosted panel with a grab handle |

Icons are a single inline SVG set (21 icons, 1.7px stroke, round caps and joins). The full path data is in Part B.

---

## 6. Screens

**Role Selection (first launch only):** logo, "Welcome to TokCred", "Choose how you'll use the app." Two large cards. Student: "View and share your academic credentials". Verifier: "Verify a student's academic credential".

**Student Home:** "Good morning, Abrar" and "Your academic credentials, all in one place." Hero card with shield icon, "Verified Credentials", the number 3 and "All credentials are securely verified". My Credentials (first two cards plus "See all"). Quick Actions: View, Show QR, Share.

**My Credentials:** title, subtitle "Your verified academic achievements", live search, full credential cards. Empty state "No credentials yet" with Refresh when search finds nothing.

**Credential Details:** blue identity card (monogram, Verified badge, degree, program, institution, student, issue year, credential ID), then Credential Information rows, then Show QR (primary), Share Credential, Verify Credential.

**Share Credential (QR):** "Scan this QR code to verify your credential.", a large QR card, the credential summary with a Verified badge, then Share Credential (primary) and Copy Verification Code.

**Verifier Home:** "Verify a Credential" with a large Scan QR Code card (primary, hero-style glass), then Enter Verification Code with an input and a Verify button.

**QR Scanner:** dark camera viewport, rounded frame with corner marks, scan line, back button, flash button, "Scan Credential QR / Position the QR code inside the frame." Completes after about 6 seconds or with the Simulate scan button.

**Manual Verification:** "Enter Verification Code", placeholder `TC-2026-XXXXXX`, helper text, Verify Credential (primary). Input states: default, focus, valid, error.

**Verification Loading:** pulsing rings, "Checking credential…", steps: Reading credential, Confirming issuer, Matching signature. About 1.9 seconds.

**Verification Success (content order):**
1. Green check icon
2. Credential Verified, "This credential is authentic and has been successfully verified."
3. Credential summary card (with Authentic badge)
4. Student & Credential card
5. Verification Details: Credential ID, Issuer, Issued Date, Verification Status
6. Ledger Proof: Token ID and View on Explorer →
7. Buttons: Share Verification (secondary), View Credential (primary), Verify Another (secondary)

**Verification Failed:** coral "!" icon, "Credential Could Not Be Verified", "We couldn't confirm this credential." Reasons: does not exist, has been revoked, information has changed. Actions: Try Again (primary), Enter Another Code.

**Profile:** avatar, name, current role, role switch, groups Account (Personal Information, Security), Preferences (Notifications, Appearance), About (About TokCred, Privacy Policy, Terms). Rows are visual only.

---

## 7. Flows

- Student: Role select, Home, Credentials, Credential Details, Show QR / Share / Verify.
- Verifier: Role select, Verifier Home, Scan or Enter Code, Loading, Success or Failed, View Credential or Verify Another.

---

## 8. Mock Behaviour

- Valid code format: `TC-YYYY-XXXXXX` (uppercase letters and digits).
- A malformed code shows the input error.
- A code containing `000000` shows the failed result.
- A known credential ID shows that credential; other valid codes show the first one. Scanning always shows the first.
- Share Verification uses the native share sheet when available, otherwise copies the text and shows a toast.
- View on Explorer opens the mock `explorerUrl` in a new tab.
- Shared text, in this order, each label on its own line followed by the value on the next: TokCred Credential Verification, Credential, Student, Institution, Grade, Status, Credential ID, Verification (Authentic).

---

## 9. Mock Data

| Credential | Institution | Year | Grade | ID | Token ID |
|---|---|---|---|---|---|
| Bachelor of Technology (Computer Science & Engineering) | Presidency University | 2026 | 8.7 CGPA | TC-2026-48X7QA | TC-TOKEN-829341 |
| Minor in Artificial Intelligence (Applied Machine Learning) | Presidency University | 2026 | A Grade (9.1 GPA) | TC-2026-9KD2LM | TC-TOKEN-514072 |
| Senior Secondary Certificate (Science Stream) | Bengaluru Central School | 2023 | 91.4% | TC-2023-5TR8WB | TC-TOKEN-367815 |

Each credential has: degree, program, institution, monogram, year, study span, credential ID, student name (Abrar), grade, token ID, explorer URL (mock, on example.com) and status (Verified).

---

## 10. Native Android Translation Notes (Jetpack Compose)

- Convert px to dp 1:1 and font px to sp 1:1. Bundle Inter (400, 500, 600).
- Put tokens in one theme (Color, Type, Shape, Spacing). Do not use default Material 3 components.
- CSS backdrop blur has no direct Compose equivalent. On Android 12 and above, blur the backdrop layer with `RenderEffect` or `Modifier.blur` on a duplicate of the backdrop clipped to each glass surface. On older versions, fall back to a solid translucent fill (about 80% of the surface colour) and keep the rim light and shadow. Tell the user when the fallback is used.
- Draw the rim light and edge highlights with a gradient border (`Brush.linearGradient`) plus an inner top highlight line.
- Draw the backdrop glows and orbs on a full-screen `Canvas` behind the content and animate them slowly with `rememberInfiniteTransition`.
- Redraw the 21 SVG icons as `ImageVector`s using the path data in Part B (stroke 1.7, round caps and joins).
- Port the QR pattern generator to a Kotlin `Canvas`. It is decorative, not scannable.
- Honour the system "remove animations" setting.
- Use `WindowInsets` for status bar, navigation bar and keyboard.

---

## 11. Known Limitations

- The QR codes are decorative and not scannable.
- The scanner does not use the camera; the flash button is a stub.
- The explorer URL is a placeholder.
- Profile rows are non-functional.
- There is no authentication, networking or real verification.
- The nav bar is rebuilt on each tab change, so the active pill does not slide between tabs.
- Inter loads from Google Fonts; offline it falls back to the system font.


---

# PART B: Complete source code

## B1. Head

```html
<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>TokCred</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## B2. CSS (inside `<style>`)

```css
:root{color-scheme:light;--bg:#F7F8FA;--s:#fff;--s2:#F1F3F6;--t:#111318;--t2:#6B7280;--t3:#9CA3AF;--b:#1677FF;--b2:#0A5BD8;--bs:#EAF3FF;--g:#1F9D63;--gs:#E8F6EE;--ln:rgba(17,19,24,.07);--sh:0 1px 2px rgba(17,19,24,.04),0 8px 24px rgba(17,19,24,.05);--ease:cubic-bezier(.32,.72,0,1);box-sizing:border-box}
*{box-sizing:border-box;margin:0;-webkit-tap-highlight-color:transparent}
html,body{height:100%}body{font-family:Inter,-apple-system,"SF Pro Text","Segoe UI",Roboto,sans-serif;background:#E6E9EF;color:var(--t);display:flex;justify-content:center;align-items:center;-webkit-font-smoothing:antialiased}
#app{position:relative;width:100%;height:100%;background:var(--bg);overflow:hidden;display:flex;flex-direction:column}
@media(min-width:520px){#app{width:392px;height:820px;max-height:96vh;border-radius:44px;box-shadow:0 30px 80px rgba(17,19,24,.18),0 0 0 8px #fff}}
#view{flex:1;overflow-y:auto;overflow-x:hidden;padding:calc(env(safe-area-inset-top,0px) + 18px) 22px 28px;scrollbar-width:none}
#view::-webkit-scrollbar{display:none}
.scr{animation:in .38s var(--ease)}.back .scr{animation-name:inb}
@keyframes in{from{transform:translateX(22px)}}@keyframes inb{from{transform:translateX(-22px)}}
svg.i{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}
h1{font-size:30px;font-weight:600;letter-spacing:-.03em;line-height:1.12}h2{font-size:19px;font-weight:600;letter-spacing:-.02em}
.sub{color:var(--t2);font-size:15px;line-height:1.45;margin-top:8px}.meta{font-size:13px;color:var(--t2)}
.top{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;min-height:40px}
.logo{display:flex;align-items:center;gap:9px;font-weight:600;letter-spacing:-.02em;font-size:17px}
.lm{width:30px;height:30px;border-radius:9px;background:linear-gradient(150deg,#3B93FF,var(--b2));display:grid;place-items:center;color:#fff}.lm svg{width:17px;height:17px;stroke-width:2.2}
.av{width:38px;height:38px;border-radius:50%;background:linear-gradient(150deg,#DCEAFF,#BBD6FF);color:var(--b2);display:grid;place-items:center;font-weight:600;font-size:15px}.av.l{width:84px;height:84px;font-size:32px}
.ib{width:40px;height:40px;border-radius:50%;background:var(--s);border:1px solid var(--ln);display:grid;place-items:center;color:var(--t);cursor:pointer;transition:transform .15s}
.sec{margin-top:36px}.sh{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px}.sh a{color:var(--b);font-size:14px;font-weight:500;cursor:pointer}.lk{color:var(--b);font-size:14px;font-weight:500;cursor:pointer;text-decoration:none}
.card{background:rgba(255,255,255,.72);backdrop-filter:blur(22px) saturate(1.6);-webkit-backdrop-filter:blur(22px) saturate(1.6);border:1px solid rgba(255,255,255,.8);border-radius:22px;box-shadow:var(--sh),0 0 0 1px var(--ln),inset 0 1px 0 rgba(255,255,255,.9)}
.press{cursor:pointer;transition:transform .18s var(--ease)}.press:active{transform:scale(.97)}
.hero{border-radius:30px;padding:26px;background:linear-gradient(160deg,#fff 30%,var(--bs));position:relative;overflow:hidden}
.hero .n{font-size:68px;font-weight:600;letter-spacing:-.05em;line-height:1;margin:14px 0 10px}
.hero .sd{position:absolute;right:22px;top:22px;width:46px;height:46px;border-radius:15px;background:var(--b);color:#fff;display:grid;place-items:center;box-shadow:0 8px 20px rgba(22,119,255,.3)}
.cc{display:flex;align-items:center;gap:14px;padding:16px;margin-bottom:12px;position:relative}
.cc:before{content:"";position:absolute;left:0;top:22px;bottom:22px;width:3px;border-radius:0 3px 3px 0;background:var(--b)}
.mono{width:48px;height:48px;border-radius:14px;background:var(--bs);color:var(--b2);display:grid;place-items:center;font-weight:600;font-size:15px;flex:none}
.cc .x{flex:1;min-width:0}.cc b{display:block;font-weight:600;font-size:16px;letter-spacing:-.01em}.cc .meta{margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cc .r{display:flex;flex-direction:column;align-items:flex-end;gap:8px;color:var(--t3)}
.vb{display:inline-flex;align-items:center;gap:5px;background:var(--gs);color:var(--g);font-size:12px;font-weight:500;padding:4px 9px 4px 7px;border-radius:99px}.vb svg{width:13px;height:13px;stroke-width:2.4}
.qa{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.qa .card{padding:18px 8px 14px;text-align:center;font-size:13px;font-weight:500;display:flex;flex-direction:column;align-items:center;gap:10px}.qa .ic{width:42px;height:42px;border-radius:13px;background:var(--bs);color:var(--b);display:grid;place-items:center}
.btn{width:100%;height:54px;border-radius:15px;border:0;font:600 16px Inter,sans-serif;display:flex;align-items:center;justify-content:center;gap:9px;cursor:pointer;transition:transform .15s var(--ease),background .2s}
.btn:active{transform:scale(.97)}.pri{background:var(--b);color:#fff;box-shadow:0 8px 20px rgba(22,119,255,.22)}.pri:active{background:var(--b2)}.sec2{background:var(--s2);color:var(--t)}.btn:disabled{opacity:.45}
.stack{display:flex;flex-direction:column;gap:12px;margin-top:28px}
nav{display:flex;padding:8px 14px calc(env(safe-area-inset-bottom,0px) + 10px);background:rgba(255,255,255,.78);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid var(--ln)}
nav button{flex:1;border:0;background:none;display:flex;flex-direction:column;align-items:center;gap:3px;font:500 11px Inter,sans-serif;color:var(--t3);padding:7px 0;border-radius:14px;cursor:pointer;transition:all .25s var(--ease)}
nav button.on{color:var(--b);background:var(--bs)}
.big{padding:26px}.kv{display:flex;justify-content:space-between;gap:16px;padding:15px 0;font-size:15px}.kv+.kv{border-top:1px solid var(--ln)}.kv span:first-child{color:var(--t2)}.kv span:last-child{font-weight:500;text-align:right}
.idc{border-radius:28px;padding:24px;color:#fff;background:linear-gradient(140deg,#2F8BFF,#0A5BD8 70%);box-shadow:0 18px 40px rgba(22,119,255,.28);position:relative;overflow:hidden}
.idc:after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.16) 50%,transparent 60%);transform:translateX(-100%);animation:sh 3.2s .5s var(--ease) 1 forwards}@keyframes sh{to{transform:translateX(100%)}}
.idc .mono{background:rgba(255,255,255,.18);color:#fff}.idc .vb{background:rgba(255,255,255,.95)}.idc h2{font-size:22px;margin-top:22px}.idc p{opacity:.82;font-size:14px;margin-top:4px}.idc .ft{display:flex;justify-content:space-between;align-items:flex-end;margin-top:26px;font-size:13px;opacity:.95}
.row{display:flex;justify-content:space-between;align-items:center}
.srch{display:flex;align-items:center;gap:10px;background:var(--s2);border-radius:14px;padding:0 14px;height:46px;color:var(--t3);margin-top:22px}.srch input{flex:1;border:0;background:none;font:16px Inter,sans-serif;outline:0;color:var(--t)}
.qrc{padding:30px;margin-top:26px;display:grid;place-items:center}.qrc svg{width:100%;max-width:230px;height:auto}
.fi{width:100%;height:58px;border-radius:15px;border:1.5px solid transparent;background:var(--s2);font:500 17px Inter,sans-serif;letter-spacing:.04em;padding:0 16px;outline:0;color:var(--t);transition:all .2s}
.fi:focus{background:#fff;border-color:var(--b);box-shadow:0 0 0 4px var(--bs)}.fi.ok{border-color:var(--g);background:#fff}.fi.er{border-color:#D9534F;background:#fff;box-shadow:0 0 0 4px #FDECEC}
.hint{font-size:13px;margin-top:10px;color:var(--t2)}.hint.er{color:#C4403C}
.ctr{text-align:center;display:flex;flex-direction:column;align-items:center}
.res{width:92px;height:92px;border-radius:50%;display:grid;place-items:center;margin:14px 0 22px;animation:pop .6s var(--ease)}@keyframes pop{from{transform:scale(.5);opacity:0}}
.res.ok{background:var(--gs);color:var(--g)}.res.no{background:#FDEEEA;color:#D1583B}.res svg{width:44px;height:44px;stroke-width:2}.res.ok path{stroke-dasharray:30;animation:dr .5s .25s var(--ease) both}@keyframes dr{from{stroke-dashoffset:30}}
.rise{animation:rs .5s .3s var(--ease) both}@keyframes rs{from{transform:translateY(14px)}}
.rsn{display:flex;gap:12px;align-items:center;padding:13px 0;font-size:15px;text-align:left}.rsn+.rsn{border-top:1px solid var(--ln)}.rsn i{width:7px;height:7px;border-radius:50%;background:#D1583B;opacity:.6;flex:none}
.ld{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:6px}
.rg{position:relative;width:130px;height:130px;display:grid;place-items:center;margin-bottom:26px}.rg i{position:absolute;inset:0;border-radius:50%;border:1.5px solid var(--b);opacity:0;animation:rp 1.8s infinite}.rg i:nth-child(2){animation-delay:.6s}.rg i:nth-child(3){animation-delay:1.2s}@keyframes rp{from{transform:scale(.45);opacity:.5}to{transform:scale(1.1);opacity:0}}
.rg .sd{width:60px;height:60px;border-radius:19px;background:var(--b);color:#fff;display:grid;place-items:center;position:relative}
.stp{font-size:14px;color:var(--t2);display:flex;gap:8px;align-items:center;opacity:.35;transition:opacity .4s}.stp.on{opacity:1}.stp svg{width:15px;height:15px;color:var(--g);stroke-width:2.4}
.cam{position:absolute;inset:0;z-index:5;background:radial-gradient(circle at 50% 40%,#3A3F49,#15181D);color:#fff;display:flex;flex-direction:column;padding:calc(env(safe-area-inset-top,0px) + 18px) 22px 40px;animation:in .38s var(--ease)}
.cam .ib{background:rgba(255,255,255,.14);border-color:transparent;color:#fff;backdrop-filter:blur(12px)}
.fr{width:250px;height:250px;margin:auto;position:relative;border-radius:34px;box-shadow:0 0 0 100vmax rgba(10,12,16,.45)}
.fr b{position:absolute;width:44px;height:44px;border:3px solid #fff;border-radius:16px}.fr .a{top:0;left:0;border-right:0;border-bottom:0}.fr .b2{top:0;right:0;border-left:0;border-bottom:0}.fr .c{bottom:0;left:0;border-right:0;border-top:0}.fr .d{bottom:0;right:0;border-left:0;border-top:0}
.fr u{position:absolute;left:16px;right:16px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,#5BA6FF,transparent);box-shadow:0 0 14px #5BA6FF;animation:sc 2.2s ease-in-out infinite alternate}@keyframes sc{from{top:16px}to{top:232px}}
.grp{background:var(--s);border:1px solid var(--ln);border-radius:18px;padding:0 16px;margin-bottom:26px}.grp .kv{align-items:center}.grp .kv span:first-child{color:var(--t);display:flex;gap:12px;align-items:center}.grp .kv span:first-child svg{color:var(--b);width:20px}.grp .kv span:last-child{color:var(--t3);font-weight:400}
.gh{font-size:13px;color:var(--t2);margin:0 0 9px 8px}
.seg{display:flex;background:var(--s2);border-radius:13px;padding:3px;margin:14px 0 30px}.seg button{flex:1;border:0;border-radius:10px;height:38px;background:none;font:500 14px Inter,sans-serif;color:var(--t2);cursor:pointer;transition:all .25s var(--ease)}.seg button.on{background:#fff;color:var(--t);box-shadow:0 1px 4px rgba(17,19,24,.12)}
.emp{padding:52px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px}.emp .ic{width:64px;height:64px;border-radius:20px;background:var(--s2);color:var(--t3);display:grid;place-items:center;margin-bottom:12px}.emp .ic svg{width:28px;height:28px}.emp .btn{width:auto;padding:0 28px;margin-top:16px;height:46px}
.toast{position:absolute;left:50%;bottom:100px;transform:translate(-50%,20px);background:rgba(17,19,24,.88);color:#fff;font-size:14px;padding:11px 18px;border-radius:99px;opacity:0;transition:all .3s var(--ease);z-index:9;pointer-events:none;white-space:nowrap}.toast.on{opacity:1;transform:translate(-50%,0)}
.sheet{position:absolute;inset:0;z-index:8;background:rgba(17,19,24,.3);display:flex;align-items:flex-end;animation:fd .25s}.sheet>div{width:100%;background:var(--bg);border-radius:28px 28px 0 0;padding:14px 22px calc(env(safe-area-inset-bottom,0px) + 24px);animation:up .4s var(--ease)}.sheet em{display:block;width:38px;height:5px;border-radius:3px;background:#D5D9E0;margin:0 auto 20px}@keyframes fd{from{background:rgba(17,19,24,0)}}@keyframes up{from{transform:translateY(100%)}}
.sheet .kv{cursor:pointer}
#app:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(420px 300px at 90% -4%,rgba(22,119,255,.18),transparent 70%),radial-gradient(380px 300px at -12% 38%,rgba(110,165,255,.16),transparent 70%),radial-gradient(420px 320px at 105% 82%,rgba(22,119,255,.12),transparent 70%)}
#view,nav{position:relative;z-index:1}
.hero{background:linear-gradient(160deg,rgba(255,255,255,.82) 30%,rgba(234,243,255,.62))}
.ib,.grp{background:rgba(255,255,255,.66);backdrop-filter:blur(18px) saturate(1.6);-webkit-backdrop-filter:blur(18px) saturate(1.6);border-color:rgba(255,255,255,.8);box-shadow:0 0 0 1px var(--ln),inset 0 1px 0 rgba(255,255,255,.9)}
.cam .ib{background:rgba(255,255,255,.14);box-shadow:none}
nav{background:rgba(255,255,255,.6);backdrop-filter:blur(28px) saturate(1.8);-webkit-backdrop-filter:blur(28px) saturate(1.8);border-top:1px solid rgba(255,255,255,.75);box-shadow:0 -1px 0 var(--ln)}
.sheet>div{background:rgba(247,248,250,.8);backdrop-filter:blur(32px) saturate(1.7);-webkit-backdrop-filter:blur(32px) saturate(1.7);border-top:1px solid rgba(255,255,255,.8)}
.toast{background:rgba(17,19,24,.78);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
/* ===== Liquid glass layer: translucent lit surfaces (flat approved background) ===== */

#app:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(520px 380px at 100% 0%,rgba(63,148,255,.42),transparent 70%),radial-gradient(460px 420px at -10% 42%,rgba(150,140,255,.34),transparent 70%),radial-gradient(480px 380px at 105% 100%,rgba(70,200,225,.34),transparent 70%),radial-gradient(360px 300px at 0% 100%,rgba(255,190,160,.26),transparent 70%)}
#app:after{content:"";position:absolute;inset:-40px;pointer-events:none;opacity:.85;background:radial-gradient(circle 74px at 80% 15%,#8CC4FF 0,#5AA8FF 78%,rgba(90,168,255,0) 100%),radial-gradient(circle 58px at 12% 40%,#BDB5FF 0,#A79DFF 78%,rgba(167,157,255,0) 100%),radial-gradient(circle 90px at 88% 62%,#7FDDEB 0,#5CCBDD 78%,rgba(92,203,221,0) 100%),radial-gradient(circle 66px at 18% 86%,#FFC9AE 0,#FFB48F 78%,rgba(255,180,143,0) 100%);animation:dr2 22s ease-in-out infinite alternate}
@keyframes dr2{to{transform:translate3d(-22px,34px,0) scale(1.06)}}
.card,.grp,.ib,.srch,.fi,.sec2,.seg,.sheet>div,nav,.toast{-webkit-backdrop-filter:blur(26px) saturate(1.9);backdrop-filter:blur(26px) saturate(1.9)}
.card,.grp{background:linear-gradient(145deg,rgba(255,255,255,.6),rgba(255,255,255,.28));border:1px solid rgba(255,255,255,.7);box-shadow:0 12px 32px rgba(30,70,160,.12),0 1px 2px rgba(30,70,160,.06),inset 0 1.5px 0 rgba(255,255,255,.95),inset 0 -1px 0 rgba(255,255,255,.35),inset 0 0 22px rgba(255,255,255,.22)}
.hero{background:linear-gradient(150deg,rgba(255,255,255,.7),rgba(180,214,255,.36))}
.idc{background:linear-gradient(140deg,rgba(60,150,255,.92),rgba(10,91,216,.95));border:1px solid rgba(255,255,255,.35);box-shadow:0 18px 40px rgba(22,119,255,.3),inset 0 1.5px 0 rgba(255,255,255,.55),inset 0 -1px 0 rgba(255,255,255,.12)}
.ib{background:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.75);box-shadow:0 4px 14px rgba(30,70,160,.1),inset 0 1px 0 rgba(255,255,255,.95)}
.sec2{background:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.75);box-shadow:0 6px 18px rgba(30,70,160,.08),inset 0 1px 0 rgba(255,255,255,.95)}
.pri{background:linear-gradient(180deg,#3F96FF,#1677FF 50%,#0F68EE);box-shadow:0 10px 24px rgba(22,119,255,.3),inset 0 1px 0 rgba(255,255,255,.45),inset 0 -1px 0 rgba(0,0,0,.08)}
.srch{background:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.75);box-shadow:inset 0 1px 0 rgba(255,255,255,.9)}
.fi{background:rgba(255,255,255,.5);border:1.5px solid rgba(255,255,255,.75)}
.seg{background:rgba(255,255,255,.4);border:1px solid rgba(255,255,255,.7)}.seg button.on{background:rgba(255,255,255,.92)}
nav{margin:0 14px calc(env(safe-area-inset-bottom,0px) + 10px);padding:6px;border-radius:30px;background:linear-gradient(145deg,rgba(255,255,255,.62),rgba(255,255,255,.34));border:1px solid rgba(255,255,255,.75);box-shadow:0 14px 34px rgba(30,70,160,.16),inset 0 1.5px 0 rgba(255,255,255,.95),inset 0 -1px 0 rgba(255,255,255,.3)}
nav button{border-radius:24px}nav button.on{background:rgba(255,255,255,.88);box-shadow:0 4px 12px rgba(30,70,160,.12),inset 0 1px 0 #fff}
.sheet>div{background:linear-gradient(160deg,rgba(255,255,255,.72),rgba(255,255,255,.46));border-top:1px solid rgba(255,255,255,.85);box-shadow:0 -10px 40px rgba(30,70,160,.14),inset 0 1.5px 0 #fff}
/* glass v3: content scrolls UNDER glass chrome, lit glass surfaces */
#view:has(+nav){padding-bottom:128px}
nav{position:absolute;left:0;right:0;bottom:0;z-index:4;background:linear-gradient(135deg,rgba(255,255,255,.7),rgba(255,255,255,.38));backdrop-filter:blur(30px) saturate(2);-webkit-backdrop-filter:blur(30px) saturate(2)}
.top{position:sticky;top:0;z-index:3;margin:calc(-18px - env(safe-area-inset-top,0px)) -22px 16px;padding:calc(18px + env(safe-area-inset-top,0px)) 22px 12px;background:rgba(247,248,250,.5);backdrop-filter:blur(26px) saturate(1.9);-webkit-backdrop-filter:blur(26px) saturate(1.9);box-shadow:0 1px 0 rgba(255,255,255,.7),0 8px 24px -12px rgba(30,70,160,.14)}
.card,.grp{background:linear-gradient(135deg,rgba(255,255,255,.9) 0%,rgba(255,255,255,.4) 48%,rgba(205,224,255,.55) 100%)}
.hero{background:linear-gradient(135deg,rgba(255,255,255,.92) 0%,rgba(255,255,255,.42) 45%,rgba(160,200,255,.6) 100%)}
/* ===== TokCred DARK + liquid glass v4 ===== */
:root{color-scheme:dark;--bg:#090B10;--s:#14171F;--s2:rgba(255,255,255,.07);--t:#F2F4F8;--t2:#9AA3B2;--t3:#6B7383;--b:#3B8CFF;--b2:#1F6FE8;--bs:rgba(59,140,255,.16);--g:#3DD68C;--gs:rgba(61,214,140,.14);--ln:rgba(255,255,255,.09);--sh:0 14px 36px rgba(0,0,0,.4)}
body{background:#050608}@media(min-width:520px){#app{box-shadow:0 30px 80px rgba(0,0,0,.65),0 0 0 8px #1B1E26}}
#app:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(520px 400px at 100% 0%,rgba(40,110,255,.34),transparent 70%),radial-gradient(460px 420px at -12% 55%,rgba(100,80,230,.24),transparent 70%),radial-gradient(480px 380px at 105% 100%,rgba(20,150,200,.2),transparent 70%)}
#app:after{content:"";position:absolute;inset:-40px;pointer-events:none;opacity:.6;background:radial-gradient(circle 72px at 80% 16%,rgba(90,160,255,.95) 0,rgba(45,115,255,.55) 70%,rgba(45,115,255,0) 100%),radial-gradient(circle 56px at 10% 42%,rgba(150,130,255,.9) 0,rgba(110,90,240,.5) 70%,rgba(110,90,240,0) 100%),radial-gradient(circle 88px at 90% 66%,rgba(70,200,230,.85) 0,rgba(30,160,200,.45) 70%,rgba(30,160,200,0) 100%);animation:dr2 22s ease-in-out infinite alternate}
.card,.grp{background:linear-gradient(145deg,rgba(255,255,255,.15),rgba(255,255,255,.05));border:1px solid rgba(255,255,255,.14);box-shadow:0 14px 36px rgba(0,0,0,.4),inset 0 1.5px 0 rgba(255,255,255,.3),inset 0 -1px 0 rgba(255,255,255,.04),inset 0 0 24px rgba(255,255,255,.04);-webkit-backdrop-filter:blur(28px) saturate(1.8);backdrop-filter:blur(28px) saturate(1.8)}
.card.qrc{background:#F7F9FC}
.hero{background:linear-gradient(145deg,rgba(255,255,255,.17),rgba(59,140,255,.24))}
.ib,.sec2{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);box-shadow:0 6px 18px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.3)}
.cam .ib{background:rgba(255,255,255,.14);box-shadow:none}
.srch,.fi{background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.12)}
.fi::placeholder,.srch input::placeholder{color:var(--t3)}
.fi:focus{background:rgba(255,255,255,.12);border-color:var(--b);box-shadow:0 0 0 4px rgba(59,140,255,.24)}
.fi.ok{background:rgba(61,214,140,.08);border-color:var(--g)}.fi.er{background:rgba(217,83,79,.1);border-color:#FF6B66;box-shadow:0 0 0 4px rgba(255,107,102,.18)}.hint.er{color:#FF8A84}
.seg{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1)}.seg button.on{background:rgba(255,255,255,.18);color:var(--t);box-shadow:inset 0 1px 0 rgba(255,255,255,.25)}
nav{background:linear-gradient(145deg,rgba(255,255,255,.17),rgba(255,255,255,.06));border:1px solid rgba(255,255,255,.16);box-shadow:0 16px 40px rgba(0,0,0,.55),inset 0 1.5px 0 rgba(255,255,255,.3)}
nav button{color:#8A93A3}nav button.on{background:rgba(59,140,255,.24);color:#7DB4FF;box-shadow:inset 0 1px 0 rgba(255,255,255,.25)}
.top{background:rgba(9,11,16,.5);box-shadow:0 1px 0 rgba(255,255,255,.08),0 8px 24px -12px rgba(0,0,0,.6)}
.sheet{background:rgba(0,0,0,.5)}.sheet>div{background:linear-gradient(160deg,rgba(46,50,64,.78),rgba(22,25,33,.72));border-top:1px solid rgba(255,255,255,.18);box-shadow:0 -10px 40px rgba(0,0,0,.5),inset 0 1.5px 0 rgba(255,255,255,.25)}.sheet em{background:rgba(255,255,255,.3)}
.toast{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.2);box-shadow:0 10px 30px rgba(0,0,0,.4)}
.av{background:linear-gradient(150deg,rgba(59,140,255,.4),rgba(59,140,255,.14));color:#A9CDFF;border:1px solid rgba(255,255,255,.14)}
.mono{color:#7DB4FF}.idc .mono{color:#fff}.idc .vb{color:#1F9D63}
.res.no{background:rgba(255,122,92,.14);color:#FF8A6A}.rsn i{background:#FF8A6A}
.pri{box-shadow:0 10px 26px rgba(22,119,255,.4),inset 0 1px 0 rgba(255,255,255,.45),inset 0 -1px 0 rgba(0,0,0,.12)}
.press{transition:transform .22s var(--ease),border-color .22s,background .22s}.card.press:active{border-color:rgba(255,255,255,.3);background:linear-gradient(145deg,rgba(255,255,255,.2),rgba(255,255,255,.08))}
.scr .card:not(.rise){animation:mat .55s var(--ease) backwards}.cc+.cc{animation-delay:.07s!important}.cc+.cc+.cc{animation-delay:.14s!important}
@keyframes mat{from{transform:scale(.965) translateY(8px);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}}
button:focus-visible,.press:focus-visible,input:focus-visible{outline:2px solid var(--b);outline-offset:2px}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01s!important;transition-duration:.01s!important}}
```

## B3. Body markup

```html
</head><body><div id="app"><div id="view"></div><div class="toast" id="toast"></div></div>
```

## B4. JavaScript (inside `<script>`)

```js
const P={home:'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',cards:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 10h6M7 14h4"/>',shield:'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',qr:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h3M20 17v4"/>',share:'M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7',chev:'M9 6l6 6-6 6',back:'M15 6l-6 6 6 6',check:'M5 12.5l4.5 4.5L19 7.5',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',bolt:'M13 3L5 14h6l-1 7 8-11h-6z',copy:'<rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',bell:'M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4',lock:'<rect x="5" y="11" width="14" height="10" rx="3"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',doc:'M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM14 3v5h5',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',x:'M6 6l12 12M18 6L6 18',alert:'M12 7v6M12 17v.01',key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l3 3"/>',refresh:'M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5'};
const I=n=>`<svg class="i" viewBox="0 0 24 24">${P[n].startsWith('<')?P[n]:`<path d="${P[n]}"/>`}</svg>`;
const C=[{d:'Bachelor of Technology',p:'Computer Science & Engineering',u:'Presidency University',m:'PU',y:'2026',s:'2023 — 2027',id:'TC-2026-48X7QA',studentName:'Abrar',grade:'8.7 CGPA',tokenId:'TC-TOKEN-829341',explorerUrl:'https://example.com/explorer/token/TC-TOKEN-829341',status:'Verified'},{d:'Minor in Artificial Intelligence',p:'Applied Machine Learning',u:'Presidency University',m:'PU',y:'2026',s:'2024 — 2026',id:'TC-2026-9KD2LM',studentName:'Abrar',grade:'A Grade (9.1 GPA)',tokenId:'TC-TOKEN-514072',explorerUrl:'https://example.com/explorer/token/TC-TOKEN-514072',status:'Verified'},{d:'Senior Secondary Certificate',p:'Science Stream',u:'Bengaluru Central School',m:'BC',y:'2023',s:'2021 — 2023',id:'TC-2023-5TR8WB',studentName:'Abrar',grade:'91.4%',tokenId:'TC-TOKEN-367815',explorerUrl:'https://example.com/explorer/token/TC-TOKEN-367815',status:'Verified'}];
const $=s=>document.querySelector(s),V=$('#view');
const store={get:()=>{try{return localStorage.getItem('tc-role')}catch(e){return null}},set:v=>{try{localStorage.setItem('tc-role',v)}catch(e){}}};const sr=store.get();
let S={role:sr==='verifier'?'verifier':'student',scr:!sr?'role':sr==='verifier'?'vhome':'home',cur:0,q:'',code:'',res:'ok',st:''},hist=[];
const VB=t=>`<span class="vb">${I('check')}${t||'Verified'}</span>`;
const logo=`<div class="logo"><div class="lm">${I('shield')}</div>TokCred</div>`;
const bar=(t)=>`<div class="top"><div class="ib press" data-back>${I('back')}</div><b style="font-weight:600;font-size:16px">${t||''}</b><div style="width:40px"></div></div>`;
const kv=(a,b)=>`<div class="kv"><span>${a}</span><span>${b}</span></div>`;
const cred=(c,i)=>`<div class="card cc press" tabindex="0" data-go="detail" data-i="${i}"><div class="mono">${c.m}</div><div class="x"><b>${c.d}</b><div class="meta">${c.p}</div><div class="meta">${c.u} · ${c.y}</div></div><div class="r">${I('chev')}${VB()}</div></div>`;
const qrSvg=seed=>{let h=0;for(const c of seed)h=(h*31+c.charCodeAt(0))>>>0;const r=()=>(h=(h*1664525+1013904223)>>>0)/4294967296;let d='';for(let y=0;y<25;y++)for(let x=0;x<25;x++){if((x<8&&y<8)||(x>16&&y<8)||(x<8&&y>16))continue;if(r()>.5)d+=`M${x} ${y}h1v1h-1z`}[[0,0],[18,0],[0,18]].forEach(([a,b])=>d+=`M${a} ${b}h7v7h-7zM${a+1} ${b+1}v5h5v-5zM${a+2} ${b+2}h3v3h-3z`);return `<svg viewBox="-1 -1 27 27"><path fill="#111318" fill-rule="evenodd" d="${d}"/></svg>`};
const stu=S=>S.role==='student';
const tabs=()=>stu(S)?[['home','Home','home'],['creds','Credentials','cards'],['vhome','Verify','shield'],['profile','Profile','user']]:[['vhome','Home','home'],['scan','Scan','qr'],['manual','Verify','shield'],['profile','Profile','user']];
const screens={role:()=>`<div class="top">${logo}<div style="width:38px"></div></div><h1>Welcome to TokCred</h1><p class="sub">Choose how you'll use the app.</p><div class="stack" style="margin-top:28px;gap:14px"><div class="card big press" tabindex="0" data-pick="student"><div class="mono" style="width:56px;height:56px;border-radius:17px;background:var(--b);color:#fff">${I('cards')}</div><h2 style="margin-top:20px">Student</h2><p class="sub">View and share your academic credentials</p></div><div class="card big press" tabindex="0" data-pick="verifier"><div class="mono" style="width:56px;height:56px;border-radius:17px;background:var(--b);color:#fff">${I('shield')}</div><h2 style="margin-top:20px">Verifier</h2><p class="sub">Verify a student's academic credential</p></div></div>`,
home:()=>`<div class="top">${logo}<div class="av">A</div></div><h1>Good morning, Abrar</h1><p class="sub">Your academic credentials, all in one place.</p>
<div class="card hero press" style="margin-top:28px" data-go="creds"><div class="sd">${I('shield')}</div><div class="meta" style="font-size:15px">Verified Credentials</div><div class="n">3</div><div class="meta">All credentials are securely verified</div></div>
<div class="sec"><div class="sh"><h2>My Credentials</h2><a data-go="creds">See all</a></div>${C.slice(0,2).map(cred).join('')}</div>
<div class="sec"><div class="sh"><h2>Quick Actions</h2></div><div class="qa"><div class="card press" tabindex="0" data-go="creds"><div class="ic">${I('cards')}</div>View</div><div class="card press" tabindex="0" data-go="qr" data-i="0"><div class="ic">${I('qr')}</div>Show QR</div><div class="card press" tabindex="0" data-act="share"><div class="ic">${I('share')}</div>Share</div></div></div>`,
creds:()=>{const l=C.map((c,i)=>[c,i]).filter(([c])=>(c.d+c.u+c.p).toLowerCase().includes(S.q.toLowerCase()));return `<div class="top">${logo}<div class="av">A</div></div><h1>My Credentials</h1><p class="sub">Your verified academic achievements</p><div class="srch">${I('search')}<input id="q" placeholder="Search credentials" value="${S.q}" aria-label="Search credentials"></div><div style="margin-top:22px" id="cl">${l.length?l.map(([c,i])=>`<div class="card cc press" style="padding:20px 18px" tabindex="0" data-go="detail" data-i="${i}"><div class="mono">${c.m}</div><div class="x"><b>${c.d}</b><div class="meta">${c.p}</div><div class="meta">${c.u}</div><div class="meta" style="color:var(--t3)">${c.s}</div></div><div class="r">${I('chev')}${VB()}</div></div>`).join(''):`<div class="emp"><div class="ic">${I('cards')}</div><h2>No credentials yet</h2><p class="sub" style="margin:0">Your verified academic credentials will appear here.</p><button class="btn sec2" data-act="clr">Refresh</button></div>`}</div>`},
detail:()=>{const c=C[S.cur];return bar('Credential Details')+`<div class="idc"><div class="row"><div class="mono">${c.m}</div>${VB()}</div><h2>${c.d}</h2><p>${c.p}</p><p>${c.u}</p><div class="ft"><div>Abrar<br><span style="opacity:.75">Issued ${c.y}</span></div><div style="text-align:right;font-variant-numeric:tabular-nums">${c.id}</div></div></div>
<div class="sec" style="margin-top:32px"><h2 style="margin-bottom:6px">Credential Information</h2>${kv('Degree',c.d)}${kv('Program',c.p)}${kv('Institution',c.u)}${kv('Issue Date',c.y)}${kv('Credential ID',c.id)}</div>
<div class="stack"><button class="btn pri" data-go="qr" data-i="${S.cur}">${I('qr')}Show QR</button><button class="btn sec2" data-act="share">${I('share')}Share Credential</button><button class="btn sec2" data-act="selfv">${I('shield')}Verify Credential</button></div>`},
qr:()=>{const c=C[S.cur];return bar('Share Credential')+`<p class="sub" style="text-align:center;margin:-6px 0 0">Scan this QR code to verify your credential.</p><div class="card qrc">${qrSvg(c.id)}</div><div class="ctr" style="margin-top:26px;gap:4px"><b style="font-size:17px;font-weight:600">${c.d}</b><span class="meta">${c.u}</span><div style="margin-top:10px">${VB()}</div></div><div class="stack"><button class="btn pri" data-act="share">${I('share')}Share Credential</button><button class="btn sec2" data-act="copy">${I('copy')}Copy Verification Code</button></div>`},
vhome:()=>`<div class="top">${logo}<div class="av">${stu(S)?'A':'V'}</div></div><h1>Verify a Credential</h1><p class="sub">Confirm the authenticity of an academic credential in seconds.</p>
<div class="card big press" style="margin-top:28px;border-radius:30px;background:linear-gradient(145deg,rgba(255,255,255,.16),rgba(59,140,255,.24))" data-go="scan"><div class="mono" style="width:56px;height:56px;border-radius:17px;background:var(--b);color:#fff">${I('qr')}</div><h2 style="margin-top:20px">Scan QR Code</h2><p class="sub" style="margin-bottom:22px">Scan the credential's QR code</p><button class="btn pri">Scan QR</button></div>
<div class="sec"><h2>Enter Verification Code</h2><input class="fi" id="vc" style="margin:14px 0 12px" placeholder="Enter credential code" aria-label="Credential code" autocapitalize="characters"><button class="btn sec2" data-act="vcode">Verify</button></div>`,
manual:()=>bar('')+`<h1>Enter Verification Code</h1><p class="sub">Enter the credential code provided by the student.</p><input class="fi ${S.st}" id="mc" style="margin-top:28px" placeholder="TC-2026-XXXXXX" value="${S.code}" aria-label="Verification code" autocapitalize="characters"><div class="hint ${S.st==='er'?'er':''}" id="mh">${S.st==='er'?'Check the code format: TC-YYYY-XXXXXX':'Codes start with TC and include the year.'}</div><div class="stack"><button class="btn pri" data-act="mver">Verify Credential</button></div>`,
scan:()=>`<div class="cam"><div class="row"><div class="ib press" data-back>${I('back')}</div><div class="ib press" data-act="flash">${I('bolt')}</div></div><div class="ctr" style="margin-top:22px"><h2 style="font-size:22px">Scan Credential QR</h2><p style="opacity:.7;font-size:15px;margin-top:8px">Position the QR code inside the frame.</p></div><div class="fr"><b class="a"></b><b class="b2"></b><b class="c"></b><b class="d"></b><u></u></div><button class="btn" style="background:rgba(255,255,255,.14);color:#fff;backdrop-filter:blur(12px)" data-act="simscan">Simulate scan</button></div>`,
load:()=>`<div class="ld"><div class="rg"><i></i><i></i><i></i><div class="sd">${I('shield')}</div></div><h2>Checking credential…</h2><p class="sub" style="margin:0 0 20px">This only takes a moment.</p><div class="stp" id="s1">${I('check')}Reading credential</div><div class="stp" id="s2">${I('check')}Confirming issuer</div><div class="stp" id="s3">${I('check')}Matching signature</div></div>`,
ok:()=>{const c=C[S.cur];return `<div class="ctr" style="padding-top:20px"><div class="res ok"><svg class="i" viewBox="0 0 24 24"><path d="${P.check}"/></svg></div><h1>Credential Verified</h1><p class="sub" style="max-width:290px">This credential is authentic and has been successfully verified.</p></div>
<div class="rise"><div class="card cc" style="margin-top:28px"><div class="mono">${c.m}</div><div class="x"><b>${c.d}</b><div class="meta">${c.p}</div><div class="meta">${c.u} · Abrar</div></div>${VB('Authentic')}</div>
<div class="card" style="padding:22px;margin-top:26px"><div class="meta">Student</div><div style="font-size:26px;font-weight:600;letter-spacing:-.03em;margin-top:6px;line-height:1.15">${c.studentName}</div><div class="meta" style="font-size:15px;margin-top:5px">${c.p}</div><div style="height:1px;background:var(--ln);margin:20px 0"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:22px 16px">${[['Degree',c.d],['Grade / CGPA',c.grade],['Institution',c.u],['Issue date',c.y]].map(([a,b])=>`<div style="min-width:0"><div class="meta" style="font-size:12px">${a}</div><div style="font-size:15px;font-weight:500;margin-top:5px;line-height:1.35">${b}</div></div>`).join('')}</div></div><div style="margin-top:26px"><h2 style="margin-bottom:4px">Verification Details</h2>${kv('Credential ID',c.id)}${kv('Issuer',c.u)}${kv('Issued Date',c.y)}${kv('Verification Status','Authentic')}</div><div class="card" style="padding:18px 20px;margin-top:26px"><h2>Ledger Proof</h2>${kv('Token ID',c.tokenId)}<div style="padding-top:14px;border-top:1px solid var(--ln)"><a class="lk" href="${c.explorerUrl}" target="_blank" rel="noopener">View on Explorer →</a></div></div>
<div class="stack"><button class="btn sec2" data-act="sharev">${I('share')}Share Verification</button><button class="btn pri" data-go="detail" data-i="${S.cur}">View Credential</button><button class="btn sec2" data-go="vhome">Verify Another</button></div></div>`},
no:()=>`<div class="ctr" style="padding-top:20px"><div class="res no"><svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="1.6"/><path d="${P.alert}"/></svg></div><h1>Credential Could Not Be Verified</h1><p class="sub">We couldn't confirm this credential.</p></div><div class="card rise" style="margin-top:28px;padding:8px 20px"><div class="rsn"><i></i>Credential does not exist</div><div class="rsn"><i></i>Credential has been revoked</div><div class="rsn"><i></i>Credential information has changed</div></div><div class="stack rise"><button class="btn pri" data-act="retry">Try Again</button><button class="btn sec2" data-go="manual" data-reset>Enter Another Code</button></div>`,
profile:()=>{const r=(i,t)=>`<div class="kv press"><span>${I(i)}${t}</span><span>${I('chev')}</span></div>`;return `<div class="ctr" style="padding-top:12px"><div class="av l">A</div><h1 style="font-size:26px;margin-top:16px">Abrar</h1><p class="sub" style="margin-top:4px">${stu(S)?'Student':'Verifier'}</p></div>
<div class="seg" role="tablist"><button class="${stu(S)?'on':''}" data-role="student">Student</button><button class="${stu(S)?'':'on'}" data-role="verifier">Verifier</button></div>
<div class="gh">Account</div><div class="grp">${r('user','Personal Information')}${r('lock','Security')}</div><div class="gh">Preferences</div><div class="grp">${r('bell','Notifications')}${r('sun','Appearance')}</div><div class="gh">About</div><div class="grp">${r('info','About TokCred')}${r('doc','Privacy Policy')}${r('doc','Terms')}</div>`}
};
const TAB=['home','creds','vhome','manual','profile'];
function go(n,back){hist.push(S.scr);S.scr=n;draw(back)}
function draw(back){const nav=TAB.includes(S.scr)||(S.scr==='scan'&&0);const tb=tabs();const on=({home:'home',creds:'creds',vhome:stu(S)?'vhome':'home',manual:stu(S)?'vhome':'manual',profile:'profile',scan:'scan'})[S.scr];
V.parentElement.classList.toggle('back',!!back);V.innerHTML=`<div class="scr" style="${S.scr==='load'?'height:100%':''}">${screens[S.scr]()}</div>`;V.scrollTop=0;
let n=$('nav');if(n)n.remove();if(nav){V.insertAdjacentHTML('afterend',`<nav>${tb.map(([k,l,i])=>`<button class="${(k===S.scr||k===on&&S.scr!=='scan')?'on':''}" data-go="${k}" data-tab>${I(i)}${l}</button>`).join('')}</nav>`)}
if(S.scr==='scan'){S.t=setTimeout(()=>{if(S.scr==='scan')verify(0)},6000)}}
function verify(i,fail){clearTimeout(S.t);S.cur=i;S.res=fail?'no':'ok';hist.push(S.scr);S.scr='load';draw();[1,2,3].forEach(k=>setTimeout(()=>{const e=$('#s'+k);e&&e.classList.add('on')},k*450));setTimeout(()=>{if(S.scr==='load'){S.scr=S.res;draw()}},1900)}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('on'),1800)}
function shareV(){const c=C[S.cur];const tx=`TokCred Credential Verification\n\nCredential:\n${c.d}\n\nStudent:\n${c.studentName}\n\nInstitution:\n${c.u}\n\nGrade:\n${c.grade}\n\nStatus:\n${c.status}\n\nCredential ID:\n${c.id}\n\nVerification:\nAuthentic`;if(navigator.share){navigator.share({title:'TokCred Credential Verification',text:tx}).catch(()=>{})}else{try{navigator.clipboard.writeText(tx).then(()=>toast('Verification copied'),()=>toast('Sharing unavailable'))}catch(e){toast('Sharing unavailable')}}}
const okc=v=>/^TC-\d{4}-[A-Z0-9]{6}$/.test(v);
function sheet(){const a=$('#app');a.insertAdjacentHTML('beforeend',`<div class="sheet" data-close><div><em></em><h2 style="margin-bottom:6px">Share Credential</h2>${['Copy link','Send via Messages','Save as PDF'].map(t=>`<div class="kv press" data-close data-t="${t}"><span>${t}</span></div>`).join('')}</div></div>`)}
document.addEventListener('click',e=>{const t=e.target;
const cl=t.closest('[data-close]');if(cl&&(t.closest('.sheet>div')==null||cl.dataset.t)){if(cl.dataset.t)toast(cl.dataset.t==='Copy link'?'Link copied':'Done');$('.sheet')?.remove();return}
if(t.closest('[data-back]')){clearTimeout(S.t);S.scr=hist.pop()||'home';draw(1);return}
const pk=t.closest('[data-pick]');if(pk){S.role=pk.dataset.pick;store.set(S.role);hist=[];S.scr=S.role==='student'?'home':'vhome';draw();return}
const r=t.closest('[data-role]');if(r){S.role=r.dataset.role;store.set(S.role);draw();return}
const a=t.closest('[data-act]');if(a){const k=a.dataset.act;
if(k==='share')sheet();else if(k==='sharev')shareV();else if(k==='copy')toast('Code '+C[S.cur].id+' copied');else if(k==='flash')toast('Flash unavailable in preview');else if(k==='clr'){S.q='';draw()}
else if(k==='simscan')verify(0);else if(k==='selfv')verify(S.cur);else if(k==='retry'){verify(S.cur,0)}
else if(k==='vcode'){const v=$('#vc').value.trim().toUpperCase();if(!okc(v)){S.code=v;S.st=v?'er':'';go('manual')}else{S.code=v;const ix=C.findIndex(c=>c.id===v);verify(ix<0?0:ix,/000000/.test(v))}}
else if(k==='mver'){const v=$('#mc').value.trim().toUpperCase();S.code=v;if(!okc(v)){S.st='er';draw();return}S.st='ok';$('#mc').className='fi ok';verify(C.findIndex(c=>c.id===v)<0?0:C.findIndex(c=>c.id===v),/000000/.test(v))}return}
const g=t.closest('[data-go]');if(g){if(g.dataset.i!==undefined)S.cur=+g.dataset.i;if(g.hasAttribute('data-reset')){S.code='';S.st=''}
if(g.hasAttribute('data-tab')){hist=[];S.scr=g.dataset.go;draw()}else go(g.dataset.go)}});
document.addEventListener('input',e=>{if(e.target.id==='q'){S.q=e.target.value;const p=e.target.selectionStart;draw();const q=$('#q');q.focus();q.setSelectionRange(p,p)}
if(e.target.id==='mc'){const v=e.target.value.toUpperCase();S.code=v;S.st=v?'ok'.repeat(okc(v)):'';e.target.className='fi '+S.st;e.target.value=v}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList.contains('press'))e.target.click()});
draw();
```

## B5. Final assembly check

- The file starts with `<!DOCTYPE html>` and ends with `</script></body></html>`.
- The head has the viewport meta tag with `viewport-fit=cover` and the Inter font link.
- `<body>` contains `<div id="app"><div id="view"></div><div class="toast" id="toast"></div></div>`.
- The app is dark: near-black background, glowing backdrop, frosted glass cards, floating glass nav bar.
- With no saved role, the Role Selection screen shows. Choosing a role saves `tc-role` and opens Student Home or Verifier Home.
- Test codes: `TC-2026-48X7QA` shows success; a code containing `000000` shows failure; a malformed code shows the input error.
- Scroll a long screen: content must blur under the floating nav bar and the pinned top bar.
