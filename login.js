/* ═══════════════ GYMRATS AUTH ═══════════════ */

// If already logged in, go straight to the app
if (localStorage.getItem('gp5_currentUser')) {
  window.location.replace('index.html');
}

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

/* ─── View switchers ─── */
function showRegister() {
  document.getElementById('view-login').style.display    = 'none';
  document.getElementById('view-register').style.display = 'block';
  setError('r-err', '');
  document.getElementById('r-name').focus();
}

function showLogin() {
  document.getElementById('view-register').style.display = 'none';
  document.getElementById('view-login').style.display    = 'block';
  setError('l-err', '');
  document.getElementById('l-email').focus();
}
