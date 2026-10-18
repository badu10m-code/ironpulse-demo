document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1800); };
  let D = ipLoad();
  const save = () => { ipSave(D); D = ipLoad(); };

  // nav
  document.querySelectorAll('.admin-nav button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.admin-nav button').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    document.querySelectorAll('.admin-main > section').forEach(s => s.style.display = 'none');
    $('#sec-' + b.dataset.sec).style.display = 'block';
    render();
  }));

  // dashboard
  function render() {
    D = ipLoad();
    const bk = D.bookings || [], ts = D.testimonials || [], mem = D.members || [], of = D.offers || [];
    $('#dashStats').innerHTML = [
      ['Total Bookings', bk.length], ['Custom Testimonials', ts.length],
      ['WhatsApp Members', mem.length], ['Announcement', D.banner && D.banner.on ? 'ON' : 'OFF'], ['Offers', of.length]
    ].map(([l, n]) => `<div class="a-stat"><div class="n">${n}</div><p>${l}</p></div>`).join('');
    $('#dashRecent').innerHTML = bk.length ? `<table class="a-table"><tr><th>Name</th><th>Phone</th><th>Goal</th><th>When</th></tr>${bk.slice(0, 3).map(b => `<tr><td>${b.ref || '\u2014'}</td><td>${b.name}</td><td>${b.phone}</td><td>${b.goal || ''}</td><td>${b.date || ''}</td></tr>`).join('')}</table>` : '<p class="a-empty">No bookings yet. Fill the contact form on the website or add one below.</p>';
    // bookings
    $('#bkList').innerHTML = bk.length ? `<table class="a-table"><tr><th>Booking ID</th><th>Name</th><th>Phone</th><th>Goal</th><th>Time</th><th>Added</th><th>Actions</th></tr>${bk.map((b, i) => `<tr><td>${b.ref || '\u2014'}</td><td>${b.name}</td><td>${b.phone}</td><td>${b.goal || ''}</td><td>${b.time || ''}</td><td>${b.date || ''}</td><td class="acts"><a class="mini-btn" href="https://wa.me/91${String(b.phone).replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent('Hi ' + b.name + ', IRONPULSE Gym here. Confirming your free trial session.')}" target="_blank">WhatsApp</a><button class="mini-btn red" data-delbk="${i}">Delete</button></td></tr>`).join('')}</table>` : '<p class="a-empty">No bookings yet.</p>';
    // testimonials
    $('#tstList').innerHTML = ts.length ? `<table class="a-table"><tr><th>Member</th><th>Review</th><th>Actions</th></tr>${ts.map((t, i) => `<tr><td>${t.name}<br><small style="color:var(--muted)">${t.tag || ''}</small></td><td style="max-width:420px">${t.text}</td><td class="acts"><button class="mini-btn red" data-deltst="${i}">Delete</button></td></tr>`).join('')}</table>` : '<p class="a-empty">Empty: the website shows the built-in demo reviews. Add one above to take over.</p>';
    // offers
    $('#offList').innerHTML = of.length ? `<table class="a-table"><tr><th>Badge</th><th>Offer</th><th>Details</th><th>Actions</th></tr>${of.map((o, i) => `<tr><td><span style="background:var(--yellow);color:#000;border-radius:20px;padding:4px 10px;font-size:.75rem;font-weight:700">${o.badge}</span></td><td><b>${o.title}</b><br><small style="color:var(--muted)">${o.on === false ? 'hidden on site' : 'live on site'}</small></td><td style="max-width:360px">${o.text}</td><td class="acts"><button class="mini-btn ghost" data-offtog="${i}">${o.on === false ? 'Show' : 'Hide'}</button><button class="mini-btn red" data-deloff="${i}">Delete</button></td></tr>`).join('')}</table>` : '<p class="a-empty">No offers yet. The homepage hides the offers section until one exists.</p>';
    // members
    $('#waList').innerHTML = mem.length ? `<table class="a-table"><tr><th>Name</th><th>Number</th><th>Actions</th></tr>${mem.map((m, i) => `<tr><td>${m.name}</td><td>${m.phone}</td><td class="acts"><button class="mini-btn" data-wasend="${i}">Send Draft</button><button class="mini-btn red" data-delmem="${i}">Remove</button></td></tr>`).join('')}</table>` : '<p class="a-empty">No members added yet.</p>';
  }

  // forms
  $('#bkForm').addEventListener('submit', e => {
    e.preventDefault();
    D.bookings = D.bookings || [];
    D.bookings.unshift({ name: $('#bkName').value, phone: $('#bkPhone').value, goal: $('#bkGoal').value, time: $('#bkTime').value, date: new Date().toLocaleString('en-IN') });
    save(); $('#bkName').value = ''; $('#bkPhone').value = ''; render(); toast('Booking saved');
  });
  $('#tstForm').addEventListener('submit', e => {
    e.preventDefault();
    D.testimonials = D.testimonials || [];
    if (D.testimonials.length >= 8) return toast('Max 8 testimonials');
    D.testimonials.unshift({ name: $('#tstName').value, tag: $('#tstTag').value, text: $('#tstText').value, stars: 5 });
    save(); $('#tstName').value = ''; $('#tstTag').value = ''; $('#tstText').value = ''; render(); toast('Testimonial saved');
  });
  $('#offerForm').addEventListener('submit', e => {
    e.preventDefault();
    D.offers = D.offers || [];
    if (D.offers.length >= 6) return toast('Max 6 offers');
    D.offers.unshift({ badge: $('#offBadge').value, title: $('#offTitle').value, text: $('#offText').value, on: true });
    save(); $('#offBadge').value = ''; $('#offTitle').value = ''; $('#offText').value = ''; render(); toast('Offer saved, homepage updated');
  });
  $('#bannerForm').addEventListener('submit', e => {
    e.preventDefault();
    D.banner = { on: $('#bannerOn').value === '1', text: $('#bannerText').value };
    save(); render(); toast('Announcement saved');
  });
  $('#timeForm').addEventListener('submit', e => {
    e.preventDefault();
    const w = $('#timeWeek').value.trim(), s = $('#timeSun').value.trim();
    if (!w && !s) delete D.timings; else D.timings = { week: w, sun: s };
    save(); toast('Timings saved');
  });
  $('#waAdd').addEventListener('click', () => {
    if (!$('#waName').value || !$('#waPhone').value) return toast('Name and number needed');
    D.members = D.members || [];
    D.members.push({ name: $('#waName').value, phone: $('#waPhone').value });
    save(); $('#waName').value = ''; $('#waPhone').value = ''; render(); toast('Member added');
  });

  // dynamic actions
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.dataset.delbk !== undefined) { D.bookings.splice(+t.dataset.delbk, 1); save(); render(); }
    if (t.dataset.deltst !== undefined) { D.testimonials.splice(+t.dataset.deltst, 1); save(); render(); }
    if (t.dataset.delmem !== undefined) { D.members.splice(+t.dataset.delmem, 1); save(); render(); }
    if (t.dataset.deloff !== undefined) { D.offers.splice(+t.dataset.deloff, 1); save(); render(); }
    if (t.dataset.offtog !== undefined) { const o = D.offers[+t.dataset.offtog]; o.on = o.on === false; save(); render(); toast(o.on === false ? 'Offer hidden' : 'Offer live'); }
    if (t.dataset.wasend !== undefined) {
      const m = D.members[+t.dataset.wasend], msg = ($('#waText').value || 'Hi! IRONPULSE Gym here.').replace('{name}', m.name);
      window.open('https://wa.me/91' + String(m.phone).replace(/\D/g, '').slice(-10) + '?text=' + encodeURIComponent(msg), '_blank');
    }
  });

  // data
  $('#expBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(D, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ironpulse-demo-data.json'; a.click();
  });
  $('#resetBtn').addEventListener('click', () => {
    if (confirm('Delete ALL demo data from this browser?')) { localStorage.removeItem('ironpulse_admin_v1'); D = {}; render(); toast('Reset done'); }
  });

  // prefill forms from saved data
  if (D.banner) { $('#bannerText').value = D.banner.text || ''; $('#bannerOn').value = D.banner.on ? '1' : '0'; }
  if (D.timings) { $('#timeWeek').value = D.timings.week || ''; $('#timeSun').value = D.timings.sun || ''; }
  render();
});
