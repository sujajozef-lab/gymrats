const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'gymrats.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT UNIQUE NOT NULL,
    name        TEXT DEFAULT '',
    surname     TEXT DEFAULT '',
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS training_sessions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email    TEXT NOT NULL,
    session_date  TEXT NOT NULL,
    training_type TEXT DEFAULT '—',
    duration_min  INTEGER,
    sauna_reps    INTEGER,
    sauna_min     INTEGER,
    done          INTEGER DEFAULT 0,
    created_at    TEXT DEFAULT (datetime('now')),
    updated_at    TEXT DEFAULT (datetime('now')),
    UNIQUE(user_email, session_date)
  );

  CREATE TABLE IF NOT EXISTS session_exercises (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email    TEXT NOT NULL,
    session_date  TEXT NOT NULL,
    exercise_id   TEXT NOT NULL,
    exercise_name TEXT DEFAULT '',
    sets          INTEGER,
    reps          TEXT,
    weight        REAL,
    done          INTEGER DEFAULT 0,
    created_at    TEXT DEFAULT (datetime('now')),
    UNIQUE(user_email, session_date, exercise_id)
  );

  CREATE TABLE IF NOT EXISTS exercise_records (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email      TEXT NOT NULL,
    exercise_id     TEXT NOT NULL,
    exercise_name   TEXT DEFAULT '',
    working_weight  REAL DEFAULT 0,
    pr_value        TEXT DEFAULT '—',
    pr_gym          TEXT DEFAULT '',
    updated_at      TEXT DEFAULT (datetime('now')),
    UNIQUE(user_email, exercise_id)
  );
`);

function ensureUser(email) {
  db.prepare('INSERT OR IGNORE INTO users(email) VALUES(?)').run(email);
}

module.exports = {

  upsertUser(email, name, surname) {
    db.prepare(`
      INSERT INTO users(email, name, surname)
      VALUES(?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        name    = excluded.name,
        surname = excluded.surname
    `).run(email, name || '', surname || '');
  },

  upsertSession(email, date, type, duration_min, sauna_reps, sauna_min, done) {
    ensureUser(email);
    db.prepare(`
      INSERT INTO training_sessions(user_email, session_date, training_type, duration_min, sauna_reps, sauna_min, done, updated_at)
      VALUES(?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(user_email, session_date) DO UPDATE SET
        training_type = COALESCE(excluded.training_type, training_type),
        duration_min  = COALESCE(excluded.duration_min,  duration_min),
        sauna_reps    = COALESCE(excluded.sauna_reps,    sauna_reps),
        sauna_min     = COALESCE(excluded.sauna_min,     sauna_min),
        done          = excluded.done,
        updated_at    = datetime('now')
    `).run(
      email, date,
      type || '—',
      duration_min != null ? duration_min : null,
      sauna_reps   != null ? sauna_reps   : null,
      sauna_min    != null ? sauna_min    : null,
      done ? 1 : 0
    );
  },

  upsertSessionExercise(email, date, exercise_id, exercise_name, sets, reps, weight, done) {
    ensureUser(email);
    db.prepare(`
      INSERT INTO session_exercises(user_email, session_date, exercise_id, exercise_name, sets, reps, weight, done)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_email, session_date, exercise_id) DO UPDATE SET
        exercise_name = COALESCE(excluded.exercise_name, exercise_name),
        sets          = COALESCE(excluded.sets,   sets),
        reps          = COALESCE(excluded.reps,   reps),
        weight        = COALESCE(excluded.weight, weight),
        done          = excluded.done
    `).run(
      email, date, exercise_id,
      exercise_name || '',
      sets   != null ? sets   : null,
      reps   != null ? reps   : null,
      weight != null ? weight : null,
      done ? 1 : 0
    );
  },

  upsertRecord(email, exercise_id, exercise_name, working_weight, pr_value, pr_gym) {
    ensureUser(email);
    db.prepare(`
      INSERT INTO exercise_records(user_email, exercise_id, exercise_name, working_weight, pr_value, pr_gym, updated_at)
      VALUES(?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(user_email, exercise_id) DO UPDATE SET
        exercise_name  = COALESCE(excluded.exercise_name, exercise_name),
        working_weight = excluded.working_weight,
        pr_value       = excluded.pr_value,
        pr_gym         = excluded.pr_gym,
        updated_at     = datetime('now')
    `).run(
      email, exercise_id,
      exercise_name  || '',
      working_weight != null ? working_weight : 0,
      pr_value       || '—',
      pr_gym         || ''
    );
  },

  getHistory(email) {
    const sessions = db.prepare(`
      SELECT * FROM training_sessions
      WHERE user_email = ?
      ORDER BY session_date DESC
    `).all(email);

    sessions.forEach(function(s) {
      s.exercises = db.prepare(`
        SELECT * FROM session_exercises
        WHERE user_email = ? AND session_date = ?
        ORDER BY created_at ASC
      `).all(email, s.session_date);
    });

    return sessions;
  },

  getRecords(email) {
    return db.prepare(`
      SELECT * FROM exercise_records
      WHERE user_email = ?
      ORDER BY exercise_name ASC
    `).all(email);
  }

};
