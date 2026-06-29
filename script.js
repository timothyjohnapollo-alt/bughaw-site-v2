const hdr = document.getElementById('hdr');
addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 40));
document.getElementById('burger').onclick = () => hdr.classList.toggle('open');
document.querySelectorAll('.navlinks a').forEach(a => a.onclick = () => hdr.classList.remove('open'));
const io = new IntersectionObserver((es) => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    io.unobserve(e.target)
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
document.querySelectorAll('.q-item button').forEach(b => b.onclick = () => {
  const it = b.parentElement,
    ans = it.querySelector('.ans'),
    open = it.classList.contains('open');
  document.querySelectorAll('.q-item').forEach(x => {
    x.classList.remove('open');
    x.querySelector('.ans').style.maxHeight = null
  });
  if (!open) {
    it.classList.add('open');
    ans.style.maxHeight = ans.scrollHeight + 'px'
  }
});