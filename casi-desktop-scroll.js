/* CASI desktop scroll enhancement. No dependencies.
   Install in <helmet>: <script src="./casi-desktop-scroll.js" defer></script>
   Home screen only. Boundaries come from main[data-screen-label="Home"] > [data-scroll-section].
   Every other screen scrolls natively.
   Mouse/trackpad only, >=1024px, no touch-capable devices, no reduced motion.
   Existing section reveals/parallax keep receiving normal scroll events.
   Tune options below. No snap, fixed section heights, or touch interception.
   Opt out a nested widget with data-native-scroll.
   Remove at runtime with window.CASIDesktopScroll.destroy(). */
(() => {
  'use strict';
  if (window.CASIDesktopScroll) return;
  const HOME = 'main[data-screen-label="Home"]';
  const options = { wheelScale: 0.95, boundaryScale: 0.80, boundaryZone: 120,
    easingMs: 130, maxPendingViewports: 0.8 };
  const media = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const coarse = matchMedia('(any-pointer: coarse)');
  let enabled = false, touched = false, frame = 0, target = 0, lastWritten = 0,
    previousTime = 0, lastDirection = 0, points = [], observer;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const onHome = () => !!document.querySelector(HOME);
  function cancel() {
    cancelAnimationFrame(frame); frame = 0; previousTime = 0;
    target = lastWritten = scrollY;
  }
  function measure() {
    if (!enabled) return;
    // Four slowdown points: the header, risks, mission and cta wrappers.
    points = [...document.querySelectorAll(HOME + ' > [data-scroll-section]')]
      .filter(el => el.getClientRects().length)
      .map(el => el.getBoundingClientRect().top + scrollY - 80)
      .sort((a,b) => a-b);
  }
  function nativeTarget(event) {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
        Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return true;
    for (const el of event.composedPath()) {
      if (!(el instanceof Element) || el === document.body || el === document.documentElement) continue;
      if (el.matches('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[data-native-scroll],[data-lenis-prevent],dialog,[role="dialog"],[role="menu"]')) return true;
      if (/(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1) return true;
    }
    return [document.body,document.documentElement].some(el => /hidden|clip/.test(getComputedStyle(el).overflowY));
  }
  function tick(time) {
    // Native keys, scrollbar dragging, links and router scroll resets take priority.
    if (Math.abs(scrollY - lastWritten) > 3) { cancel(); return; }
    const dt = previousTime ? Math.min(64, time - previousTime) : 16.67;
    previousTime = time;
    target = clamp(target, 0, maxScroll());
    const distance = target - scrollY;
    const next = Math.abs(distance) < 0.75 ? target : scrollY + distance * (1 - Math.exp(-dt / options.easingMs));
    window.scrollTo({ top: next, left: scrollX, behavior: 'instant' });
    lastWritten = scrollY;
    if (Math.abs(target - scrollY) < 0.75) { frame = 0; previousTime = 0; return; }
    frame = requestAnimationFrame(tick);
  }
  function wheel(event) {
    // About, Team, Events, Blog and the rest keep the browser's own scrolling.
    if (!onHome()) { cancel(); return; }
    if (!enabled || !event.cancelable || event.defaultPrevented || nativeTarget(event)) { cancel(); return; }
    let delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    if (!delta) return;
    const direction = Math.sign(delta);
    if (!frame || direction !== lastDirection || Math.abs(scrollY-lastWritten)>3) { cancel(); measure(); }
    lastDirection = direction;
    if ((scrollY <= 0 && direction < 0) || (scrollY >= maxScroll()-1 && direction > 0)) { cancel(); return; }
    const nearby = points.some(p => Math.abs(p-scrollY) < options.boundaryZone);
    delta *= options.wheelScale * (nearby ? options.boundaryScale : 1);
    const limit = innerHeight * options.maxPendingViewports;
    target = clamp(clamp(target + delta, scrollY-limit, scrollY+limit), 0, maxScroll());
    event.preventDefault();
    if (!frame) frame = requestAnimationFrame(tick);
  }
  function reconcile() {
    const next = media.matches && !coarse.matches && !navigator.maxTouchPoints && !touched;
    if (next === enabled) return;
    enabled = next; cancel();
    if (enabled) {
      window.addEventListener('wheel', wheel, { passive: false });
      measure();
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => { cancel(); measure(); });
        observer.observe(document.body);
      }
    } else {
      window.removeEventListener('wheel', wheel);
      observer?.disconnect(); observer = null; points = [];
    }
  }
  function touch() { touched = true; reconcile(); }
  function resize() { cancel(); reconcile(); measure(); }
  function key(event) { if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' ','Escape'].includes(event.key)) cancel(); }
  function route() { cancel(); requestAnimationFrame(measure); }
  function visible() { if (document.hidden) cancel(); }
  function destroy() {
    cancel(); enabled = false; observer?.disconnect();
    window.removeEventListener('wheel',wheel);
    window.removeEventListener('resize',resize);
    window.removeEventListener('keydown',key,true);
    window.removeEventListener('pointerdown',cancel,true);
    window.removeEventListener('touchstart',touch,true);
    window.removeEventListener('hashchange',route);
    window.removeEventListener('popstate',route);
    document.removeEventListener('click',route,true);
    document.removeEventListener('visibilitychange',visible);
    document.removeEventListener('DOMContentLoaded',reconcile);
    media.removeEventListener('change',reconcile); coarse.removeEventListener('change',reconcile);
    delete window.CASIDesktopScroll;
  }
  window.CASIDesktopScroll = { destroy, refresh: measure, options, get enabled() { return enabled; } };
  media.addEventListener('change',reconcile); coarse.addEventListener('change',reconcile);
  window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('keydown',key,true);
  window.addEventListener('pointerdown',cancel,{capture:true,passive:true});
  window.addEventListener('touchstart',touch,{capture:true,passive:true});
  window.addEventListener('hashchange',route); window.addEventListener('popstate',route);
  document.addEventListener('click',route,true);
  document.addEventListener('visibilitychange',visible);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',reconcile,{once:true});
  else reconcile();
})();
