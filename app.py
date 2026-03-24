import sqlite3
import os
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='.', static_url_path='')

DB_PATH = os.path.join(os.path.dirname(__file__), 'gymrats.db')


def get_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    return db


def init_db():
    db = get_db()
    db.executescript('''
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
    ''')
    db.commit()
    db.close()


def ensure_user(db, email):
    db.execute('INSERT OR IGNORE INTO users(email) VALUES(?)', (email,))


# ── Serve the frontend ──────────────────────────────────────────────────────

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


# ── Upsert user profile ─────────────────────────────────────────────────────

@app.route('/api/user', methods=['POST'])
def upsert_user():
    b = request.get_json() or {}
    email = (b.get('email') or '').strip().lower()
    if not email:
        return jsonify(error='email required'), 400
    db = get_db()
    try:
        db.execute('''
            INSERT INTO users(email, name, surname)
            VALUES(?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
                name    = excluded.name,
                surname = excluded.surname
        ''', (email, b.get('name', ''), b.get('surname', '')))
        db.commit()
        return jsonify(ok=True)
    except Exception as e:
        return jsonify(error=str(e)), 500
    finally:
        db.close()


# ── Upsert training session ─────────────────────────────────────────────────

@app.route('/api/session', methods=['POST'])
def upsert_session():
    b = request.get_json() or {}
    email = (b.get('email') or '').strip().lower()
    date  = b.get('date', '')
    if not email or not date:
        return jsonify(error='email and date required'), 400
    db = get_db()
    try:
        ensure_user(db, email)
        db.execute('''
            INSERT INTO training_sessions
                (user_email, session_date, training_type, duration_min, sauna_reps, sauna_min, done, updated_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, datetime('now'))
            ON CONFLICT(user_email, session_date) DO UPDATE SET
                training_type = COALESCE(excluded.training_type, training_type),
                duration_min  = COALESCE(excluded.duration_min,  duration_min),
                sauna_reps    = COALESCE(excluded.sauna_reps,    sauna_reps),
                sauna_min     = COALESCE(excluded.sauna_min,     sauna_min),
                done          = excluded.done,
                updated_at    = datetime('now')
        ''', (
            email, date,
            b.get('type') or '—',
            b.get('duration_min'),
            b.get('sauna_reps'),
            b.get('sauna_min'),
            1 if b.get('done') else 0,
        ))
        db.commit()
        return jsonify(ok=True)
    except Exception as e:
        return jsonify(error=str(e)), 500
    finally:
        db.close()


# ── Upsert exercise entry in a session ─────────────────────────────────────

@app.route('/api/session/exercise', methods=['POST'])
def upsert_session_exercise():
    b = request.get_json() or {}
    email       = (b.get('email') or '').strip().lower()
    date        = b.get('date', '')
    exercise_id = b.get('exercise_id', '')
    if not email or not date or not exercise_id:
        return jsonify(error='email, date and exercise_id required'), 400
    db = get_db()
    try:
        ensure_user(db, email)
        db.execute('''
            INSERT INTO session_exercises
                (user_email, session_date, exercise_id, exercise_name, sets, reps, weight, done)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_email, session_date, exercise_id) DO UPDATE SET
                exercise_name = COALESCE(excluded.exercise_name, exercise_name),
                sets          = COALESCE(excluded.sets,   sets),
                reps          = COALESCE(excluded.reps,   reps),
                weight        = COALESCE(excluded.weight, weight),
                done          = excluded.done
        ''', (
            email, date, exercise_id,
            b.get('exercise_name') or '',
            b.get('sets'),
            b.get('reps'),
            b.get('weight'),
            1 if b.get('done') else 0,
        ))
        db.commit()
        return jsonify(ok=True)
    except Exception as e:
        return jsonify(error=str(e)), 500
    finally:
        db.close()


# ── Upsert exercise record (working weight + PR) ────────────────────────────

@app.route('/api/record', methods=['POST'])
def upsert_record():
    b = request.get_json() or {}
    email       = (b.get('email') or '').strip().lower()
    exercise_id = b.get('exercise_id', '')
    if not email or not exercise_id:
        return jsonify(error='email and exercise_id required'), 400
    db = get_db()
    try:
        ensure_user(db, email)
        db.execute('''
            INSERT INTO exercise_records
                (user_email, exercise_id, exercise_name, working_weight, pr_value, pr_gym, updated_at)
            VALUES(?, ?, ?, ?, ?, ?, datetime('now'))
            ON CONFLICT(user_email, exercise_id) DO UPDATE SET
                exercise_name  = COALESCE(excluded.exercise_name, exercise_name),
                working_weight = CASE WHEN excluded.working_weight = 0
                                      THEN working_weight
                                      ELSE excluded.working_weight END,
                pr_value       = CASE WHEN excluded.pr_value = '—'
                                      THEN pr_value
                                      ELSE excluded.pr_value END,
                pr_gym         = excluded.pr_gym,
                updated_at     = datetime('now')
        ''', (
            email, exercise_id,
            b.get('exercise_name') or '',
            b.get('working_weight') or 0,
            b.get('pr_value') or '—',
            b.get('pr_gym') or '',
        ))
        db.commit()
        return jsonify(ok=True)
    except Exception as e:
        return jsonify(error=str(e)), 500
    finally:
        db.close()


# ── Get full training history for a user ───────────────────────────────────

@app.route('/api/history/<email>')
def get_history(email):
    db = get_db()
    try:
        sessions = db.execute('''
            SELECT * FROM training_sessions
            WHERE user_email = ?
            ORDER BY session_date DESC
        ''', (email.lower(),)).fetchall()
        result = []
        for s in sessions:
            s_dict = dict(s)
            s_dict['exercises'] = [dict(e) for e in db.execute('''
                SELECT * FROM session_exercises
                WHERE user_email = ? AND session_date = ?
                ORDER BY created_at ASC
            ''', (email.lower(), s['session_date'])).fetchall()]
            result.append(s_dict)
        return jsonify(result)
    except Exception as e:
        return jsonify(error=str(e)), 500
    finally:
        db.close()


# ── Get exercise records for a user ────────────────────────────────────────

@app.route('/api/records/<email>')
def get_records(email):
    db = get_db()
    try:
        rows = db.execute('''
            SELECT * FROM exercise_records
            WHERE user_email = ?
            ORDER BY exercise_name ASC
        ''', (email.lower(),)).fetchall()
        return jsonify([dict(r) for r in rows])
    except Exception as e:
        return jsonify(error=str(e)), 500
    finally:
        db.close()


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
