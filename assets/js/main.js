// IRONPULSE GYM interactions
document.addEventListener('DOMContentLoaded', () => {
  // mobile nav
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.nav-links');
  if (burger) burger.addEventListener('click', () => links.classList.toggle('open'));

  // typewriter
  const tw = document.querySelector('.tw');
  if (tw) {
    const words = ['Build Real Strength.', 'Stay Consistent.', 'Earn Your Results.'];
    let wi = 0, ci = 0, del = false;
    (function type() {
      const w = words[wi];
      tw.textContent = w.slice(0, ci);
      if (!del && ci < w.length) { ci++; setTimeout(type, 70); }
      else if (!del) { del = true; setTimeout(type, 1600); }
      else if (ci > 0) { ci--; setTimeout(type, 34); }
      else { del = false; wi = (wi + 1) % words.length; setTimeout(type, 300); }
    })();
  }

  // reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -60px 0px', threshold: .08 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  setTimeout(() => document.querySelectorAll('.rv').forEach(el => el.classList.add('in')), 4000);

  // counters
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.n, suf = el.dataset.s || '';
    let v = 0; const step = Math.max(1, Math.round(end / 60));
    const t = setInterval(() => { v += step; if (v >= end) { v = end; clearInterval(t); } el.textContent = v.toLocaleString('en-IN') + suf; }, 28);
    co.unobserve(el);
  }), { threshold: .4 });
  document.querySelectorAll('[data-n]').forEach(el => co.observe(el));

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(q => q.addEventListener('click', () => {
    const item = q.parentElement, a = item.querySelector('.faq-a'), open = item.classList.contains('open');
    document.querySelectorAll('.faq.open').forEach(f => { f.classList.remove('open'); f.querySelector('.faq-a').style.maxHeight = null; });
    if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  }));

  // lightbox
  const lb = document.querySelector('.lightbox');
  if (lb) {
    document.querySelectorAll('.gal-item img').forEach(img => img.addEventListener('click', () => {
      lb.querySelector('img').src = img.src.replace('-th.jpg', '.jpg'); lb.classList.add('show');
    }));
    lb.addEventListener('click', () => lb.classList.remove('show'));
  }

  // back to top
  const tt = document.querySelector('.to-top');
  window.addEventListener('scroll', () => tt && tt.classList.toggle('show', scrollY > 700));
  tt && tt.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // trial form -> WhatsApp
  const form = document.getElementById('trialForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const msg = `Hi IRONPULSE Gym! I want to book a free trial.%0AName: ${f.get('name')}%0APhone: ${f.get('phone')}%0AGoal: ${f.get('goal')}%0APreferred time: ${f.get('time')}`;
    window.open(`https://wa.me/919822045678?text=${msg.replace(/ /g, '%20')}`, '_blank');
  });

  // BMI calculator
  const bmiForm = document.getElementById('bmiForm');
  if (bmiForm) bmiForm.addEventListener('submit', e => {
    e.preventDefault();
    const h = parseFloat(document.getElementById('bmiH').value) / 100;
    const w = parseFloat(document.getElementById('bmiW').value);
    const age = parseInt(document.getElementById('bmiA').value) || 25;
    const out = document.getElementById('bmiOut');
    if (!h || !w) return;
    const bmi = w / (h * h);
    let cat = 'Normal', tip = 'You are in a healthy range. A strength program will keep you there.';
    if (bmi < 18.5) { cat = 'Underweight'; tip = 'A muscle building program with a guided diet plan suits you best.'; }
    else if (bmi >= 25 && bmi < 30) { cat = 'Overweight'; tip = 'A weight loss program with weekly tracking will work well for you.'; }
    else if (bmi >= 30) { cat = 'Obese'; tip = 'Start with supervised low-impact training. Our coaches will build a safe plan.'; }
    document.getElementById('bmiVal').textContent = bmi.toFixed(1);
    document.getElementById('bmiCat').textContent = cat;
    document.getElementById('bmiTip').textContent = tip + ' (Age noted: ' + age + ')';
    out.style.display = 'block';
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
