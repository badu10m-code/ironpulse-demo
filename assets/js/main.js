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
    try {
      const D = ipLoad();
      D.bookings = D.bookings || [];
      D.bookings.unshift({ name: f.get('name'), phone: f.get('phone'), goal: f.get('goal'), time: f.get('time'), date: new Date().toLocaleString('en-IN') });
      ipSave(D);
    } catch(err) {}
    form.style.display = 'none';
    const ok = document.createElement('div');
    ok.className = 'form-success';
    ok.innerHTML = '<b>Request received.</b> Thanks ' + f.get('name') + ', your free trial request is logged. Our team will call you on ' + f.get('phone') + ' to confirm your slot.';
    form.parentNode.appendChild(ok);
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

  // demo-admin overrides: announcement banner, custom testimonials, timings
  const D = ipLoad();
  if (D.banner && D.banner.on && D.banner.text) {
    const bar = document.createElement('div');
    bar.className = 'promo-bar';
    bar.textContent = D.banner.text;
    document.body.prepend(bar);
  }
  const t1 = 'Mon to Sat: 5:30 AM \u2013 11:00 PM \u00a0|\u00a0 Sun: 7:00 AM \u2013 9:00 PM';
  if (D.timings && D.timings.week) document.querySelectorAll('.loc-time').forEach(el => {
    el.innerHTML = '<b>Timings</b>' + D.timings.week + ' \u00a0|\u00a0 ' + (D.timings.sun || '');
  });
  if (D.timings && D.timings.week) document.querySelectorAll('.foot-contact li span').forEach(el => {
    if (el.innerHTML.includes('Mon\u2013Sat')) el.innerHTML = D.timings.week + '<br>' + (D.timings.sun || '');
  });
  if (D.offers && D.offers.filter(o => o.on !== false).length) {
    const list = D.offers.filter(o => o.on !== false);
    const sec = document.createElement('section');
    sec.className = 'sec offers-sec';
    sec.innerHTML = '<div class="sec-head center rv"><span class="kicker">Limited Period</span><h2>Running Offers</h2><p>Enrol this month and lock the founding-member rate.</p></div><div class="offers-grid">' + list.map(o => `<div class="offer-card rv"><span class="offer-badge">${o.badge}</span><h3>${o.title}</h3><p>${o.text}</p><a class="btn btn-y btn-sm" href="contact.html">Claim Offer</a></div>`).join('') + '</div>';
    const foot = document.querySelector('footer') || document.querySelector('.foot');
    if (foot) foot.parentNode.insertBefore(sec, foot);
  }
  const grids = Array.from(document.querySelectorAll('.tst-grid')).filter(g => g.querySelector('.stars'));
  if (D.testimonials && D.testimonials.length && grids.length) {
    grids.forEach(g => {
      g.innerHTML = D.testimonials.map((t, i) => `<div class="tst-card rv in${' d'+(i%3)}"><span class="stars">${'\u2605'.repeat(t.stars||5)}${'\u2606'.repeat(5-(t.stars||5))}</span><p>${t.text}</p><div class="tst-who"><div class="av">${(t.name||'M').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div><div><b>${t.name}</b><small>${t.tag||'Member'}</small></div></div></div>`).join('');
    });
  }
});
