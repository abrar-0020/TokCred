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
