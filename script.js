const hdr = document.getElementById('hdr');
addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 40));
document.getElementById('burger').onclick = () => hdr.classList.toggle('open');
document.querySelectorAll('.navlinks a').forEach(a => a.onclick = () => hdr.classList.remove('open'));

const io = new IntersectionObserver((es) => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    io.unobserve(e.target);
  }
}), {
  threshold: .12
});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.getElementById('filters').addEventListener('click', e => {
  if (!e.target.classList.contains('chip')) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  const f = e.target.dataset.f;
  document.querySelectorAll('#masonry figure').forEach(fig => {
    fig.classList.toggle('hide', f !== 'all' && fig.dataset.cat !== f);
  });
});

const vcViewport = document.getElementById('vcViewport');
if (vcViewport) {
  const track = document.getElementById('vcTrack'),
    slides = [...track.querySelectorAll('.v-slide')],
    vTitle = document.getElementById('videoTitle'),
    dotsWrap = document.getElementById('vcDots'),
    prevBtn = document.getElementById('vcPrev'),
    nextBtn = document.getElementById('vcNext');

  let index = 0;

  // Build each slide: the <video> itself is the thumbnail, frozen ~1s in.
  // Clicking the play button restarts it from 0 with sound + controls.
  slides.forEach((slide) => {
    const vid = document.createElement('video');
    vid.src = slide.dataset.src;
    vid.muted = true;            // required so we can seek/preview without user gesture
    vid.playsInline = true;
    vid.preload = 'metadata';    // load just enough to grab a frame
    vid.setAttribute('aria-label', slide.dataset.title || 'Camp Bughaw video');
    slide.appendChild(vid);

    // Seek ~1s in for the thumbnail (avoids a black opening frame).
    const seekToPreview = () => {
      const t = Math.min(1, (vid.duration || 1) - 0.05);
      try { vid.currentTime = t > 0 ? t : 0.01; } catch (e) {}
    };
    vid.addEventListener('loadedmetadata', seekToPreview, { once: true });
    // Fallback for browsers that need more data before seeking works.
    vid.addEventListener('canplay', () => {
      if (vid.currentTime === 0) seekToPreview();
    }, { once: true });

    const poster = document.createElement('div');
    poster.className = 'v-poster';
    slide.appendChild(poster);

    poster.addEventListener('click', () => {
      poster.classList.add('gone');
      vid.muted = false;
      vid.controls = true;
      vid.currentTime = 0;
      vid.play().catch(() => {});
    });
  });

  // Dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.setAttribute('aria-label', 'Go to video ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });
  const dots = [...dotsWrap.children];

  function pauseAll() {
    slides.forEach(s => {
      const v = s.querySelector('video');
      if (v) {
        v.pause();
        v.muted = true;
        v.controls = false;
        const t = Math.min(1, (v.duration || 1) - 0.05);
        try { v.currentTime = t > 0 ? t : 0.01; } catch (e) {}
      }
      const p = s.querySelector('.v-poster');
      if (p) p.classList.remove('gone');
    });
  }

  function render() {
    track.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    vTitle.classList.add('swapping');
    setTimeout(() => {
      vTitle.textContent = slides[index].dataset.title;
      vTitle.classList.remove('swapping');
    }, 200);
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    pauseAll();
    render();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  // Swipe / drag
  let startX = 0, curX = 0, dragging = false, moved = false;

  function onDown(x) {
    dragging = true;
    moved = false;
    startX = curX = x;
    track.classList.add('no-anim');
    vcViewport.classList.add('dragging');
  }
  function onMove(x) {
    if (!dragging) return;
    curX = x;
    if (Math.abs(curX - startX) > 6) moved = true;
    const pct = (curX - startX) / vcViewport.offsetWidth * 100;
    track.style.transform = `translateX(${-index * 100 + pct}%)`;
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('no-anim');
    vcViewport.classList.remove('dragging');
    const delta = curX - startX;
    const threshold = vcViewport.offsetWidth * 0.18;
    if (delta < -threshold) goTo(index + 1);
    else if (delta > threshold) goTo(index - 1);
    else render();
  }

  // Touch
  vcViewport.addEventListener('touchstart', e => onDown(e.touches[0].clientX), { passive: true });
  vcViewport.addEventListener('touchmove', e => onMove(e.touches[0].clientX), { passive: true });
  vcViewport.addEventListener('touchend', onUp);

  // Mouse
  vcViewport.addEventListener('mousedown', e => { e.preventDefault(); onDown(e.clientX); });
  addEventListener('mousemove', e => onMove(e.clientX));
  addEventListener('mouseup', onUp);

  // Don't let a drag trigger the poster play-click
  vcViewport.addEventListener('click', e => {
    if (moved) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  // Keyboard
  addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  render();
}

document.querySelectorAll('.q-item button').forEach(b => b.onclick = () => {
  const it = b.parentElement,
    ans = it.querySelector('.ans'),
    open = it.classList.contains('open');
  document.querySelectorAll('.q-item').forEach(x => {
    x.classList.remove('open');
    x.querySelector('.ans').style.maxHeight = null;
  });
  if (!open) {
    it.classList.add('open');
    ans.style.maxHeight = ans.scrollHeight + 'px';
  }
});