"""Database engine setup.

Hardened (2026-08):

  * `connect_args={"check_same_thread": False}` was passed unconditionally. That
    option is SQLite-only, so pointing DATABASE_URL at Postgres crashed with
    `invalid connection option`. It is now applied only for SQLite.
  * The default `sqlite:///./sql_app.db` is relative to the process CWD and
    lives on a read-only filesystem on serverless hosts (Vercel/Lambda allow
    writes only under /tmp), so uploads failed in production. The path is now
    resolved to somewhere actually writable.
  * A Postgres URL that is set but unreachable used to take the app down; we now
    probe it once and fall back to SQLite so the service still boots and serves.
  * `run_migrations()` replaces the hand-run `migrate_db.py`, which never
    executed on a deploy and let production tables drift behind the models.
"""

import os
import re
import tempfile
import urllib.parse

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base


def _normalise(url: str) -> str:
    """Make a hand-pasted Postgres URL safe to parse."""
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    # Supabase-style `user:[YOUR-PASSWORD]@host` and raw #/&/@ in the password
    # both make the URL unparseable. Strip brackets and percent-encode.
    m = re.match(r"^(?P<scheme>[a-z+]+://)(?P<user>[^:/@]+):(?P<pw>.*)@(?P<rest>[^@]+)$", url)
    if m:
        pw = m.group("pw")
        if pw.startswith("[") and pw.endswith("]"):
            pw = pw[1:-1]
        pw = urllib.parse.quote(urllib.parse.unquote(pw), safe="")
        url = f"{m.group('scheme')}{m.group('user')}:{pw}@{m.group('rest')}"
    return url


def _sqlite_fallback() -> str:
    """A SQLite URL pointing somewhere writable on this host."""
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    local = os.path.join(root, "sql_app.db")
    try:
        with open(local, "a"):
            pass
        return f"sqlite:///{local}"
    except OSError:
        return f"sqlite:///{os.path.join(tempfile.gettempdir(), 'sql_app.db')}"


def _make_engine(url: str):
    kwargs = {"pool_pre_ping": True}
    if url.startswith("sqlite"):
        # SQLite-only option; passing it to psycopg2 raises.
        kwargs["connect_args"] = {"check_same_thread": False}
    else:
        kwargs["connect_args"] = {"connect_timeout": 10}
    return create_engine(url, **kwargs)


_configured = os.getenv("DATABASE_URL", "").strip().strip('"')
USING_FALLBACK = False

if not _configured or _configured == "sqlite:///./sql_app.db":
    SQLALCHEMY_DATABASE_URL = _sqlite_fallback()
else:
    SQLALCHEMY_DATABASE_URL = _normalise(_configured)
    try:
        with _make_engine(SQLALCHEMY_DATABASE_URL).connect():
            pass
    except Exception as exc:  # noqa: BLE001 - any failure means "fall back"
        print(f"WARNING: DATABASE_URL unreachable ({type(exc).__name__}: {exc}). "
              f"Falling back to local SQLite so the API can still start.")
        SQLALCHEMY_DATABASE_URL, USING_FALLBACK = _sqlite_fallback(), True

engine = _make_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


_SQL_TYPES = {
    "INTEGER": "INTEGER", "BIGINT": "BIGINT", "VARCHAR": "VARCHAR",
    "TEXT": "TEXT", "DATETIME": "TIMESTAMP", "TIMESTAMP": "TIMESTAMP",
    "BOOLEAN": "BOOLEAN", "FLOAT": "FLOAT", "NUMERIC": "NUMERIC",
    "JSON": "TEXT", "ENUM": "VARCHAR",
}


def run_migrations():
    """Add model columns missing from existing tables. Idempotent, never raises.

    Replaces `migrate_db.py`, which was SQLite-specific, hard-coded four column
    names, and only ran when someone remembered to run it by hand.
    """
    try:
        inspector = inspect(engine)
        existing = set(inspector.get_table_names())
        for table in Base.metadata.sorted_tables:
            if table.name not in existing:
                continue  # create_all() builds it with the full schema
            have = {c["name"] for c in inspector.get_columns(table.name)}
            for column in table.columns:
                if column.name in have or column.primary_key:
                    continue
                sql_type = _SQL_TYPES.get(column.type.__class__.__name__.upper(), "VARCHAR")
                with engine.begin() as conn:
                    conn.execute(text(
                        f'ALTER TABLE {table.name} ADD COLUMN {column.name} {sql_type}'
                    ))
                print(f"Migrated: added {table.name}.{column.name}")
    except Exception as exc:  # noqa: BLE001
        print(f"WARNING: schema migration skipped ({type(exc).__name__}: {exc}).")


def init_db():
    """Create tables and apply migrations. Never raises."""
    try:
        Base.metadata.create_all(bind=engine)
        run_migrations()
    except Exception as exc:  # noqa: BLE001
        print(f"WARNING: database init failed ({type(exc).__name__}: {exc}).")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
