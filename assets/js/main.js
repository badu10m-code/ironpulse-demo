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
    const ref = 'IP-' + Date.now().toString(36).toUpperCase().slice(-6);
    const b = { ref, name: f.get('name'), phone: f.get('phone'), goal: f.get('goal'), time: f.get('time'), date: new Date().toLocaleString('en-IN') };
    try {
      const D = ipLoad();
      D.bookings = D.bookings || [];
      D.bookings.unshift(b);
      ipSave(D);
      const mine = JSON.parse(localStorage.getItem('ironpulse_my_bookings') || '[]');
      mine.unshift(b);
      localStorage.setItem('ironpulse_my_bookings', JSON.stringify(mine));
      renderCart();
    } catch(err) {}
    form.style.display = 'none';
    const ok = document.createElement('div');
    ok.className = 'book-congrats';
    ok.innerHTML = '<div class="bc-check">\u2713</div><h3>Congratulations, ' + b.name + '!</h3><p>Your free trial session is booked. Our team will call you on ' + b.phone + ' to confirm your slot.</p><div class="bc-details"><span><b>Booking ID</b>' + ref + '</span><span><b>Goal</b>' + b.goal + '</span><span><b>Preferred Time</b>' + b.time + '</span></div><button class="btn btn-y btn-sm" id="bcView" type="button">View My Booking</button><small>You can see this booking any time from the My Booking button on every page.</small>';
    form.parentNode.appendChild(ok);
    ok.querySelector('#bcView').addEventListener('click', openCart);
    ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  // my-booking cart panel (injected on every page)
  const wrap = document.createElement('div');
  wrap.innerHTML = '<button class="cart-float" aria-label="My bookings"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16v4a2 2 0 000 4v4H4v-4a2 2 0 000-4V7z"/><path d="M13 7v12" stroke-dasharray="2 3"/></svg><span class="cart-badge" hidden>0</span></button><div class="cart-backdrop"></div><aside class="cart-drawer"><div class="cart-head"><h3>My Booking</h3><button class="cart-close" aria-label="Close">\u00d7</button></div><div class="cart-items"></div></aside>';
  document.body.appendChild(wrap);
  const back = wrap.querySelector('.cart-backdrop'), drawer = wrap.querySelector('.cart-drawer'), btn = wrap.querySelector('.cart-float'), badge = wrap.querySelector('.cart-badge'), items = wrap.querySelector('.cart-items');
  function openCart() { drawer.classList.add('open'); back.classList.add('show'); renderCart(); }
  function closeCart() { drawer.classList.remove('open'); back.classList.remove('show'); }
  btn.addEventListener('click', openCart);
  wrap.querySelector('.cart-close').addEventListener('click', closeCart);
  back.addEventListener('click', closeCart);
  window.renderCart = function() {
    let mine = [];
    try { mine = JSON.parse(localStorage.getItem('ironpulse_my_bookings') || '[]'); } catch(e) {}
    badge.hidden = mine.length === 0;
    badge.textContent = mine.length;
    items.innerHTML = mine.length ? mine.map(b =>
      '<div class="cart-item"><div class="ci-top"><span class="ci-ref">' + b.ref + '</span><span class="ci-status">Confirmed</span></div><b>' + b.name + '</b><div class="ci-rows"><span>Goal: ' + b.goal + '</span><span>Preferred time: ' + b.time + '</span><span>Booked on: ' + b.date + '</span></div><button class="ci-cancel" data-ref="' + b.ref + '" type="button">Cancel Booking</button></div>').join('') : '<p class="cart-empty">No bookings yet.<br>Book a free trial and it will show up here.</p>';
    items.querySelectorAll('.ci-cancel').forEach(x => x.addEventListener('click', () => {
      if (!confirm('Cancel booking ' + x.dataset.ref + '?')) return;
      try {
        localStorage.setItem('ironpulse_my_bookings', JSON.stringify(mine.filter(m => m.ref !== x.dataset.ref)));
        const D = ipLoad();
        D.bookings = (D.bookings || []).filter(m => m.ref !== x.dataset.ref);
        ipSave(D);
      } catch(err) {}
      renderCart();
    }));
  };
  renderCart();
});
