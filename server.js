const express = require('express');
const cors    = require('cors');
const path    = require('path');
const db      = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

/* ── Upsert training session (type, meta, done flag) ── */
app.post('/api/session', function(req, res) {
  var b = req.body;
  if (!b.email || !b.date) return res.status(400).json({ error: 'email and date required' });
  try {
    db.upsertSession(b.email, b.date, b.type, b.duration_min, b.sauna_reps, b.sauna_min, b.done);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ── Upsert exercise entry within a session ── */
app.post('/api/session/exercise', function(req, res) {
  var b = req.body;
  if (!b.email || !b.date || !b.exercise_id) return res.status(400).json({ error: 'email, date and exercise_id required' });
  try {
    db.upsertSessionExercise(b.email, b.date, b.exercise_id, b.exercise_name, b.sets, b.reps, b.weight, b.done);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ── Upsert exercise record (working weight + PR) ── */
app.post('/api/record', function(req, res) {
  var b = req.body;
  if (!b.email || !b.exercise_id) return res.status(400).json({ error: 'email and exercise_id required' });
  try {
    db.upsertRecord(b.email, b.exercise_id, b.exercise_name, b.working_weight, b.pr_value, b.pr_gym);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ── Upsert user profile ── */
app.post('/api/user', function(req, res) {
  var b = req.body;
  if (!b.email) return res.status(400).json({ error: 'email required' });
  try {
    db.upsertUser(b.email, b.name, b.surname);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ── Get full training history for a user ── */
app.get('/api/history/:email', function(req, res) {
  try {
    res.json(db.getHistory(req.params.email));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ── Get exercise records for a user ── */
app.get('/api/records/:email', function(req, res) {
  try {
    res.json(db.getRecords(req.params.email));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('GymRats server running on http://localhost:' + PORT);
});
