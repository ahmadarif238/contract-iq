import sqlite3
import os

DB_FILE = "sql_app.db"

def migrate():
    if not os.path.exists(DB_FILE):
        print(f"Database file {DB_FILE} not found. Skipping migration.")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # defined columns to add: name, type
    columns_to_add = [
        ("start_date", "DATETIME"),
        ("end_date", "DATETIME"),
        ("renewal_terms", "TEXT"),
        ("notice_period_days", "INTEGER")
    ]

    print(f"Checking {DB_FILE} for missing columns...")
    
    # Get existing columns
    cursor.execute("PRAGMA table_info(contracts)")
    existing_columns = [row[1] for row in cursor.fetchall()]
    
    for col_name, col_type in columns_to_add:
        if col_name not in existing_columns:
            print(f"Adding column: {col_name} ({col_type})")
            try:
                cursor.execute(f"ALTER TABLE contracts ADD COLUMN {col_name} {col_type}")
            except Exception as e:
                print(f"Error adding {col_name}: {e}")
        else:
            print(f"Column {col_name} already exists.")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
