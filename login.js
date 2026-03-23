/* ═══════════════ GYMRATS AUTH ═══════════════ */

// If already logged in, go straight to the app
if (localStorage.getItem('gp5_currentUser')) {
  window.location.replace('index.html');
}

/* ─── Swap logo to real app image ─── */
(function() {
  // Try to find the app logo stored from the main app
  var stored = localStorage.getItem('gp5_appLogo');
  if (stored) {
    var el = document.getElementById('login-logo-img');
    if (el) {
      el.innerHTML = '';
      el.style.background = 'none';
      el.style.padding = '0';
      var img = document.createElement('img');
      img.src = stored;
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;border-radius:12px;';
      el.appendChild(img);
    }
  }
})();

/* ─── Helpers ─── */
function hash(s) {
  return btoa(encodeURIComponent(s));
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem('gp5_users') || '[]'); }
  catch (e) { return []; }
}

function saveUsers(users) {
  localStorage.setItem('gp5_users', JSON.stringify(users));
}

function setError(id, msg) {
  document.getElementById(id).textContent = msg;
}

function setOk(id, msg) {
  var el = document.getElementById(id);
  if (el) el.textContent = msg;
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

  setError('l-err', '');

  if (!email || !pass) {
    setError('l-err', 'Please fill in all fields.');
    return;
  }

  var users = getUsers();
  var user  = users.find(function(u) {
    return u.email === email && u.hash === hash(pass);
  });

  if (!user) {
    setError('l-err', 'Invalid email or password.');
    return;
  }

  localStorage.setItem('gp5_currentUser', email);
  window.location.replace('index.html');
}

/* ─── Register ─── */
function doRegister() {
  var name  = document.getElementById('r-name').value.trim();
  var email = document.getElementById('r-email').value.trim().toLowerCase();
  var pass  = document.getElementById('r-pass').value;

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

  var users = getUsers();

  if (users.find(function(u) { return u.email === email; })) {
    setError('r-err', 'This email is already registered.');
    return;
  }

  users.push({ email: email, hash: hash(pass), name: name });
  saveUsers(users);

  localStorage.setItem('gp5_currentUser', email);
  window.location.replace('index.html');
}

/* ─── Reset Password ─── */
function doReset() {
  var email = document.getElementById('f-email').value.trim().toLowerCase();
  var pass  = document.getElementById('f-pass').value;
  var pass2 = document.getElementById('f-pass2').value;

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

  var users = getUsers();
  var idx   = users.findIndex(function(u) { return u.email === email; });

  if (idx === -1) {
    setError('f-err', 'No account found with this email.');
    return;
  }

  users[idx].hash = hash(pass);
  saveUsers(users);

  setOk('f-ok', 'Password updated! Signing you in…');
  localStorage.setItem('gp5_currentUser', email);

  setTimeout(function() {
    window.location.replace('index.html');
  }, 1200);
}
