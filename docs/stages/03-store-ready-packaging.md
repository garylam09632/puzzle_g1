# Stage 03 — Store-ready packaging

**Phase:** 3  
**Status:** `not_started`  
**Goal:** Same web game runs in Capacitor; TestFlight + Play internal tracks viable; offline cold start works.  
**Depends on:** Stage 02 playable loop (or Stage 01+ if intentionally packaging earlier)  
**Parent plan:** [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) · [`../PROGRESS.md`](../PROGRESS.md)

---

## Exit criteria

- [ ] Capacitor iOS + Android projects sync from static `out/` (root-path native build)
- [ ] Icons, splash, safe areas, status bar acceptable
- [ ] Core play works offline on device
- [ ] Gesture QA passes under WebViews
- [ ] Privacy / Data safety answers drafted
- [ ] Store listing assets drafted under final app name
- [ ] Internal test builds distributed (TestFlight + Play internal)

---

## Checklist

### Native wrapper

- [ ] Capacitor bootstrap (`ios/`, `android/`)
- [ ] Native build flavor without GitHub Pages `basePath`
- [ ] Sync pipeline documented (build → sync → run)
- [ ] Splash + app icons
- [ ] Status bar + safe areas
- [ ] Haptics plugin wired (if used)
- [ ] Overscroll / bounce does not break drag & two-finger twist

### Offline & privacy

- [ ] All play assets bundled; no network required for classic/daily core
- [ ] Privacy nutrition / Data safety draft
- [ ] Analytics only with consent (or none for v1)

### QA & store

- [ ] Device matrix smoke (small/large phones)
- [ ] Safari/Chrome + iOS/Android WebView gesture checklist
- [ ] Screenshots, subtitle, keywords, age rating, support URL
- [ ] TestFlight build uploaded
- [ ] Play internal AAB uploaded

### Explicit non-goals for this stage

- [ ] Seasonal events / large meta systems (Stage 04)
- [ ] Production store release can be a separate go/no-go after internal testing

---

## Progress notes

| Date | Note |
| --- | --- |
| | |
