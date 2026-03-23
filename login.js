/* ═══════════════ GYMRATS AUTH ═══════════════ */

var API_BASE = 'http://localhost:8000';

// If already logged in, go straight to the app
if (localStorage.getItem('gp5_currentUser') && localStorage.getItem('gp5_apiToken')) {
  window.location.replace('index.html');
}

/* ─── Helpers ─── */
function setError(id, msg) {
  document.getElementById(id).textContent = msg;
}

function setOk(id, msg) {
  var el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function setBtnLoading(btn, loading) {
  btn.disabled = loading;
  btn.style.opacity = loading ? '0.7' : '';
}

function apiPost(path, body, callback) {
  fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  .then(function(r) { return r.json(); })
  .then(callback)
  .catch(function() {
    callback({ ok: false, error: 'Cannot reach server. Is the backend running?' });
  });
}

/* ─── View switchers ─── */
function hideAll() {
  ['view-login', 'view-register', 'view-forgot'].forEach(function(id) {
    document.getElementById(id).style.display = 'none';
  });
}

function showLogin() {
  hideAll();
  document.getElementById('view-login').style.display = 'block';
  setError('l-err', '');
  document.getElementById('l-email').focus();
}

function showRegister() {
  hideAll();
  document.getElementById('view-register').style.display = 'block';
  setError('r-err', '');
  document.getElementById('r-name').focus();
}

function showForgot() {
  hideAll();
  document.getElementById('view-forgot').style.display = 'block';
  setError('f-err', '');
  setOk('f-ok', '');
  document.getElementById('f-email').focus();
}

/* ─── Login ─── */
function doLogin() {
  var email = document.getElementById('l-email').value.trim().toLowerCase();
  var pass  = document.getElementById('l-pass').value;
  var btn   = document.querySelector('#view-login .login-btn');

  setError('l-err', '');

  if (!email || !pass) {
    setError('l-err', 'Please fill in all fields.');
    return;
  }

  setBtnLoading(btn, true);
  apiPost('/api/login/', { email: email, password: pass }, function(res) {
    setBtnLoading(btn, false);
    if (!res.ok) {
      setError('l-err', res.error || 'Login failed.');
      return;
    }
    localStorage.setItem('gp5_currentUser', res.email);
    localStorage.setItem('gp5_apiToken', res.token);
    localStorage.setItem('gp5_regdata_' + res.email, JSON.stringify({ name: res.name, email: res.email }));
    window.location.replace('index.html');
  });
}

/* ─── Register ─── */
function doRegister() {
  var name  = document.getElementById('r-name').value.trim();
  var email = document.getElementById('r-email').value.trim().toLowerCase();
  var pass  = document.getElementById('r-pass').value;
  var btn   = document.querySelector('#view-register .login-btn');

  setError('r-err', '');

  if (!name || !email || !pass) {
    setError('r-err', 'Please fill in all fields.');
    return;
  }
  if (pass.length < 6) {
    setError('r-err', 'Password must be at least 6 characters.');
    return;
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    setError('r-err', 'Please enter a valid email address.');
    return;
  }

  setBtnLoading(btn, true);
  apiPost('/api/register/', { email: email, name: name, password: pass }, function(res) {
    setBtnLoading(btn, false);
    if (!res.ok) {
      setError('r-err', res.error || 'Registration failed.');
      return;
    }
    localStorage.setItem('gp5_currentUser', res.email);
    localStorage.setItem('gp5_apiToken', res.token);
    localStorage.setItem('gp5_regdata_' + res.email, JSON.stringify({ name: res.name, email: res.email }));
    window.location.replace('index.html');
  });
}

/* ─── Reset Password ─── */
function doReset() {
  var email = document.getElementById('f-email').value.trim().toLowerCase();
  var pass  = document.getElementById('f-pass').value;
  var pass2 = document.getElementById('f-pass2').value;
  var btn   = document.querySelector('#view-forgot .login-btn');

  setError('f-err', '');
  setOk('f-ok', '');

  if (!email || !pass || !pass2) {
    setError('f-err', 'Please fill in all fields.');
    return;
  }
  if (pass !== pass2) {
    setError('f-err', 'Passwords do not match.');
    return;
  }
  if (pass.length < 6) {
    setError('f-err', 'Password must be at least 6 characters.');
    return;
  }

  setBtnLoading(btn, true);
  apiPost('/api/password/reset/', { email: email, password: pass, password2: pass2 }, function(res) {
    setBtnLoading(btn, false);
    if (!res.ok) {
      setError('f-err', res.error || 'Reset failed.');
      return;
    }
    setOk('f-ok', 'Password updated! Signing you in…');
    localStorage.setItem('gp5_currentUser', res.email);
    localStorage.setItem('gp5_apiToken', res.token);
    setTimeout(function() { window.location.replace('index.html'); }, 1200);
  });
}
