// IRONPULSE demo admin data bridge (localStorage)
function ipLoad(){ try { return JSON.parse(localStorage.getItem('ironpulse_admin_v1')) || {}; } catch(e){ return {}; } }
function ipSave(d){ localStorage.setItem('ironpulse_admin_v1', JSON.stringify(d)); }
